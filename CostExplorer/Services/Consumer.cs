using System;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace CostExplorer.Services
{
    public class Consumer : IDisposable
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly EventingBasicConsumer _consumer;
        public event EventHandler<Tuple<string,string>> MessageReceived;

        public Consumer()
        {
            var factory = new ConnectionFactory
            {
                HostName = Environment.GetEnvironmentVariable("HOST_RABBITMQ"),
                Port = Convert.ToInt16(Environment.GetEnvironmentVariable("RABBIT_PORT")),
                UserName = Environment.GetEnvironmentVariable("RABBIT_USERNAME"),
                Password = Environment.GetEnvironmentVariable("RABBIT_PASSWORD"),
                VirtualHost = "/"
            };
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            string queueName = Environment.GetEnvironmentVariable("MICROSERVICE_NAME");
            string exchangeName = Environment.GetEnvironmentVariable("EXCHANGE_NAME");

            _channel.ExchangeDeclare(exchangeName, "topic", true);
            _channel.QueueDeclare(queueName, true, false, false, null);

            string bugCreateKey = "bug.create";
            string userCreateKey = "user.create";
            string[] keys = { bugCreateKey, userCreateKey };

            foreach(var rKey in keys)
            {
                _channel.QueueBind(queueName, exchangeName, rKey);
            }

            const bool nonTransactional = true;
            _consumer = new EventingBasicConsumer(_channel);
            _consumer.Received += ConsumerReceived;
            _channel.BasicConsume(queueName, nonTransactional, _consumer);
        }

        private void ConsumerReceived(object sender, BasicDeliverEventArgs ea)
        {
            var routingKey = ea.RoutingKey;
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Tuple<string,string> msg = new Tuple<string, string>(routingKey,message);
            OnMessageReceived(msg);
        }

        private void OnMessageReceived(Tuple<string,string> msg)
        {
            if (MessageReceived != null)
            {
                MessageReceived(this, msg);
            }
        }

        public void Dispose()
        {
            if (_connection != null)
                _connection.Close();

            if (_channel != null)
                _channel.Close();
        }
    }
}