export class PreferenceGeneral {    
    id: number;
    userId: number;
    userEmail: string;
    organizationId: number;
    isEnabled: boolean;
    lastSent: string
    constructor(id: number, userId: number, userEmail: string, organizationId: number, isEnabled: boolean, lastSent: string){
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.organizationId = organizationId;
        this.isEnabled = isEnabled
        this.lastSent = lastSent;
    }
}
