require('dotenv').config()
require('newrelic')
const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const Repository = require('./repositories/repository')
const exposeRoutes = require('./routes/v1')
const app = express()
const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const httpContext = require('express-http-context');
const schedule = require('node-schedule');
const MailGenerator = require('./services/mailGenerator-service')

const port = process.env.PORT
const JOB_ALERT_FREQUENCY_MINUTES = process.env.JOB_ALERT_FREQUENCY_MINUTES ||
  10
const JOB_DAILY_REPORT_HOUR = process.env.JOB_DAILY_REPORT_HOUR || 22
const NUMBER_OF_DAYS_TO_RETRIEVE = process.env.NUMBER_OF_DAYS_TO_RETRIEVE || 2

const QueueService = require('./services/queue-service')
const bugQueue = new QueueService(config.microservice_name)

const PreferenceService = require('./services/preference-service')
const prefService = new PreferenceService()

const GPreferenceService = require('./services/generalPreference-service')
const gPrefService = new GPreferenceService()

const BugRepository = require('./repositories/bug-repository')
const bugRepo = new BugRepository()

const {
  v4: uuidv4
} = require('uuid')

var options = {
  explorer: true
}

app.use('/api/v1/docs'
  , swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(httpContext.middleware);
app.use(function (req, res, next) {
  var transactionId = req.headers['transaction-id']
  if (transactionId) httpContext.set('Transaction-ID', transactionId)
  else httpContext.set('Transaction-ID', uuidv4())
  var auth = httpContext.get('Authorization')
  if (auth) httpContext.set('Authorization', auth)
  next();
});

var webServer
app.use(cors());
(async() => {
  try {
    await Repository.initRepository()
    scheduleJobOfDailyBugReport(JOB_ALERT_FREQUENCY_MINUTES)
    scheduleJobOfUnresolvedBugs(JOB_DAILY_REPORT_HOUR)
    bugQueue.process(['bug.update'], processIncomingBug)

    webServer = app.listen(port, function () {
      logger.info(
        `Centinela ${config.microservice_name} running on port ${port}`
      )
      setTerminalTitle(config.microservice_name);
    })

  } catch (err) {
    logger.error(`Failed to start server: ${err}`)
    process.exit(1)
  }
})()

exposeRoutes(app)

function scheduleJobOfDailyBugReport(JOB_FREQUENCY_MINUTES) {
  logger.debug(
    `Scheduling JOB for sending daily reports of assigned bugs to a user every ${JOB_FREQUENCY_MINUTES} minutes`
  )
  schedule.scheduleJob(`*/${JOB_FREQUENCY_MINUTES} * * * *`, async function () {
    const date = new Date()
    logger.debug(
      `Running report task every ${JOB_FREQUENCY_MINUTES} minute`);
    var preferences = await prefService.
    getPreferencesToProcess(JOB_FREQUENCY_MINUTES)
    if (preferences.length > 0) { //If the are preferences to take action
      logger.debug(`Found ${preferences.length} preferences to process`)
      for (let index = 0; index < preferences.length; index++) { //Work on each preference
        let pref = preferences[index];
        logger.debug(
          `Requesting report for user:${pref.userId} of bugs with severity: ${pref.severity}`
        )
        if (pref.lastSent === undefined) {
          var andOldDate = new Date(2000, 01, 01)
          pref.lastSent = andOldDate
        }
        //Request bugs based on userId and severity that were updated after last email was sent.
        let bugs = await bugRepo.
        getByUserIdAndSeverity(pref.userId, pref.severity, pref.lastSent)
        if (bugs.length > 0) {
          const email = MailGenerator.newReportEmail(bugs, pref.userEmail)
          bugQueue.send('notification.email', email)
          logger.info(
              `Report of bugs with severity ${pref.severity} for userId ${pref.userId} was queued to be sent`
            )
            //Updating preference with lastSent = current time
          pref.lastSent = date;
          await prefService.updatePreference(pref)
        } else {
          logger.debug(
            `Matching preference for userId ${pref.userId} but no bugs to be reported`
          )
        }
      }

    } else {
      logger.debug(`No preferences to process at this time`)
    }
    //borar bugs que ya no deben ser reportados

  })
  logger.debug(`JOB scheduled successfully`)
}

function scheduleJobOfUnresolvedBugs(hour) {
  const DAYS = NUMBER_OF_DAYS_TO_RETRIEVE
  logger.debug(
      `Scheduling JOB for sending a daily report of unresolved bugs at ${hour} hs`
    )
    // Envía correo a las hour:00:00  
  schedule.scheduleJob(`0 0 ${hour} * * *`, async function () {
    logger.debug(`Querying for general preferences to process`)
    const enabledGeneralPreferences = await gPrefService.getGeneralPreferencesToProcess();
    if (enabledGeneralPreferences.length > 0) { //If there are general preferences to process.
      logger.info(
        `Found ${enabledGeneralPreferences.length} general preferences to process`
      )
      const users = enabledGeneralPreferences.map(function (x) {
        return x.userId
      })
      logger.debug(
          `These are te users that have enabled general preferences. Will query bugs for them. Ids:${JSON.stringify(users)}`
        )
        //Get all the bugs that need to be processed
      const bugs = await bugRepo.getUnresolvedBugsForUsers(users, DAYS)
      if (bugs.length > 0) { //If there are bugs to process
        //For each enabled preference filter matching bugs and send the notification
        for (let index = 0; index < enabledGeneralPreferences.length; index++) {
          const gPref = enabledGeneralPreferences[index]
            //Filter the bugs of matching user
          const userbugs = bugs.filter(x => x.userId == gPref.userId)
          if (userbugs.length > 0) { //If there is a user with unresolved bugs, prepare email
            const email = MailGenerator.newOldBugsReportEmail(
              userbugs, gPref.userEmail, DAYS)
            bugQueue.send('notification.email', email) //QUEUE the generated notification email for dispatch
            logger.info(
              `Queued notification of pending bugs older than ${DAYS} days for userId: ${gPref.userId}`
            )
            logger.debug(
              `Queued notification of pending bugs older than ${DAYS} days for userId: ${gPref.userId}. BUGS are: ${JSON.stringify(userbugs)}`
            )
          } else { //This user has enabled preference but not pending bugs
            logger.debug(
              `User ${gPref.userId} has no bugs older than ${DAYS} days`
            )
          }
        }
      } else {
        logger.debug(`There are no bugs to process right now`)
      }
    } else {
      logger.debug(`There are no general preferences to process right now`)
    }
  })
}

async function processIncomingBug(bug) {
  delete bug.topic
  bug.stateId = bug.state.id
  delete bug.state
  logger.debug(
    `New bug has arrived and will be processed. DEBUG: ${JSON.stringify(bug)}`
  );
  if (bug.userId != null) { //Checks if the incoming bug has been ASSIGNED to a user, Take ACTION ONLY IF it's ASSIGNED
    if (bug.stateId == 2) { //Checks if the incoming bug has been CLOSED
      try { //Action if bug is CLOSED is to delete it from the Database
        logger.debug(
          `Bug ${bug.id} has been resolved, if exists will be deleted from the DB`
        )
        await bugRepo.delete(bug)
        logger.info(
          `Bug ${bug.id} deleted from the DB as it has been resolved`
        )
      } catch (err) {
        logger.error(`Error deleting bug from DB. Error:${err.message}`)
      }
    } else { //Actions if bug is OPEN is to SAVE it in the DB and check if immediate notifications needs to be sent
      logger.debug(`This bug will be inserted or updated in the DB`)
      try { //1st GET possible immediate PREFERENCES the user may have to send immediate notifications for the incoming bug severity
        var immediatePrefs = await prefService
          .getImmediatePreferencesToProcess(bug.userId, bug.severity)
        if (immediatePrefs.length > 0) { //2nd If there are immediate preferences, generate email and send notification
          for (let index = 0; index < immediatePrefs.length; index++) {
            const pref = immediatePrefs[index]
            const email = MailGenerator.newBugEmail(bug, pref.userEmail)
            bugQueue.send('notification.email', email) //QUEUE the generated notification email for dispatch
            logger.info(
              `Immediate notification of bug ${bug.id} was generated for user ${pref.userId}`
            )
          }
        } else { //If there are NOT immediate preferences DO NOT send notification
          logger.debug(
            `No immediate notifications to be sent for this bug. DEBUG: ${JSON.stringify(bug)}`
          )
        } //SAVE or UPDATE the BUG in the DATABASE
        await bugRepo.upsert(bug)
        logger.info(`Bug ${bug.id} saved or updated in DB`)
      } catch (err) {
        logger.error(`Could not save bug in DB. Error: ${err.message}`)
      }
    }
  } else { //This Bug is not assigned to any user, NO ACTIONS
    logger.debug(`Bug is not assigned to any user, discarding`)
  }
}

function setTerminalTitle(title) {
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}

process.on("SIGINT", function () {
  logger.info('Closing application');
  webServer.close();
  process.exit(0);
});
