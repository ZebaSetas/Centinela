import { Component, AfterContentInit, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { FormControl } from '@angular/forms';
import { NbDateService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { StatisticService } from '../../../../services/statistics.service';
import { CentinelaToast } from '../../../utils/centinela-toast';
import { NbToastrService } from '@nebular/theme';
import { Statistics } from '../../../../models/statistics';
import { GlobalsService } from '../../../../services/globals.service';

@Component({
  selector: 'ngx-count-bugs',
  templateUrl: './count-bugs.component.html',
  styleUrls: ['./count-bugs.component.scss']
})

export class CountBugsComponent implements AfterContentInit , OnDestroy, OnInit {
  total_options: any = {};
  severity_options: any = {};
  themeSubscription: any;
  formControl = new FormControl(new Date());
  ngModelDate = new Date();
  min: Date;
  max: Date;
  calendarDate: any;
  toast:CentinelaToast;
  dataCountErrors:any={}
  dataSeverityErrors:any={}
  myDateStart:string;
  myDateEnd:string;
  countErrors:number;
  textResult:string;
  hasResult: boolean = false;

  constructor(private theme: NbThemeService,
              protected dateService: NbDateService<Date>,              
              private toastrService: NbToastrService,
              private statisticsService: StatisticService,
              private globalService: GlobalsService)  {
    this.min = this.dateService.addDay(this.dateService.today(), -15);
    this.max = this.dateService.addDay(this.dateService.today(), 25);
    this.toast = new CentinelaToast(toastrService);    
  }

  showStatistics(myCalendarDates) {
      try{
        const datePipe: DatePipe = new DatePipe('en-US');
        let myDateStart = datePipe.transform(myCalendarDates.model.start, 'dd/MM/yyyy');
        let myDateEnd = datePipe.transform(myCalendarDates.model.end, 'dd/MM/yyyy');    
        this.getStatistics(myDateStart,myDateEnd);
      }
      catch(error){
        this.toast.showToast(4, "Error", `Debe elegir fecha incial y fecha final` );
      }    
  }

  getStatistics(dateStart:string,dateEnd:string){
    this.statisticsService.getStatistics(dateStart,dateEnd).subscribe(
      (statistics) => {           
        this.myDateStart = dateStart;
        this.myDateEnd = dateEnd;                
        var countState = this.buildStateValues(statistics);
        var countSeverity = this.buildSeverityValues(statistics);
        this.buildTextResult();
        this.buildDashboard(countState, countSeverity);
        this.globalService.setArraysStatistics(countSeverity, countState, this.countErrors, this.textResult);
        if (this.globalService.arrayBySeverityStatistics.length <= 0) {
          this.hasResult = false;
          this.toast.showToast(2, "Resultado", `No existen bugs en ese rango` );
        }
        else
          this.toast.showToast(1, "Ok", `Consulta realizada con éxito!` );
      },
      (error: any) => {
        this.toast.showToast(4, "Error", `Hubo un error en la consulta` );
        console.log("error")
      }
    );   
  }

  buildTextResult(){
    this.hasResult = true;
    if (this.myDateStart===this.myDateEnd){
      this.textResult = "Resultado para el día "+this.myDateStart;
    }
    else{
      this.textResult = "Resultado entre fechas "+this.myDateStart+" y "+this.myDateEnd;
    }
  }

  buildStateValues(statistic: Statistics):any{
    var values = statistic.byState;
    var result = new Array();
    var count = 0;
    values.forEach(element=>{
      var value = Number.parseInt(element.count);
        count += value;
      if(element.stateId==1){
        result[0] = { value: value , name: 'No resueltos' };
      }
      if(element.stateId==2){
        result[1] = { value: value , name: 'Resueltos' };  
      }
    })
    this.countErrors = count;
    return result;
  }

  buildSeverityValues(statistic: Statistics): any{
    var values = statistic.bySeverity;
    console.log(values)
    var result = new Array();
    values.forEach(element=>{                
      if(element.severity===1){
        result[2] = { value: Number.parseInt(element.count) , name: 'Severidad 1' };
      }
      if(element.severity===2){
        result[1] = { value: Number.parseInt(element.count) , name: 'Severidad 2' };  
      }
      if(element.severity===3){
        result[0] = { value: Number.parseInt(element.count) , name: 'Severidad 3' };
      }
      if(element.severity===4){
        result[3] = { value: Number.parseInt(element.count) , name: 'Severidad 4' };  
      }
    })
    return result;
  }

  buildDashboard(countBugValues: any, countSeverity: any) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;
     
      this.total_options = {
        backgroundColor: echarts.bg,
        color: [colors.dangerLight, colors.successLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Resueltos', 'No resueltos'] ,
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Errores',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: countBugValues,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
      this.severity_options = {
        backgroundColor: echarts.bg,
        color: [colors.infoLight, colors.warningLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Severidad 1', 'Severidad 2','Severidad 3','Severidad 4'] ,
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Severidad',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: countSeverity,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }
  
  ngAfterContentInit() {
    const datePipe: DatePipe = new DatePipe('en-US');
    var arrayBySeverity = this.globalService.arrayBySeverityStatistics;
    console.log(arrayBySeverity);
    var arrayByState = this.globalService.arrayByStateStatistics;
    if(arrayBySeverity.length > 0) {
      this.buildDashboard(arrayByState, arrayBySeverity);
      this.textResult = this.globalService.lastTextStatistics;
      this.countErrors = this.globalService.lastCountErrorsStatitics;
      this.hasResult = true;
    }
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.themeSubscription !== undefined)
      this.themeSubscription.unsubscribe();
  }
}
