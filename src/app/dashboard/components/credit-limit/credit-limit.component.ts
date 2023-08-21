import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-credit-limit',
  templateUrl: './credit-limit.component.html',
  styleUrls: ['./credit-limit.component.scss']
})

export class CreditLimitComponent implements OnInit {
  creditLimitData: any=[];
  equivalentCurrency:string="";
  rootScopeData:RootScopeDeclare=RootScopeData;
  showChart = false;
  view: [number, number] = [380, 160];
  saleData = [
    { name: "Available Limit", value: 0},
    { name: "Utilized Limit", value: 0 }
  ];

  // options
  gradient: boolean = false;
  showLegend: boolean = true;
  showLabels: boolean = true;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ef9600', '#84bd00'],
  };
  @Input() langDirection:any;

/*   colorScheme = {
    colorScheme: ['#5AA454', '#A10A28']
  };  */

  constructor(private dashboardService:DashboardService) { }

  ngOnInit(): void {
    // this.getCreditUtilization();
    this.equivalentCurrency = this.rootScopeData.equivalentCurrency;
  }

  ngOnChanges(){
    if(this.langDirection)
    {
      this.getCreditUtilization();
    }
  }
  getCreditUtilization(){
    this.dashboardService.CreditLimit().subscribe(
      (response:any) =>{
        this.creditLimitData=response.DATA.ALL_RECORDS[0];
//alert(this.creditLimitData.USED_LIMIT);
        // this.saleData = [
        //   { name: "Available Limit", value: this.creditLimitData.AVAIL_LIMIT},
        //   { name: "Utilized Limit", value: this.creditLimitData.USED_LIMIT }
        // ];
        this.saleData[0].value = this.creditLimitData.AVAIL_LIMIT;
        this.saleData[1].value = this.creditLimitData.USED_LIMIT;
        this.showChart = true;

      }
    )
  }
}
