namespace CostExplorer.Domain {
    public class Token    {
        public TokenContent data { get; set; } 
        public int exp { get; set; } 
        public int iat { get; set; } 
    }
}