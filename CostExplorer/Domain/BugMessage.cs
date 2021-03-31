using Newtonsoft.Json;

namespace CostExplorer.Domain
{
    public class BugMessage {
        public Bug message { get; set; } 

        [JsonProperty("Transaction-ID")]
        public string TransactionID { get; set; } 
    }
}