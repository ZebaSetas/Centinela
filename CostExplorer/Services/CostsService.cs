using System.Linq;
using System;
using CostExplorer.Interfaces;
using System.Collections.Generic;
using CostExplorer.Domain;

namespace CostExplorer.Services
{
    public class CostsService : ICostsService
    {
        private readonly ILoggerManager logger;
        private IRepository<OrganizationCost> orgCostRepo;
        private IRepository<CostHistory> costHistRepo;
        
        public CostsService(ILoggerManager logger, IRepository<OrganizationCost> iOc, IRepository<CostHistory> iCh)
        {
            this.logger = logger;
            this.orgCostRepo = iOc;
            this.costHistRepo = iCh;
        }

        public List<MonthCost> GetCosts(DateTime from, DateTime to, int organizationId)
        {
            List<MonthCost> monthCostList = new List<MonthCost>();
            to = to.AddDays(1); //Need to add 1 day for correcly querying the database.
            //Acá se pide todo el año papa!!!!! PUEDE Y DEBE MEJORAR
            try {
                IEnumerable<OrganizationCost> ocList = this.orgCostRepo.GetByCondition(x => x.OrganizationId == organizationId && x.Year == from.Year);
                IEnumerable<CostHistory> chList = this.costHistRepo.GetByCondition(x => x.OrganizationId == organizationId);

                List<CostHistory> list = chList.ToList<CostHistory>();

                foreach (var item in ocList)
                {
                    CostHistory best = this.GetCostByClosetsMonthYear(list, item.Month, item.Year);

                    PeriodCost pc = new PeriodCost()
                    {
                        month = item.Month,
                        year = item.Year
                    };

                    Cost bugsCost = new Cost(){
                        cant = item.BugsAmount,
                        unitCost = best.BugCost,
                    };
                    Cost usersCost = new Cost(){
                        cant = item.UsersAmount,
                        unitCost = best.UserCost,
                    };

                    MonthCost m = new MonthCost(){
                        id = item.Id,
                        bugs = bugsCost,
                        users = usersCost,
                        period = pc
                    };
                    monthCostList.Add(m);
                }
            } catch (Exception e) {
                System.Console.WriteLine(e);
            }
            return monthCostList;
        }

        private CostHistory GetCostByClosetsMonthYear(List<CostHistory> list, int month, int year)
        {
            CostHistory best = new CostHistory(){
                BugCost = 0.01,
                UserCost = 5,
                Month = 1,
                Year = 2000
            };

            DateTime limitDay = new DateTime(year,month, 1);
            foreach (var item in list)
            {
                DateTime itemDay = new DateTime(item.Year, item.Month, 1);
                DateTime bestDay = new DateTime(best.Year, best.Month, 1);
                if(itemDay >= bestDay && itemDay <= limitDay)
                {
                    best.Year = item.Year;
                    best.BugCost = item.BugCost;
                    best.UserCost = item.UserCost;
                    best.Month = item.Month;   
                }
            }
            return best;
        }
    }
}