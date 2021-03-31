using System;
using System.Collections.Generic;
using CostExplorer.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CostExplorer.DataAccess
{
    public class CostHistoryRepository : Repository<CostHistory> 
    {
        public CostHistoryRepository(DbContext context) : base(context) { }

        public override async Task<CostHistory> Get(int id)
        {
            return await Context.Set<CostHistory>().FirstAsync<CostHistory>(x => x.Id.Equals(id));
        }

        public override async Task<IEnumerable<CostHistory>> GetAll()
        {
            return await Context.Set<CostHistory>().ToListAsync<CostHistory>();
        }
    }
}