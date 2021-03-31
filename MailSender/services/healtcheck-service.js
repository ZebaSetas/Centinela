const QueueStatiscservice = require('./queue-statistics-service')
const config = require('config')
const QueueService = require('./queue-service')

module.exports = class MonitoringService {
  constructor() {
    this.queueStatisticsService = new QueueStatiscservice()
  }

  async ping() {
    var queueStatitics = await this.queueStatisticsService.getStatisticsQueue()
    return this.buildMessage(queueStatitics)
  }

  buildMessage = (queueStatitics) => {
    var statusIsOk = queueStatitics ? true : false
    var status = "OK"
    if (!statusIsOk) {
      var status = "Alerted"
    }
    const message = {
      status: status
      , data: {
        queueStatitics: queueStatitics
      }
    }
    return message
  }

}
