import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SadadRoutingModule } from './sadad-routing.module';
import { SadadComponent } from './sadad.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { CreditedToComponent } from './components/credited-to/credited-to.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SadadPaymentsComponent } from './components/sadad-payments/sadad-payments.component';
import { AddSadadBillerComponent } from './components/add-sadad-biller/add-sadad-biller.component';
import { SadadBillDetailsComponent } from './components/sadad-bill-details/sadad-bill-details.component';

import { SadadMoiComponent } from './components/sadad-moi/sadad-moi.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SadadMoiPaymentToComponent } from './components/sadad-moi-payment-to/sadad-moi-payment-to.component';
import { AddESALPayerComponent } from './components/add-esal-payer/add-esal-payer.component';
import { ESALPayerDetailsComponent } from './components/esal-payer-details/esal-payer-details.component';
import { SadadEsalComponent } from './components/sadad-esal/sadad-esal.component';
import { SadadEsalPaymentToComponent } from './components/sadad-esal-payment-to/sadad-esal-payment-to.component';
import { EsalAmountDetailsComponent } from './components/esal-amount-details/esal-amount-details.component';
import { SadadBillerInquiryComponent } from './components/sadad-biller-inquiry/sadad-biller-inquiry.component';
import { BillsInquiryComponent } from './components/bills-inquiry/bills-inquiry.component';
import { SadadBillerDetailsLayoutComponent } from './components/sadad-biller-details-layout/sadad-biller-details-layout.component';
import { DeleteSadadBillerComponent } from './components/delete-sadad-biller/delete-sadad-biller.component';
import { SadadMoiRefundPaymentToComponent } from './components/sadad-moi-refund-payment-to/sadad-moi-refund-payment-to.component';
import { SadadMoiRefundComponent } from './components/sadad-moi-refund/sadad-moi-refund.component';
import { SadadBulkPaymentComponent } from './components/sadad-bulk-payment/sadad-bulk-payment.component';
import { SadadMoiBulkPaymentComponent } from './components/sadad-moi-bulk-payment/sadad-moi-bulk-payment.component'
import { BillerDetailsComponent } from './components/biller-details/biller-details.component';
import { EsalBillerInquiryComponent } from './components/esal-biller-inquiry/esal-biller-inquiry.component';
import { EsalBillerDetailsLayoutComponent } from './components/esal-biller-details-layout/esal-biller-details-layout.component';
import { DeleteEsalBillerComponent } from './components/delete-esal-biller/delete-esal-biller.component'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  declarations: [
    SadadComponent,
    CreditedToComponent,
    SadadPaymentsComponent,
    AddSadadBillerComponent,
    SadadBillDetailsComponent,
    SadadMoiComponent,
    AddESALPayerComponent,
    ESALPayerDetailsComponent,
    SadadMoiPaymentToComponent,
    SadadEsalComponent,
    SadadEsalPaymentToComponent,
    EsalAmountDetailsComponent,
    SadadBillerInquiryComponent,
    BillsInquiryComponent,
    SadadBillerDetailsLayoutComponent,
    DeleteSadadBillerComponent,
    SadadMoiRefundPaymentToComponent,
    SadadMoiRefundComponent,
    SadadBulkPaymentComponent,
    SadadMoiBulkPaymentComponent,
    BillerDetailsComponent,
    EsalBillerInquiryComponent,
    EsalBillerDetailsLayoutComponent,
    DeleteEsalBillerComponent,
    
  ],
  imports: [
    CommonModule,
    SadadRoutingModule,
    CommonComponentsModule,
    MatSelectModule,
    FormsModule,
    MatTableModule,
    SharedModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatAutocompleteModule
  ],
  exports:[],
  providers:[CurrencyFormatPipe]
})
export class SadadModule { }
