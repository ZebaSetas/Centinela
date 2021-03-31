using System.Threading.Tasks;
using CostExplorer.Domain;

namespace CostExplorer.Interfaces {
    public interface ITokenService
    {
        Task<Token> Verify(string token);
    }
}