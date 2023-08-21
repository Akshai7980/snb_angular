import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-et-lg-details',
  templateUrl: './et-lg-details.component.html',
  styleUrls: ['./et-lg-details.component.scss'],
})
export class EtLgDetailsComponent implements OnInit {
  workFlowHistoryParams: any;
  @Input() details: any;
  @Output() back = new EventEmitter();
  rootScopeData: RootScopeDeclare = RootScopeData;

  printSection: string = 'etLgDetails';
  moduleId: string = '';
  constructor() {}

  ngOnInit(): void {
    this.workFlowHistoryParams = {
      refNum: this.rootScopeData.selectedInquiryForStopPayment.lg.lgNumber,
      productCode: 'NBMTRD',
      subProductCode: 'LGCSMAR',
      functionCode: 'LGCFNC',
      unitId:
        this.rootScopeData.selectedInquiryForStopPayment.fromAccount.UNIT_ID,
    };
  }

  onBack(): void {
    this.back.emit(true);
  }
}
