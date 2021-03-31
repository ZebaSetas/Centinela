using System;
using System.Collections.Generic;
using CostExplorer.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CostExplorer.DataAccess
{
    public class OrganizationCostRepository : Repository<OrganizationCost> 
    {
        public OrganizationCostRepository(DbContext context) : base(context) { }

        public override async Task<OrganizationCost> Get(int id)
        {
            return await Context.Set<OrganizationCost>().FirstAsync<OrganizationCost>(x => x.Id.Equals(id));
        }

        public override async Task<IEnumerable<OrganizationCost>> GetAll()
        {
            return await Context.Set<OrganizationCost>().ToListAsync<OrganizationCost>();
        }
    }
}