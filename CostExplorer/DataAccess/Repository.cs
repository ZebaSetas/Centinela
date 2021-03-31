using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using CostExplorer.Interfaces;

namespace CostExplorer.DataAccess
{
    public abstract class Repository<T> : IRepository<T> where T : class
    {
        protected DbContext Context {get; set;}

        public Repository(DbContext context)
        {
            this.Context = context;
        }

        public void Add(T entity) 
        {
            Context.Set<T>().Add(entity);
        }

        public virtual void Remove(T entity) 
        {
            Context.Set<T>().Remove(entity);
        }
        
        public virtual void Update(T entity) 
        {
            Context.Entry(entity).State = EntityState.Modified;
        }

        public abstract Task<IEnumerable<T>> GetAll();

        public abstract Task<T> Get(int id);

        public void Save() 
        {
            Context.SaveChanges();
        }

        public void RemoveAll(IEnumerable<T> entities)
        {
             Context.Set<T>().RemoveRange(entities);
        }

        public virtual IEnumerable<T> GetByCondition(Expression<Func<T, bool>> expression)
        {
            return Context.Set<T>().Where(expression);
        }
 
        public virtual T GetFirst(Expression<Func<T, bool>> expression)
        {
            return Context.Set<T>().First(expression);
        }
    }
}
