require('dotenv').config()
const config = require('config')
const Repository = require('./repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const BugService = require('./services/bug-service')
const UserService = require('./services/user-service')
const Queue = require('./services/queue-service')
const bugService = new BugService()
const userService = new UserService()

const processQueue = async(job) => {
  try {
    let queueTopic = job.topic

    if (queueTopic === 'bug.create')
      createBug(job)
    else if (queueTopic === 'bug.update')
      updateBug(job)
    else if (queueTopic === 'user.create')
      createUser(job)
    else
      logger.warn(
        `Unable to process job ${JSON.stringify(job)}, REASON: the topic ${queueTopic} is not recognized`
      )
  } catch (error) {
    logger.error(
      `Unable to process job ${JSON.stringify(job)}, REASON: ${error.message}`
    )
  }
}

async function createBug(bug) {
  try {
    let result = await bugService.createBug(bug)
    logger.info(`Bug ${result.id} was created successfully`)
    logger.debug(
      `Bug ${result.id} was created successfully - DEBUG: ${JSON.stringify(result)}`
    )
  } catch (err) {
    logger.error(`There was an error saving a bug: ${err.message}`)
    throw new Error(`Error processing bug`)
  }
}

async function updateBug(bug) {
  try {
    let result = await bugService.updateBug(bug)
    logger.info(`Bug ${result.id} was updated successfully`)
    logger.debug(
      `Bug ${result.id} was updated successfully - DEBUG: ${JSON.stringify(result)}`
    )
  } catch (err) {
    logger.error(`There was an error updating the bug: ${err.message}`)
    throw new Error(`Error processing bug`)
  }
}

async function createUser(user) {
  try {
    let result = await userService.createForeignRelationTables(user)
    logger.info(`User ${result.id} was created successfully`)
    logger.debug(
      `User ${result.id} was created successfully - DEBUG: ${JSON.stringify(result)}`
    )
  } catch (err) {
    logger.error(`There was an error saving the user: ${err.message}`)
    throw new Error(`Error processing user`)
  }
}

(async() => {
  try {
    let queue = new Queue(config.microservice_name)
    await Repository.initRepository()
    logger.info(`Centinela Report Queue processor worker started`)
    await queue.process(['bug.create', 'bug.update', 'user.create']
      , processQueue)
  } catch (err) {
    logger.error(`Failed to start worker: ${err}`)
    process.exit(1)
  }
})()
