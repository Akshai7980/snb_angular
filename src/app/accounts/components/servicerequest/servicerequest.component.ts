import { Component, Input, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { logoprint } from 'src/app/utility/common-utility';
import { showFilteredRows } from 'src/app/utility/tableFilter';
import { CommonInjectServiceService } from '../../services/common-inject-service.service';
@Component({
  selector: 'app-servicerequest',
  templateUrl: './servicerequest.component.html',
  styleUrls: ['./servicerequest.component.scss']
})
export class ServicerequestComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData
  printSection: any;
  propertyValue :string="";
  enablePropertty:boolean =true;
  isShownDocPrint :boolean=true;
  shownPrint:boolean=false;
  //logo ="assets/images/snb-logo-print.png"; 
  logo :string="";
  constructor( private service: CommonInjectServiceService) {
    this.rootScopeData.lhsActiveComp = 'servicerequest';
     this.logo = logoprint();

}

  ngOnInit(): void {
    this.printSection = 'serviceRequestsPrintSection';
  }
  triggerSearchFilter(event:any){
    showFilteredRows(this.rootScopeData.filterTableId, event.target.value);
  }


  ngAfterViewInit() {
    
    setInterval(()=>{
      this.service.data$.subscribe(n => this.propertyValue = n)
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
