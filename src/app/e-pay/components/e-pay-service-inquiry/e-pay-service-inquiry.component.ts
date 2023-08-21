import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonInjectServiceService } from 'src/app/accounts/services/common-inject-service.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { EpayServiceService } from '../../services/epay-service.service';

@Component({
  selector: 'app-e-pay-service-inquiry',
  templateUrl: './e-pay-service-inquiry.component.html',
  styleUrls: ['./e-pay-service-inquiry.component.scss']
})
export class EPayServiceInquiryComponent implements OnInit {
  propertyValue :string="";
  rootScopeData:RootScopeDeclare=RootScopeData;
  printSection: string="";
  logo :string="";
  enablePropertty:boolean =true;
  contextMenuList:any=[];
  @Input() proopertyenable :any;
  @Output() onRefreshClick = new EventEmitter();
  constructor(private service: CommonInjectServiceService, private ePayService:EpayServiceService) {
    this.logo = logoprint();
   }

  ngOnInit(): void {
    this.printSection = 'epayServicePrintSection';
    this.getCifLookup();
  }
  getCifLookup() {
    //this.isLoadingComplete = false;
    this.ePayService.getCifLookup().subscribe((res: any) => {
      // this.isLoadingComplete = true;
      this.contextMenuList = res?.dataValue.map((val: any) => {
        return {
          displayName: val.cifName,
          CIF_NO: val.cifNo,
          value: val.cifNo
        }
      })
    }, () => {
      // this.isLoadingComplete = true;
    })
  }
  triggerDropdownFilter(event:any):void{
    showFilteredRows(this.rootScopeData.filterTableId, event); 
  }
  
  ngAfterViewInit() {
    
    setInterval(()=>{
      this.service.data$.subscribe((n: string) => this.propertyValue = n)
      if(this.propertyValue === "false")
      {
        this.enablePropertty = false;
      }
      else{
        this.enablePropertty = true;
      }
    },100)
    
  }
}
