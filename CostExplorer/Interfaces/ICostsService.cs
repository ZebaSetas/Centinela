using System;
using System.Collections.Generic;
using CostExplorer.Domain;

namespace CostExplorer.Interfaces {

    public interface ICostsService
    {
        List<MonthCost> GetCosts(DateTime from, DateTime to, int organizationId);
    }
}
