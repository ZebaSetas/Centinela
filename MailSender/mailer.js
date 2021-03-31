const RabbitQueue = require('./services/queue-service')
const config = require('config');

(async() => {

  var queue = new RabbitQueue(config.microservice_name)
  await queue.connect();

  for (let index = 0; index < 10; index++) {

    var email = {
      address: 'mlsettimo@gmail.com'
      , subject: `Hola ${index}`
      , bodyText: `Body ${index}`
      , bodyHTML: `<html>Body ${index}</html>`
    }
    await queue.send('notification.email', email)
  }
  // await queue.close()
  console.log(`publicado`);
  //process.exit(0)
})()
