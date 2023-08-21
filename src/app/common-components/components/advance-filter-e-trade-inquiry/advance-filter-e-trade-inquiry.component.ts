import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ETradeService } from 'src/app/e-trade/services/e-trade.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-advance-filter-e-trade-inquiry',
  templateUrl: './advance-filter-e-trade-inquiry.component.html',
  styleUrls: ['./advance-filter-e-trade-inquiry.component.scss'],
})
export class AdvanceFilterETradeInquiryComponent implements OnInit {
  @Input() showAdvancedSearchPopup: any;
  @Output() advancedSearchParams = new EventEmitter();

  lgTypes: any = [];
  lgType: string = '';
  fullName: string = '';
  lgLanguages = ['English', 'Arabic'];
  lgLanguage: string = '';
  statusList = ['Active', 'Inactive'];
  status: string = '';
  amountFrom: string = '';
  amountTo: string = '';
  subscriptions: Subscription[] = [];
  isLoadingComplete: boolean = true;

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private readonly eTradeService: ETradeService) {}

  ngOnInit(): void {
    this.getAllTypes();
  }

  getAllTypes() {
    this.isLoadingComplete = false;
    const getTypes = this.eTradeService.getTypes().subscribe(
      (res: any) => {
        this.isLoadingComplete = true;

        if (res && res.data) {
          this.lgTypes = res.data;
        }
      },
      (err: any) => {
        this.isLoadingComplete = true;
      }
    );
    this.subscriptions.push(getTypes);
  }

  onClickApply(): void {
    const params = {
      type: this.lgType ? this.lgType : '',
      language: this.lgLanguage ? this.lgLanguage : '',
      fromAmount: this.amountFrom ? this.amountFrom : '',
      toAmount: this.amountTo ? this.amountTo : '',
      fullName: this.fullName ? this.fullName : '',
      status: this.status ? this.status : '',
    };
    this.advancedSearchParams.emit(params);
    this.showAdvancedSearchPopup = false;
  }

  onClickClear(): void {
    this.lgType = '';
    this.lgLanguage = '';
    this.amountFrom = '';
    this.amountTo = '';
    this.fullName = '';
    this.status = '';
  }

  stopAdvancedSearchClose(event: any): void {
    event.stopImmediatePropagation();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
