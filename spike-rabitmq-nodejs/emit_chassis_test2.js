const TopicEmitter = require('./chassis_tests/topic_emitter')
var key = "BUG.CREATE"
var msg = {
  id: 1
  , firstName: 'BUG.CREATE'
};
TopicEmitter.publish(key, msg)
