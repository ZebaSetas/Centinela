require('dotenv').config()
const config = require('config')
const Repository = require('./repositories/repository')
const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const BugService = require('./services/bug-service')
const Queue = require('./services/queue-service')
const bugService = new BugService()

const processBug = async(bug) => {
  try {
    delete bug.topic
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

(async() => {
  try {
    let bugQueue = new Queue(config.microservice_name)
    await Repository.initRepository()
    logger.info(`Centinela Bug processor worker started`)
    await bugQueue.process(['bug.new'], processBug)
  } catch (err) {
    logger.error(`Failed to start worker: ${err}`)
    process.exit(1)
  }
})()
