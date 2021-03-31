const TopicReceiver = require('./chassis_tests/topic_receiver')

class Consumer1 {
  constructor() {}
  consume(message) {
    console.log("consumer1>>>" + JSON.stringify(message))
  }
}
var consumer1 = new Consumer1();
var key = ["BUG.CREATE", "BUG.INVITE"]
TopicReceiver.listen(key, consumer1, "queue1")
class Consumer2 {
  constructor() {}
  consume(message) {
    console.log("consumer2>>>" + JSON.stringify(message))
  }
}

var consumer2 = new Consumer2();
var key = ["BUG.INVITE"]
TopicReceiver.listen(key, consumer2, "queue2")
