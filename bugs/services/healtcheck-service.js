const PostgresPingService = require('./postgres-ping-service')
const QueueStatiscservice = require('./queue-statistics-service')
const config = require('config')
const QueueService = require('./queue-service')

module.exports = class MonitoringService {
  constructor() {
    this.postgresPingService = new PostgresPingService()
    this.queueStatisticsService = new QueueStatiscservice()
  }

  async ping() {
    var pingPostgre = await this.postgresPingService.isAlive()
    var queueStatitics = await this.queueStatisticsService.getStatisticsQueue()
    return this.buildMessage(pingPostgre, queueStatitics)
  }

  buildMessage = (postgresBdMsg, queueStatitics) => {
    var statusIsOk = queueStatitics ? queueStatitics !==
      'Could not get queue statistics' && postgresBdMsg === "pong" : false
    var status = "OK"
    if (!statusIsOk) {
      var status = "Alerted"
    }
    const message = {
      status: status
      , data: {
        postgresBd: postgresBdMsg
        , queueStatitics: queueStatitics
      }
    }
    return message
  }

}
