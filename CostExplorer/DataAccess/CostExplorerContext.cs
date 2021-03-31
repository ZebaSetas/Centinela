using CostExplorer.Domain;
using CostExplorer.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CostExplorer.DataAccess
{
    public class CostExplorerContext : DbContext
    {
        public IConfiguration Configuration { get; }
        public DbSet<CostHistory> CostsHistory { get; set; }
        public DbSet<OrganizationCost> OrganizationsCosts { get; set; }

        public CostExplorerContext(DbContextOptions options, IConfiguration configuration) : base(options) 
        { 
            Configuration = configuration;
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql(ConnectionStringGenerator.GetConnection());
    }
}
