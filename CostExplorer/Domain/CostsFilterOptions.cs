using System;

namespace CostExplorer.Domain
{
    public class CostsFilterOptions
    {
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    

        public CostsFilterOptions()
        {

        }
        public bool HasOptions()
		{
            return (From != default(DateTime) && To != default(DateTime));


            
		}
    }

}