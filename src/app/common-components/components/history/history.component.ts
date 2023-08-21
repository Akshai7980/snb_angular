import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['status', 'action', 'userName', 'date'];
  dataSourceToPass: any;
  @Input() historyData: any;
  isHistoryExpand: boolean = false;
  noRecordFoundInfoObj: any;
  contentHeight: any;
  norecordflag: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSource: any;
  isLoadingCompelete = true;
  constructor(private commonService: CommonService) {
  }
  

  ngOnInit(): void {
    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_ACCOUNTS_FND',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };
    this.getHistoryDetails();
  }

  getTableHeight() {
    let that = this;
    window.setTimeout(function () {
      that.contentHeight =
        document.getElementById('historyexpandCollapseElement')?.clientHeight +
        '';
    }, 1000);
  }

  getHistoryDetails() {
    this.isLoadingCompelete = false;
    this.commonService.getHistoryDetails(this.historyData).subscribe(
      (data: any) => {
        if (data && data.data) {
          this.norecordflag = false;
          this.isLoadingCompelete = true;
          this.dataSource = data.data;
          this.dataSourceToPass = new MatTableDataSource(this.dataSource);
        }
        else{
          this.isLoadingCompelete = true;
          this.norecordflag = true;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
        this.norecordflag = true;
      }
    );
  }
  onClickExpand(event:any) {
    this.isHistoryExpand = !this.isHistoryExpand;
  }
}
