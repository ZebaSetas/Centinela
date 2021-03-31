using CostExplorer.Interfaces;
using CostExplorer.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using CostExplorer.Domain;
using CostExplorer.DataAccess;
using CostExplorer.Utils;

namespace CostExplorer.WebApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSingleton<ILoggerManager, LoggerManager>();
            services.AddSingleton<ITokenService, TokenService>();
            services.AddScoped<IPingService, PingService>();
            services.AddScoped<ICostsService, CostsService>();
            services.AddHostedService<MessageProcessor>();
            services.AddScoped<IRepository<CostHistory>, CostHistoryRepository>();
            services.AddScoped<IRepository<OrganizationCost>, OrganizationCostRepository>();
            services.AddDbContext<DbContext, CostExplorerContext>(
                o => o.UseNpgsql(ConnectionStringGenerator.GetConnection())
            );
            services.AddCors(
                options => { options.AddPolicy(
                    "CorsPolicy", 
                    builder => builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                      //  .AllowCredentials()
                );
            });

            services.AddSwaggerGen();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<DbContext>();
                context.Database.Migrate();
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cost Explorer API v1");
            });

            app.UseRouting();

            app.UseAuthorization();
            app.UseCors("CorsPolicy");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
