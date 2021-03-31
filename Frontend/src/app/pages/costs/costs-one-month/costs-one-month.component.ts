import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CentinelaToast } from 'app/pages/utils/centinela-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MonthCost } from '../../../models/month-cost';
import { PeriodsService } from 'app/@core/mock/periods.service';
@Component({
  selector: 'ngx-costs-one-month',
  templateUrl: './costs-one-month.component.html',
  styleUrls: ['./costs-one-month.component.scss']
})



export class CostsOneMonthComponent implements OnInit {
  toast:CentinelaToast;
  title:string;
  cost: {name:string,count:number,unitCost:number,finalCost:number}
  costs:any[];
  month : MonthCost;
  finalCost;
  constructor(private toastrService: NbToastrService,private currentRoute:ActivatedRoute, private period: PeriodsService) { 
    this.toast = new CentinelaToast(toastrService);
    const idMonth:number = parseInt(this.currentRoute.snapshot.paramMap.get('id')); 
    var monthsCost:MonthCost[] = JSON.parse(sessionStorage.getItem("monthsCost"));
    this.month = monthsCost.find(m=>m.id===idMonth);
    this.title = "Factura "+period.getMonths()[this.month.period.month-1]+ " de "+this.month.period.year;
    var bugs = {"name":"Errores reportados","count":this.month.bugs.cant, "unitCost":this.month.bugs.unitCost,"finalCost":this.month.bugs.total};
    console.log(bugs);
    var users = {name:"Usuarios activos", count:this.month.users.cant, unitCost:this.month.users.unitCost,finalCost:this.month.users.total};
    this.costs = [bugs,users];
    this.finalCost = this.month.total;
  }

  ngOnInit(): void {
  }

  downloadPDF() {    
    var costs = this.costs;    
      var generateData = function (costs, finalCost) {
          var result = [];
          var bugs =
          {
            Item: costs[0].name,  
            Cantidad: costs[0].count.toString(),
            Unidad: "U$s"+costs[0].unitCost.toString(),
            Total: "U$s"+costs[0].finalCost.toString()
          };
          result.push(bugs);
          var users =
          {
            Item: costs[1].name,  
            Cantidad: costs[1].count.toString(),
            Unidad: "U$s"+ costs[1].unitCost.toString(),
            Total: "U$s"+costs[1].finalCost.toString()
          };
          result.push(users);
          var total =
          {
            Item: "",  
            Cantidad: "",
            Unidad: "Total",
            Total: "U$s"+finalCost.toString()
          };
          result.push(total);
          return result;
        };
        
      function createHeaders(keys) {
          var result = [];
          for (var i = 0; i < keys.length; i += 1) {
              result.push({
              'id' : keys[i],
                  'name': keys[i],
                  'prompt': keys[i],
                  'width': 250,
                  'align': 'center',
                  'padding': 0
              });
          }
          return result;
        }        
        
        var headers = createHeaders(["Item", "Cantidad", "Unidad","Total"]);        
        var doc = new jsPDF();
        doc.text("Centinela - Tu Bugtracker favorito!",20,20);                
        doc.text(this.title,20,40);                
        doc.table(20, 50, generateData(this.costs, this.finalCost), headers, { autoSize: true });    
        doc.save(this.period.getMonths()[this.month.period.month-1]+ "_"+this.month.period.year+".pdf");     
   }
}
