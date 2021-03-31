using System;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using CostExplorer.Domain;
using CostExplorer.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CostExplorer.Services
{
    public class MessageProcessor : IHostedService
    {   
        ILoggerManager log;
        private readonly IServiceScopeFactory scopeFactory;
        private Consumer topicConsumer;

        public MessageProcessor(ILoggerManager logger, IServiceScopeFactory scopeFactory) {
            this.log = logger;
            this.scopeFactory = scopeFactory;
        }

        private void TopicConsumerOnMessageReceived(object sender, Tuple<string,string> msg)
        {
            string bugCreateKey = "bug.create";
            string userCreateKey = "user.create";
            string routingKey = msg.Item1;
            string message = msg.Item2;
            if (routingKey.Equals(bugCreateKey)) 
            {
                ProcessIncommingBug(message);
            }
            else if (routingKey.Equals(userCreateKey)) 
            {
                ProcessIncommingUser(message);
            }
        }

        private void ProcessIncommingBug(string msg)
        {
            using (var scope = scopeFactory.CreateScope())
            {
                log.Debug("New Bug arrived " + msg);
                BugMessage bm = JsonConvert.DeserializeObject<BugMessage>(msg);
                var repositoryScope = scope.ServiceProvider.GetRequiredService<IRepository<OrganizationCost>>();              
                var now = DateTime.Now;
                try 
                {
                    var ocost = repositoryScope.GetFirst(x => x.Month == now.Month && x.Year == now.Year 
                        && x.OrganizationId == bm.message.organizationId);
                    //ESTA - HAY Q ACTUALIZAR
                    ocost.BugsAmount = ocost.BugsAmount + 1;
                    repositoryScope.Update(ocost);
                }
                catch (InvalidOperationException) 
                {
                    //NO ESTA - HAY QUE AGREGAR LA TUPLA
                    OrganizationCost oc = new OrganizationCost(){
                    BugsAmount = 1,
                    Month = now.Month,
                    Year = now.Year,
                    OrganizationId = bm.message.organizationId,
                    UsersAmount = 0
                    };
                    repositoryScope.Add(oc);
                }
                repositoryScope.Save();
            }
        }

        private void ProcessIncommingUser(string msg)
        {
            using (var scope = scopeFactory.CreateScope())
            {
                log.Debug("New User arrived " + msg);
                UserMessage userMsg = JsonConvert.DeserializeObject<UserMessage>(msg);
                var repositoryScope = scope.ServiceProvider.GetRequiredService<IRepository<OrganizationCost>>();
                var now = DateTime.Now;
                try 
                {
                     var orgCost = repositoryScope.GetFirst(x => x.Month == now.Month 
                            && x.Year == now.Year 
                            && x.OrganizationId == userMsg.Message.organizationId);

                    orgCost.UsersAmount = orgCost.UsersAmount + 1;
                    repositoryScope.Update(orgCost);
                }
                catch (InvalidOperationException) 
                {
                    OrganizationCost organizationCost = new OrganizationCost(){
                    BugsAmount = 0,
                    Month = now.Month,
                    Year = now.Year,
                    OrganizationId = userMsg.Message.organizationId,
                    UsersAmount = 1
                    };
                    repositoryScope.Add(organizationCost);
                }
                repositoryScope.Save();
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            this.topicConsumer = new Consumer();
            this.topicConsumer.MessageReceived += TopicConsumerOnMessageReceived;
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            this.topicConsumer.Dispose();
            return Task.CompletedTask;
        }
    }
}