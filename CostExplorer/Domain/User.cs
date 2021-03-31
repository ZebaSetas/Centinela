
namespace CostExplorer.Domain {
    public class User    
    {
        public int id { get; set; } 
        public int organizationId { get; set; } 
        public string name { get; set; } 
        public string email { get; set; } 
        public int role { get; set; } 
    }
}