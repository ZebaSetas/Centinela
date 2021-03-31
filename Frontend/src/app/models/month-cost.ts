export class PeriodCost {    
    month: number;
    year: number;
    constructor(month: number, year: number){        
        this.month = month;
        this.year = year;
    }
}

export class Cost {    
    cant: number;
    unitCost: number;
    total:number;    
    constructor(cant:number, unitCost: number, total:number){        
        this.cant = cant;
        this.unitCost = unitCost;
        this.total = total;
    }
}

export class MonthCost{
    id: number;
    bugs: Cost;
    users: Cost;
    period: PeriodCost;
    total: number;
    constructor(id: number, bugs: Cost, users: Cost, period: PeriodCost, total:number){        
        this.id = id;
        this.bugs = bugs;
        this.users = users;
        this.period = period;
        this.total = total;
    }

}
