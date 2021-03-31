import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../../services/statistics.service';
import { CentinelaToast } from '../../utils/centinela-toast';
import { NbToastrService } from '@nebular/theme';
import { ReportUser } from 'app/models/report-user';

@Component({
  selector: 'ngx-top-users-bugs',
  templateUrl: './top-users-bugs.component.html',
  styleUrls: ['./top-users-bugs.component.scss']
})

export class TopUsersBugsComponent implements OnInit {
  toast: CentinelaToast;
  hasResult: boolean = false;
  users: Array<ReportUser>;

  constructor(private toastrService: NbToastrService,
              private statisticsService: StatisticService)  {
    this.toast = new CentinelaToast(toastrService);    
  }

  getTopUsers() {
    this.statisticsService.getTopUsers().subscribe(
      (statistics) => {
        if (statistics.length > 0) 
        {
          this.hasResult= true;
          this.users = statistics.map(stat => new ReportUser(stat.count, stat.user.name, stat.user.email));
        }
        else {
          this.hasResult = false;
        }
      },
      (error: any) => {
        this.toast.showToast(4, "Error", `Hubo un error en la consulta` );
        console.log("error")
      }
    );   
  }

  ngOnInit(): void 
  { 
    this.getTopUsers();
  }
}




