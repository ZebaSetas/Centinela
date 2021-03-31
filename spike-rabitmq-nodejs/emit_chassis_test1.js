const TopicEmitter = require('./chassis_tests/topic_emitter')
var key = "BUG.create"
var msg = {
  id: 1
  , firstName: 'BUG.CREATE'
};
TopicEmitter.publish(key, msg)

key = "BUG.INVITE"
msg = {
  id: 2
  , firstName: 'BUG.INVITE'
};
TopicEmitter.publish(key, msg)

key = "BUG.INVITE"
msg = {
  id: 3
  , firstName: 'BUG.INVITE'
};
TopicEmitter.publish(key, msg)

key = "BUG.CREATE"
msg = {
  id: 4
  , firstName: 'BUG.CREATE'
};
TopicEmitter.publish(key, msg)

key = "BUG.LALA"
msg = {
  id: 5
  , firstName: 'BUG.CREATE'
};
TopicEmitter.publish(key, msg)

key = "BUG.INVITE"
msg = {
  id: 6
  , firstName: 'BUG.INVITE'
};
TopicEmitter.publish(key, msg)
