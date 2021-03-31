export class ReportUser {
    
    id: number;
    resolvedBugsCount: number;
    userName: string;
    userEmail: string;

    constructor(resolvedBugsCount: number, userName: string, userEmail: string) {
        this.resolvedBugsCount = resolvedBugsCount;
        this.userName = userName;
        this.userEmail = userEmail;
    }    
}