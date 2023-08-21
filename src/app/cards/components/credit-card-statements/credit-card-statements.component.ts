import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { showFilteredRecords } from 'src/app/utility/tableFilter';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-credit-card-statements',
  templateUrl: './credit-card-statements.component.html',
  styleUrls: ['./credit-card-statements.component.scss']
})
export class CreditCardStatementsComponent implements OnInit {

  noRecordFlag: boolean = false;
  isLoadingComplete: boolean = true;

  setDownload: boolean = true;
  mtFlag: boolean = true;
  cifNumber: any;
  unitId: any;
  portalAccNumber:any;
  accNumber: any;
  advSearchPeriod = "";
  advSearchFromDate :any;
  advSearchToDate :any;

  statements: any = [];
  statementsToShow: any = [];

  noRecordFoundObject = {
    msg: 'LBL_NO_STATEMENTS_FOUND',
    showMsg: 'true'
  };
  cardDetails: any;

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private cardsService: CardsService) { }

  ngOnInit(): void {
    this.cardDetails = this.rootScopeData.creditCardListDetail;
    this.getStatements();
  }

  getStatements() {
    this.isLoadingComplete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
      ? this.rootScopeData.userInfo.UNIT_ID
      : '',
      pan: this.cardDetails?.cardId ? this.cardDetails.cardId : ''
    };
    this.cardsService.getCreditCardStatementLists(params).subscribe((res: any) => {
      this.isLoadingComplete = true;
      if (res.data) {
        this.statements = res.data.statement;
        this.statementsToShow = this.statements;
      }
    }, () => {
      this.isLoadingComplete = true;
    })
  }

  download_Click(stmtData: any) {
    this.isLoadingComplete = false;
    const params = {
      statementId: stmtData.statementId,
      statementDate: stmtData.statementDate
    };
    this.cardsService.downloadStatement(params).subscribe((res: any) => {
      this.isLoadingComplete = true;
      if (res.data?.statement) {
        const src = 'data:application/pdf;base64,'+ res.data.statement;
        const link = document.createElement("a");
        link.href = src;
        link.download = stmtData.statementId;
        link.click();
        link.remove();
      }
    }, () => {
      this.isLoadingComplete = true;
    })
  }

  refreshPayrollInquiry() {
    this.getStatements();
  }

  triggerSearchFilter(event: any) {
    const columnsToSearch = [
      {"name":"name", "fieldType":"string"}
    ];
    const tableData = showFilteredRecords(this.statements, columnsToSearch, event.target.value);
    this.statementsToShow = tableData;
  }

  advancedSearchApply(event: any) {}

}
