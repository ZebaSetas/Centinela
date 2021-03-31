using System;

namespace CostExplorer.Domain
{
    public class Cost
    {
        public long cant {get; set;}
        public double unitCost {get; set;}
        public double total {
            get { return Math.Round(this.cant * this.unitCost,2); }
        }
    }
}