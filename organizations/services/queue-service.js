// version 1.7
const amqp = require('amqplib')
require('dotenv').config()
var httpContext = require('express-http-context');
const Logger = require('centinela-logger')
const logger = new Logger(__filename)

module.exports = class QueueService {
  constructor(queueName) {
    this.queueName = queueName
    this.exchange = 'centinela_exchange';
    this.connectionInfo = {
      protocol: 'amqp'
      , hostname: process.env.HOST_RABBITMQ
      , port: 5672
      , username: 'guest'
      , password: 'guest'
      , locale: 'en_US'
      , frameMax: 0
      , heartbeat: 10
      , vhost: '/'
    , }
  }

  async send(key, message) {
    await this.connect()
    var transactionId = httpContext.get('Transaction-ID');
    let container = {
      message
    }
    if (transactionId) container['Transaction-ID'] = transactionId
    let result = this.channel.publish(this.exchange, key, Buffer.from(JSON.stringify(
      container)))
    if (!result)
      throw new Error('Cannot send this message')
  }

  async process(keys, callback) {
    await this.connect()
    await this.channel.assertQueue(this.queueName, {
      exclusive: false
    })
    for (let index = 0; index < keys.length; index++) {
      this.channel.bindQueue(this.queueName, this.exchange, keys[index]);
    }
    await this.channel.consume(this.queueName, async(msg) => {
      const container = JSON.parse(msg.content)
      let transactionId = container['Transaction-ID']
      var msgObject = container.message
      if (transactionId) {
        if (!httpContext.ns.active) {
          let context = httpContext.ns.createContext();
          httpContext.ns.context = context;
          httpContext.ns.active = context;
        }
        httpContext.set('Transaction-ID', transactionId)
      }
      msgObject['topic'] = msg.fields.routingKey
      try {
        await callback(msgObject)
        this.channel.ack(msg)
      } catch (err) {
        if (msg.fields.deliveryTag < 4) {
          this.channel.nack(msg, false, true)
        } else {
          this.channel.nack(msg, false, false)
        }
      }
    }, {
      noAck: false
    })
  }

  async connect() {
    if (!this.connection) {
      logger.info(
        `Connecting to queue server: ${process.env.HOST_RABBITMQ}`)
      try {
        this.connection = await amqp.connect(this.connectionInfo)
        logger.info(`Connected to the queue server`);
        this.channel = await this.connection.createChannel()
        this.channel.prefetch(1)
        await this.channel.assertExchange(this.exchange, 'topic', {
          durable: true
        })
      } catch (err) {
        await sleep(5000)
        await this.connect()
      }
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.close()
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
