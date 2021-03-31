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
      var exchange = 'centinela_exchange';
      channel.prefetch(1)
      channel.assertExchange(exchange, 'topic', {
        durable: true
      });
      var transactionId = httpContext.get('Transaction-ID');
      let container = {
        msg
      }
      if (transactionId) container['Transaction-ID'] = transactionId
      channel.publish(exchange, key, Buffer.from(JSON.stringify(container)));
    });

    process.on("SIGINT", function () {
      connection.close()
    })
  })
}

module.exports = {
  publish
}
