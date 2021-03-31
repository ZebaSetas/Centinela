# Queue service Usage
## Larrosa-Settimo-Zawrzykraj


## This service allows to use rabbitmq to publish an receive messages on defined topics


### Instance initialization

`let emailQueue = new QueueService(<<name_of_queue>>`)`

`name_of_queue` param defines que queue name that will be used by the consumer. 

It's not used by the producer ( publish method)


### Initialize a connection
``` await emailQueue.connect()```

### Publish a message
``` await queue.send(<<name_of_topic>>, <<mesage_object>>)```

`<<name_of_topic>>` param defines the topic name that the producer will use to pubish the message
`<<message_object>>` is the message that will be actually pubished in the exchange


### Consume a message
``await emailQueue.process([<<list_of_topics_to_subscribe>>], <<callbackFunction>>)``

``` 
async function callbackFunction(msg) {
  try{
    do things with the message....
    ...
    ...
  } catch (err) {
    throw new Error('Process failed')
  }
}
```