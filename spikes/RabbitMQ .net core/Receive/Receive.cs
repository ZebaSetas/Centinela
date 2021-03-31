using RabbitMQ.Client;
using RabbitMQ.Client.Exceptions;
using RabbitMQ.Client.Events;
using System;
using System.Text;

namespace Receive
{
    class Receive
    {
        static void Main(string[] args)
        {
            try {
                var factory = new ConnectionFactory()
                { 
                    //HostName = "rabbitmq://192.168.99.102/",
                    HostName = "192.168.99.102",
                    Port = 5672, 
                    UserName = "admin", 
                    Password = "admin123",
                    //VirtualHost = "/"
                };
                //factory.Uri = new Uri("amqp://admin:admin123@192.168.99.102:5762/vhost");
                using(var connection = factory.CreateConnection())
                using(var channel = connection.CreateModel())
                {
                    channel.QueueDeclare(queue: "hello",
                                        durable: false,
                                        exclusive: false,
                                        autoDelete: false,
                                        arguments: null);

                    var consumer = new EventingBasicConsumer(channel);
                    consumer.Received += (model, ea) =>
                    {
                        var body = ea.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);
                        Console.WriteLine(" [x] Received {0}", message);
                    };
                    channel.BasicConsume(queue: "hello",
                                        autoAck: true,
                                        consumer: consumer);

                    Console.WriteLine(" Press [enter] to exit.");
                    Console.ReadLine();
                }
            }
            catch(BrokerUnreachableException ex) {
                Console.WriteLine("**************************************");
                Console.WriteLine("****Message****");
                Console.WriteLine(ex.Message);
                Console.WriteLine("****StackTrace****");
                Console.WriteLine(ex.StackTrace);
                Console.WriteLine("****Data****");
                Console.WriteLine(ex.Data);
                Console.WriteLine("****InnerException****");
                Console.WriteLine(ex.InnerException);
                Console.WriteLine(">>>>>>>>>>>>TODA<<<<<<<<<<<<<<");
                Console.WriteLine(ex);
                Console.WriteLine("**************************************");
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
            }

        }    
    }
}
