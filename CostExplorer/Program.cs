using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace CostExplorer.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
            //CreateHostBuilder(args).Build().Start();
            //CreateHostBuilder(args).RunConsoleAsync();

            // Thread thread = new Thread(() => RabbitQueueReceiver.Receiver());
            // thread.Start();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
