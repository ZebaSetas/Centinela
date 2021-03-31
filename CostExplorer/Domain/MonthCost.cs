namespace CostExplorer.Domain
{
    public class MonthCost
    {
        public int id { get; set; }
        public Cost bugs { get; set; }
        public Cost users { get; set; }
        public PeriodCost period { get; set; }


        public MonthCost() { }

    }
}