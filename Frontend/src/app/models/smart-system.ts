export class SmartSystem {    
    id: number;   
    systemName: string;
    organizationId: number;
    constructor(id: number, systemName: string, organizationId: number) {     
        this.id = id;
        this.systemName = systemName;
        this.organizationId = organizationId;                   
    }
}