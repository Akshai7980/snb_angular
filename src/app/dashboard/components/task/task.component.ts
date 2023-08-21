import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  taskSource:any;
  paymentsCount :string ='';
  serviceRequestCount :string='';
  beneficiariesCount :string='';
  filePaymentsCount:string='';
  norecordflag:boolean = false;
  noRecordFoundInfoObj: any;
  isLoadingCompelete = true;
  @Input() langDirection:any;
  constructor(public taskService:DashboardService) { }

  ngOnInit(): void {
  //  this.getTaskInfo();
   this.noRecordFoundInfoObj = {
    "msg":"LBL_NO_TASKS_FND", 
    "btnLabel":"Refresh Now", 
    "btnLink": "/dashboard",
    "showBtn": "false",
    "showMsg": "true",
    "showIcon": "true"
  };
  }

  ngOnChanges(){
    if(this.langDirection)
    {
      this.getTaskInfo();
    }
  }

  getTaskInfo(){
  this.isLoadingCompelete = false;
   this.taskService.getTaskData().subscribe(
     (res: any)=>{
      this.isLoadingCompelete = true;
      if(res.status === 500){
        this.norecordflag = true;
      }else{
        this.taskSource = res.dataValue;
        this.paymentsCount = this.taskSource.payCount;
        this.serviceRequestCount = this.taskSource.srCount;
        this.beneficiariesCount = this.taskSource.beneCount;
        this.filePaymentsCount = this.taskSource.fupCount;
        this.norecordflag = false;
        if(this.taskSource == null || this.taskSource == '' || this.taskSource == undefined || (this.paymentsCount =='0' && this.beneficiariesCount =='0' && this.filePaymentsCount =='0' && this.serviceRequestCount =='0')){
         this.norecordflag = true;
       }
      }
       

     },error=>{
		  this.isLoadingCompelete = true;
      this.norecordflag = true;
     }
   )
  }

}
