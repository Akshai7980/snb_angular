import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { TicketServiceService } from '../../services/ticket-service.service';
@Component({
  selector: 'app-ecorp-general-issue-ticket-inquiry',
  templateUrl: './ecorp-general-issue-ticket-inquiry.component.html',
  styleUrls: ['./ecorp-general-issue-ticket-inquiry.component.scss']
})
export class EcorpGeneralIssueTicketInquiryComponent implements OnInit {

  printSection: string = "posFinanceTicketInquirySummaryPrintSection";
  logo = 'assets/images/snb-logo-print.png';

  isLoadingComplete: boolean = true;

  ecorpGeneralIssueTicketInquirySummaryDetails: any = {};
  workFlowHistoryParams: any;
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
    this.getecorpGeneralIssueTicketInquirySummaryDetails();
  }

  getecorpGeneralIssueTicketInquirySummaryDetails() {
    this.isLoadingComplete = false;
    this.ticketService.getecorpGeneralIssueTicketInquirySummaryDetails().subscribe((res: any) => {
      this.ecorpGeneralIssueTicketInquirySummaryDetails = res.data;
      this.isLoadingComplete = true;
    })
  }


}
