var amqp = require('amqplib/callback_api');
require('dotenv').config()
var httpContext = require('express-http-context');

const publish = async(key, msg) => {
  amqp.connect(process.env.HOST_RABBITMQ, function (error0, connection) {
    if (error0) {
      throw error0
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var exchange = 'topic_logs';
      channel.assertExchange(exchange, 'topic', {
        durable: false
      });
      var transactionId = httpContext.get('Transaction-ID');
      let container = {
        msg
      }
      if (transactionId) container['Transaction-ID'] = transactionId
      channel.publish(exchange, key, Buffer.from(JSON.stringify(container)));
    });

    setTimeout(function () {
      connection.close()
    }, 500)
  })
}

module.exports = {
  publish
}
