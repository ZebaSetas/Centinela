'use strict'
var httpContext = require('express-http-context');
const config = require('config')
const path = require('path')
const {
  createLogger
  , format
  , transports
} = require('winston')
const os = require('os');
require('winston-syslog');
const fileUtils = require('./utils/file-utils.js')

const logFolder = process.env.LOG_LOCAL_FOLDER || `./logs/`
const exeptionsFileName = process.env.LOG_LOCAL_EXCEPTION_FILE_NAME ||
  'exceptions.log'
const logFileName = process.env.LOG_LOCAL_FILE_NAME || 'logs.log'
const logEnvironment = process.env.LOG_ENVIRONMENT || 'console'
const cloudHostname = process.env.LOG_CLOUD_LOGGING_HOST
const cloudPortNumber = process.env.LOG_CLOUD_LOGGING_PORT
const logLevel = process.env.LOG_LEVEL || 'info'

const applicationName = config.microservice_name || ''
const execptionsFilePath = path.join(logFolder, exeptionsFileName)
const regularLogFilePath = path.join(logFolder, logFileName)

module.exports = class Logger {
  constructor(globalFilename) {
    const colorizer = format.colorize();
    this.selectedTransports = []
    this.exceptionTransports = []
    var customLevels = {
      levels: {
        crit: 0
        , error: 1
        , warn: 2
        , info: 3
        , debug: 4
      }
    }
    const defaultLoggingFormat = format.combine(format.simple(), format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      })
      , format.printf(info =>
        colorizer.colorize(info.level
          , `[${info.timestamp}][${info.level}][${info.applicationName}][${info.filenamePath}]#${info.message}`
        )))

    var filenamePath = fileUtils.getFolderAndFilename(globalFilename)

    const consoleLogging = new transports.Console({
      format: defaultLoggingFormat
      , level: logLevel
    })

    //Default transport always to console
    this.selectedTransports.push(consoleLogging)
    this.exceptionTransports.push(consoleLogging)

    //Defining extra transports based on Environment variable LOG_ENVIROMENT
    if (logEnvironment.toLowerCase() === 'local' ||
      logEnvironment.toLowerCase() === 'both') { //Log to local
      const fileLogging = new transports.File({
        filename: regularLogFilePath
        , format: defaultLoggingFormat
      })
      const exceptionsfileLogging = new transports.File({
        filename: execptionsFilePath
        , format: defaultLoggingFormat
      })
      this.selectedTransports.push(fileLogging)
      this.exceptionTransports.push(exceptionsfileLogging)
    }

    if (logEnvironment.toLowerCase() === 'cloud' ||
      logEnvironment.toLowerCase() === 'both') {
      const cloudLogging = new transports.Syslog({
        host: cloudHostname
        , port: cloudPortNumber
        , protocol: 'tls4'
        , localhost: os.hostname()
        , app_name: applicationName
        , eol: '\n'
      })
      this.selectedTransports.push(cloudLogging)
      this.exceptionTransports.push(cloudLogging)
    }

    this.logger = createLogger({
      level: logLevel
      , levels: customLevels.levels
      , format: defaultLoggingFormat
      , defaultMeta: {
        applicationName: applicationName
        , filenamePath: filenamePath
      }
      , transports: this.selectedTransports
      , exceptionHandlers: this.exceptionTransports
    })

    var prepareMessage = (message, initTime, endTime, guid) => {
      var separator = ' >>> '
      var transactionId = httpContext.get('Transaction-ID');
      separator = transactionId ? "[Transaction-ID:" + transactionId +
        "]" + separator : separator
      var messageToLog = ''
      if (isNaN(initTime)) {
        messageToLog = buildMessageWithoutTime(initTime, messageToLog
          , separator, message)
      } else {
        if (isNaN(endTime)) {
          messageToLog = buildMessageWithInitTime(initTime, endTime
            , messageToLog, separator, message)
        } else {
          messageToLog = buildMessageWithBothTime(endTime, initTime
            , guid
            , messageToLog, separator, message)
        }
      }
      return messageToLog
    }

    this.info = (message, initTime, endTime, guid) =>
      this.logger.info(prepareMessage(message, initTime, endTime, guid))

    this.debug = (message, initTime, endTime, guid) =>
      this.logger.debug(prepareMessage(message, initTime, endTime, guid))

    this.warn = (message, initTime, endTime, guid) =>
      this.logger.warn(prepareMessage(message, initTime, endTime, guid))

    this.error = (message, initTime, endTime, guid) =>
      this.logger.error(prepareMessage(message, initTime, endTime, guid))

    this.fatal = (message, initTime, endTime, guid) =>
      this.logger.crit(prepareMessage(message, initTime, endTime, guid))
  }

}

function buildMessageWithBothTime(endTime, initTime, guid, messageToLog
  , separator, message) {
  var diference = endTime - initTime
  if (typeof guid !== 'undefined' && guid !== null) {
    var _guid = guid
    messageToLog =
      `[${diference}ms][Guid:${_guid}]${separator}${message}`
  } else
    messageToLog = `[${diference}ms]${separator}${message}`
  return messageToLog
}

function buildMessageWithInitTime(initTime, endTime, messageToLog
  , separator
  , message) {
  var _endTime = new Date().getTime()
  var diference = _endTime - initTime
  if (typeof endTime !== 'undefined' && endTime !== null) {
    var _guid = endTime
    messageToLog =
      `[${diference}ms][Guid:${_guid}]${separator}${message}`
  } else {
    messageToLog =
      `[${diference}ms]${separator}${message}`
  }
  return messageToLog
}

function buildMessageWithoutTime(initTime, messageToLog, separator, message) {
  if (typeof initTime !== 'undefined' && initTime !== null) {
    var _guid = initTime
    messageToLog = `[Guid:${_guid}]${separator}${message}`
  } else
    messageToLog = separator + message
  return messageToLog
}
