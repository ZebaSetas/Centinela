const config = require('config')
const Logger = require('centinela-logger')
const logger = new Logger(__filename, '')
const axios = require('axios')
require('dotenv').config()
const interceptors = require('../interceptors/axios-interceptors')

module.exports = class QueueStatiscservice {
  async getStatisticsQueue() {
    axios.interceptors.request.use(interceptors.addTransactionID)
    try {
      let response = await axios.get(
        "http://" + process.env.HOST_RABBITMQ + ":15672/api/nodes", {
          auth: {
            username: 'guest'
            , password: 'guest'
          }
        })

      return response.data[0].metrics_gc_queue_length
    } catch (err) {
      console.log(err)
      return 'Could not get queue statistics'
    }

  }

}
