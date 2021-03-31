import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-traffic-bar',
  styleUrls: ['./traffic-bar.component.scss'],
  templateUrl: './traffic-bar.component.html',
})
export class TrafficBarComponent implements OnInit{
  
  @Input() barData: { prevDate: string; prevValuePocentage: number; nextDate: string; nextValuePocentage: number };
  @Input() successDelta: boolean;

  constructor (){  
  }
  ngOnInit(): void {    }


}
