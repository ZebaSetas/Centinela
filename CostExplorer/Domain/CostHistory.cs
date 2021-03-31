using System;

namespace CostExplorer.Domain
{
    public class CostHistory 
    {
        public int Id { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int OrganizationId { get; set; }
        public double BugCost { get; set; }
        public double UserCost { get; set; }
    }
}