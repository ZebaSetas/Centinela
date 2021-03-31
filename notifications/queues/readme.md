Ejemplo creación de un tópico:

```
const TopicEmitter = require('./chassis_tests/topic_emitter')
var key = "bug.create"
var msg = {
  id: 4
  , firstName: 'John'
};
TopicEmitter.publish(key, msg)

```

Ejemplo de consumo de un tópico

```

const TopicReceiver = require('./chassis_tests/topic_receiver')
class Consumer {
  constructor() {}
  consume(message) {
    console.log(JSON.stringify(message))
  }
}
var consumer = new Consumer();
var key = ["*.create","bug.update"]
TopicReceiver.listen(key, consumer)

```
