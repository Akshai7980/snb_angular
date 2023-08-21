import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TicketServiceService } from '../../services/ticket-service.service';


@Component({
  selector: 'app-pos-finance-ticket-inquiry-summary',
  templateUrl: './pos-finance-ticket-inquiry-summary.component.html',
  styleUrls: ['./pos-finance-ticket-inquiry-summary.component.scss']
})
export class PosFinanceTicketInquirySummaryComponent implements OnInit {

  printSection: string = "posFinanceTicketInquirySummaryPrintSection";
  logo = 'assets/images/snb-logo-print.png';

  isLoadingComplete: boolean = true;

  posFinanceTicketInquirySummaryDetails: any = {};
  workFlowHistoryParams: any;
  serviceType: string = '';
  fileUploadedDetails: any = {};

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private ticketService: TicketServiceService, private router: Router) { }

  ngOnInit(): void {
    if (!Object.keys(this.rootScopeData.posFinanceTicketInquirySummaryRecord).length) this.router.navigate(['/ticketInquiry/inquiry']);
    this.workFlowHistoryParams = {
      refNum: '',
      productCode: '',
      subProductCode: '',
      functionCode: ''
    };
    this.serviceType = this.rootScopeData.posFinanceTicketInquirySummaryRecord.serviceType;
    this.getPosFinanceSummaryDetails();
  }

  getPosFinanceSummaryDetails() {
    this.isLoadingComplete = false;
    this.ticketService.getPosFinanceTicketInquirySummaryDetails().subscribe((res: any) => {
      this.posFinanceTicketInquirySummaryDetails = res.data;
      this.isLoadingComplete = true;
    })
  }

}
