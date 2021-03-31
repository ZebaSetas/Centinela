var amqp = require('amqplib/callback_api');
require('dotenv').config()
const config = require('config')

var httpContext = require('express-http-context');

const listen = (keys, consumer) => {
  amqp.connect(process.env.HOST_RABBITMQ, async function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'centinela_exchange';
      channel.assertExchange(exchange, 'topic', {
        durable: true
      });

      channel.assertQueue(config.microservice_name, {
        exclusive: false
      }, function (error2, q) {
        if (error2) {
          throw error2;
        }
        keys.forEach(function (key) {
          channel.bindQueue(q.queue, exchange, key);
        })
        channel.consume(q.queue, async function (object) {
          let container = JSON.parse(object.content)
          let transactionId = container['Transaction-ID']
          if (transactionId)
            httpContext.set('Transaction-ID', transactionId)
          try {
            await consumer(container.msg)
            channel.ack(object)
          } catch (err) {
            if (object.fields.deliveryTag < 4) {
              channel.nack(object, false, true)
            } else {
              channel.nack(object, false, false)
            }
          }
        }, {
          noAck: false
        });
      });
    });
  });

}

module.exports = {
  listen
}
