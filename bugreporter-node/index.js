const configs = require('config')
const axios = require('axios')

const SEVERITY = {
  HIGH: 1
  , MEDIUM_HIGH: 2
  , MEDIUM_LOW: 3
  , LOW: 4
}

const keyConnection = configs.get('centinela-bug-reporter.keyConnection')
const server_url = configs.get('centinela-bug-reporter.server_url')
const server_timeout = configs.get('centinela-bug-reporter.server_timeout')

async function reportBug(title, description, severity) {
  if (!title)
    throw new Error('Reported Bug must have a title')
  if (isNaN(severity) || severity > 4 || severity < 1)
    throw new Error('Reported bug must have a severity number between 1 and 4')

  const bug = {
    title
    , description
    , severity
  }
  const requestConfig = {
    headers: {
      keyConnection
    }
    , timeout: server_timeout
  }

  try {
    const response = await axios.post(server_url, bug, requestConfig)
    return response.data.jobId
  } catch (err) {
    throw new Error(`Cannot send bug to Centinela: ${err.message}`)
  }
}

module.exports = {
  reportBug
  , SEVERITY
}
