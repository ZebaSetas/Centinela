var amqp = require('amqplib/callback_api');
require('dotenv').config()
var httpContext = require('express-http-context');

const listen = (keys, consumer) => {
  amqp.connect(process.env.HOST_RABBITMQ, function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'topic_logs';

      channel.assertExchange(exchange, 'topic', {
        durable: false
      });

      channel.assertQueue('', {
        exclusive: true
      }, function (error2, q) {
        if (error2) {
          throw error2;
        }
        keys.forEach(function (key) {
          channel.bindQueue(q.queue, exchange, key);
        })
        channel.consume(q.queue, function (object) {
          var container = JSON.parse(object.content)
          var transactionId = container['Transaction-ID']
          if (transactionId) httpContext.set('Transaction-ID'
            , transactionId)
          consumer(container.msg)
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
