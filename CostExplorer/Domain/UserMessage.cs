using Newtonsoft.Json;

namespace CostExplorer.Domain
{
    public class UserMessage {
        public User Message { get; set; } 

        [JsonProperty("Transaction-ID")]
        public string TransactionID { get; set; } 
    }
}