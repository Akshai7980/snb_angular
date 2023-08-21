import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-manage-alerts',
  templateUrl: './manage-alerts.component.html',
  styleUrls: ['./manage-alerts.component.scss']
})
export class ManageAlertsComponent implements OnInit {


  displayedColumns: string[] = ['Category', 'Events', 'Inbox', 'Email', 'Sms'];
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSourceLength: any
  dataSourceToPass: any
  manageDate: any
  norecordflag: boolean = false;
  noRecordFoundInfoObj: any;
  isLoadingCompelete = true;
  totalRecords: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  sourceData: any;
  storedData: any = [];
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  email: string = "Y";
  mobile: string = "Y";
  pushNotifSelectAll: boolean = true;
  emailSelectAll: boolean = false;
  smsSelectAll: boolean = false;
  constructor(private settingsService: SettingsService, private router: Router) {
    this.rootScopeData.settingsActiveTabName = 'manageAlerts'
  }

  ngOnInit(): void {
    this.getManageAleretsData();
    this.noRecordFoundInfoObj = {
      "msg": "LNBL_NO_MANAGE_ALERTS",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
  }

  onClickCancel() {
    this.getManageAleretsData();
    this.router.navigate(['/settings/preferences'])
  }
  pushNotifSelectAllCall(e: any) {
    (e.checked) ? this.pushNotifSelectAll = true : this.pushNotifSelectAll = false
    // console.log(this.dataSourceToPass, "TEST:::LL:::")
    for (let i = 0; i < this.dataSourceToPass.filteredData.length; i++) {
      if (e.checked) {
        this.dataSourceToPass.filteredData[i].channelInbox = "Y";
      } else {
        this.dataSourceToPass.filteredData[i].channelInbox = "N";
      }
    }
  }

  emailSelectAllCall(e: any) {
    (e.checked) ? this.emailSelectAll = true : this.emailSelectAll = false

    for (let i = 0; i < this.dataSourceToPass.filteredData.length; i++) {
      if (e.checked) {
        this.dataSourceToPass.filteredData[i].channelEmail = "Y";
      } else {
        this.dataSourceToPass.filteredData[i].channelEmail = "N";
      }
    }
  }
  smsSelectAllCall(e: any) {
    (e.checked) ? this.smsSelectAll = true : this.smsSelectAll = false

    for (let i = 0; i < this.dataSourceToPass.filteredData.length; i++) {
      if (e.checked) {
        this.dataSourceToPass.filteredData[i].channelSms = "Y";
      } else {
        this.dataSourceToPass.filteredData[i].channelSms = "N";
      }
    }
  }

  selectEmailToggle(e: any, val: any) {
    // console.log(e, val, "TEST::::");
  }
  selectMobileToggle(e: any, val: any) {
  }
  verifyMobileMail() {

  }

  getManageAleretsData() {
    this.isLoadingCompelete = false;
    this.settingsService.getManageAlerts().subscribe((manageAlertsData: any) => {
      this.isLoadingCompelete = true;
      this.manageDate = manageAlertsData
      this.sourceData = manageAlertsData.data;
      this.dataSourceLength = manageAlertsData.data.length;
      this.dataSourceToPass = new MatTableDataSource(manageAlertsData.data)
      this.dataSourceToPass.paginator = this.commonPagination.paginator;
      this.totalRecords = manageAlertsData.data.TOTAL_COUNT;
      if (this.manageDate === null || this.manageDate === '' || this.manageDate === undefined) {
        this.norecordflag = !this.norecordflag;
      }

    },
      error => {
        this.isLoadingCompelete = true;
      });
  }

  paginationChangeClick(params: any) {
    // console.log("SPEVENT====>",params)
    this.fromRow = params.fromRow;
    this.toRow = params.toRow;
    this.getManageAleretsData();
  }

  selectType(event: any, datasource: any, column: any) {
    let data = datasource;
    let selectedColumn = column;
    let selectedtableData: any = {};
    for (let i = 0; i < this.sourceData.length; i++) {
      if (this.sourceData[i].odSubprodCode === data.odSubprodCode) {
        if (selectedColumn === 'channelInbox' && (this.sourceData[i].channelInbox === 'N' || this.sourceData[i].channelInbox === null || this.sourceData[i].channelInbox === '')) {
          selectedtableData = {
            "odProductCode": this.sourceData[i].odPortalProductCode,
            "odSubprodCode": this.sourceData[i].odSubprodCode,
            "channelId": '2001',
            "enabled": 'Y'
          }
          this.sourceData[i].channelInbox = 'Y';
          this.sourceData[i].channelId = '2001';
        }
        else if (selectedColumn === 'channelInbox') {
          selectedtableData = {
            "odProductCode": this.sourceData[i].odPortalProductCode,
            "odSubprodCode": this.sourceData[i].odSubprodCode,
            "channelId": '2001',
            "enabled": 'N'
          }
          this.sourceData[i].channelInbox = 'N';
          this.sourceData[i].channelId = '2001';
        }


        if (selectedColumn === 'channelEmail' && (this.sourceData[i].channelEmail === 'N' || this.sourceData[i].channelEmail === null || this.sourceData[i].channelEmail === '')) {
          selectedtableData = {
            "odProductCode": this.sourceData[i].odPortalProductCode,
            "odSubprodCode": this.sourceData[i].odSubprodCode,
            "channelId": '2002',
            "enabled": 'Y'
          }
          this.sourceData[i].channelEmail = 'Y';
          this.sourceData[i].channelId = '2002';
        }
        else if (selectedColumn === 'channelEmail') {
          selectedtableData = {
            "odProductCode": this.sourceData[i].odPortalProductCode,
            "odSubprodCode": this.sourceData[i].odSubprodCode,
            "channelId": '2002',
            "enabled": 'N'
          }
          this.sourceData[i].channelEmail = 'N';
          this.sourceData[i].channelId = '2002';
        }


        if (selectedColumn === 'channelSms' && (this.sourceData[i].channelSms === 'N' || this.sourceData[i].channelSms === null || this.sourceData[i].channelSms === '')) {
          selectedtableData = {
            "odProductCode": this.sourceData[i].odPortalProductCode,
            "odSubprodCode": this.sourceData[i].odSubprodCode,
            "channelId": '2003',
            "enabled": 'Y'
          }
          this.sourceData[i].channelSms = 'Y';
          this.sourceData[i].channelId = '2003';
        }
        else if (selectedColumn === 'channelSms') {
          selectedtableData = {
            "odProductCode": this.sourceData[i].odPortalProductCode,
            "odSubprodCode": this.sourceData[i].odSubprodCode,
            "channelId": '2003',
            "enabled": 'N'
          }
          this.sourceData[i].channelSms = 'N';
          this.sourceData[i].channelId = '2003';
        }
        let item = this.storedData.find((item: any) => {
          if (item.odSubprodCode === this.sourceData[i].odSubprodCode) {
            if (item.channelId === this.sourceData[i].channelId) {
              return item;
            }
          }

        });
        if (item) {
          item.enabled = selectedtableData.enabled;
        }
        else {
          this.storedData.push(selectedtableData);
        }

      }


    }



  }

  onClickReset(){
    
  }
  submitTransfer() {
    // console.log(this.storedData,"submitTransfer:::StoredData::::");
    // console.log(this.dataSourceToPass,"TEST::LL::L")
    this.isLoadingCompelete = false;
    this.settingsService.submitManageAlerts(this.storedData).subscribe((response: any) => {
      this.isLoadingCompelete = true;
      let responseData = response.data.data;
      if (responseData === 'SUCCESS') {

      }
    },
      error => {
        this.isLoadingCompelete = true;
      });
  }

}
