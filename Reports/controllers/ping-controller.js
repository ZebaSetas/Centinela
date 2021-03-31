const Logger = require('centinela-logger')
const logger = new Logger(__filename)
const HealtCheckService = require('../services/healtcheck-service')

module.exports = class PingController {
  ping = async(req, res) => {
    logger.debug(`Ping request arrived`)
    var service = new HealtCheckService()
    try {
      var initTime = new Date().getTime()
      var dataPong = await service.ping();
      logger.debug(JSON.stringify(dataPong), initTime)
      return res.status(200).json(dataPong)
    } catch (err) {
      logger.error(err, initTime)
      return res.status(400).json({
        error: err
      });
    }
  }
}
