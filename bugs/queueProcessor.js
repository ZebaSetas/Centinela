require('dotenv').config()
const Repository = require('./repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const EnvironmentService = require('./services/environment-service')
const UserService = require('./services/user-service')
const QueueService = require('./services/queue-service')
const environmentService = new EnvironmentService()
const userService = new UserService()
const config = require('config');

(async() => {
  try {
    let environmentQueue = new QueueService(config.microservice_name +
      "_queue")
    await Repository.initRepository()
    logger.info(`Bug queue-processor worker started`)
    await environmentQueue.process(['environment.create', 'user.create']
      , processJob)
  } catch (err) {
    logger.error(`Failed to start worker: ${err}`)
    process.exit(1)
  }
})()

async function processJob(job) {
  try {
    var topicReceived = job.topic
    delete job.topic
    if (topicReceived === 'environment.create') {
      processEnvironment(job)
    } else if (topicReceived === 'user.create') {
      processUser(job)
    } else {
      logger.warn(
        `Unable to process job ${JSON.stringify(job)}, REASON: the topic ${topicReceived} is not recognized`
      )
    }
  } catch (err) {
    logger.error(
      `Unable to process job ${JSON.stringify(job)}, REASON: ${err.message}`)
  }
}

async function processEnvironment(environment) {
  try {
    console.log(environment)
    let result = await environmentService.createForeignRelationTables(
      environment)
    logger.debug(
      `Environment ${result.id} was created successfully - DEBUG: ${JSON.stringify(result)}`
    )
  } catch (err) {
    logger.error(
      `Unable to process environment ${JSON.stringify(environment)}, REASON: ${err.message}`
    )
  }
}

async function processUser(user) {
  try {
    let result = await userService.createForeignRelationTables(
      user)
    logger.info(`User ${result.id} was created successfully`)
    logger.debug(
      `User ${result.id} was created successfully - DEBUG: ${JSON.stringify(result)}`
    )
  } catch (err) {
    logger.error(
      "Unable to process user " + JSON.stringify(user) +
      `REASON: ${err.message}`)
  }

}
