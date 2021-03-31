#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'topic_logs';
    //La matriz "argv" contiene todo lo que se da en la línea de comando. 
    //El primer elemento (argv [0]) será la ruta al nodo en sí, y el segundo elemento (argv [1]) será la ruta a su código de script.
    // Entonces, un segmento que comience en 2 descartará ambos y devolverá todo lo demás que se escribió en la línea de comando. 
    //Estos son los argumentos que se utilizarán para construir la cadena de consulta de la API.
    // Si ejecutamos => node node .\topic_message_publisher.js hola.mundo => el topice será hola.mundo
    var args = process.argv.slice(2);
    var key = (args.length > 0) ? args[0] : 'anonymous.info';
    var msg = args.slice(1).join(' ') || 'Hello World!';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
    channel.publish(exchange, key, Buffer.from(msg));
    console.log(" [x] Sent %s:'%s'", key, msg);
  });

  setTimeout(function () {
    connection.close();
    process.exit(0)
  }, 500);
});
