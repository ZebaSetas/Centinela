const amqp = require('amqplib')
const config = require('config')
require('dotenv').config()

module.exports = class QueueService {
  constructor(queueName) {
    this.queueName = queueName

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

  async send(message) {
    await this.connect()
    this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true
    })
  }

  async process(callback) {
    await this.connect()
    await this.channel.consume(this.queueName, async(msg) => {
      const msgObject = JSON.parse(msg.content)
      try {
        await callback(msgObject)
        this.channel.ack(msg)
      } catch (err) {
        if (msg.fields.deliveryTag < 4) {
          channel.nack(msg, false, true)
        } else {
          channel.nack(msg, false, false)
        }
      }
    }, {
      noAck: false
    })
  }

  async connect() {
    if (!this.connection) {
      console.log(`Connecting to ${this.queueName}`)
      this.connection = await amqp.connect(this.connectionInfo)
      this.channel = await this.connection.createChannel()
      await this.channel.assertQueue(this.queueName, {
        durable: true
      })
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.close()
    }
  }

}
