namespace CostExplorer.Domain
{
    public class OrganizationCost
    {
        public int Id { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int OrganizationId { get; set; }
        public long BugsAmount { get; set; }
        public long UsersAmount { get; set; }
    }
}