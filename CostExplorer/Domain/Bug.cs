namespace CostExplorer.Domain {
    public class Bug    {
        public string title { get; set; } 
        public string description { get; set; } 
        public int severity { get; set; } 
        public int environmentId { get; set; } 
        public int organizationId { get; set; } 
        public int systemId { get; set; } 
        public int stateId { get; set; } 
        public int id { get; set; } 
    }
}