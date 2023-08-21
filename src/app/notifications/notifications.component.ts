import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonInjectServiceService } from '../accounts/services/common-inject-service.service';
import { DeleteSuccessPopupComponent } from '../common-components/components/delete-success-popup/delete-success-popup.component';
import { RootScopeData } from '../rootscope-data';
import { RootScopeDeclare } from '../rootscope-declare';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  propertyValue :string="";
  enablePropertty:boolean =true;
  constructor(private route: Router,private notificationService: NotificationsService, public dialog: MatDialog,private service: CommonInjectServiceService) { }

  ngOnInit(): void {
    //this.rootScopeData.paymentActiveTabName = 'notifications';
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

  deleteTrashCall()
  {
    this.notificationService.emptyTrashAPiCall().subscribe(
      data =>{
        let resp: any = [];
        resp = data;
       if(resp.data[0].deleteDesc === "Success"){
        let succDialog = this.dialog.open(DeleteSuccessPopupComponent,{
          width:'400px',
          data: {
            data:"emptyTrash"
          }
        });
        const subNew = succDialog.componentInstance.onOkClick.subscribe(() => {
          // do something
          //this.getViewTrashDetails();
          this.route.navigate(['/notifications/trash/trash-mailboxs'])
         this.dialog.closeAll();
        
        });

       }
        
        }, error => {
          //this.errorFlag = true;
          this.rootScopeData.showSystemError = true;
      }
      
    )

  }

  // selectMenu_click(val:any){
  //   if(val == "Notifications")
  //   {
  //     this.route.navigate(['/notifications/notification/alerts'])
  //   }
  //   else if(val == "Mailbox"){
  //     this.route.navigate(['/notifications/mailbox'])
  //   }
  //   else if(val == "Trash"){
  //     this.route.navigate(['/notifications/trash'])
  //   }
    
  // }
}
