const TopicEmitter = require('./chassis_tests/topic_emitter')
var key = "BUG.INVITE"
var msg = {
  id: 1
  , firstName: 'BUG.INVITE'
};
TopicEmitter.publish(key, msg)
