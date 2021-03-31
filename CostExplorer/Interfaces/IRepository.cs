using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CostExplorer.Interfaces
{
    public interface IRepository<T>
    {
        void Add(T entity);

        void Remove(T entity);

        void Update(T entity);

        Task<IEnumerable<T>> GetAll();

        void RemoveAll(IEnumerable<T> entities);

        Task<T> Get(int id);

        void Save();

        IEnumerable<T> GetByCondition(Expression<Func<T, bool>> expression);
        
        T GetFirst(Expression<Func<T, bool>> expression);
    }
}