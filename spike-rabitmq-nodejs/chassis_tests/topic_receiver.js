var amqp = require('amqplib/callback_api');
require('dotenv').config()
var httpContext = require('express-http-context');

const listen = (keys, consumer, queue) => {
  amqp.connect(process.env.HOST_RABBITMQ, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'topic_logs'

      channel.assertExchange(exchange, 'topic', {
        durable: false
      })

      channel.assertQueue(queue, {
        exclusive: false
      }, function (error2, q) {
        if (error2) {
          throw error2;
        }
        //channel.bindQueue(q.queue, exchange, key)
        keys.forEach(function (key) {
          channel.bindQueue(q.queue, exchange, key);
        })
        channel.consume(q.queue, function (msg) {
          var msgObj = JSON.parse(msg.content)
          msgObj['topic'] = msg.fields.routingKey
          var transactionId = msgObj['Transaction-ID']
          if (transactionId) httpContext.set('Transaction-ID'
            , transactionId);
          consumer.consume(msgObj)
        }, {
          noAck: true
        });
      });
    });
  });

}

module.exports = {
  listen
}
