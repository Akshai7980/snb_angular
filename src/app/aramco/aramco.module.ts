import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AramcoRoutingModule } from './aramco-routing.module';
import { AramcoMakePaymentComponent } from './components/aramco-make-payment/aramco-make-payment.component';
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { AramcoToPaymentComponent } from './components/aramco-to-payment/aramco-to-payment.component';
import { AramcoAmountDetailsComponent } from './components/aramco-amount-details/aramco-amount-details.component';
import { AramcoAmountDetailsCashComponent } from './components/aramco-amount-details-cash/aramco-amount-details-cash.component';
import { AramcoInvoiceInquiryComponent } from './components/aramco-invoice-inquiry/aramco-invoice-inquiry.component';
@NgModule({
  declarations: [
    AramcoMakePaymentComponent,
    AramcoToPaymentComponent,
    AramcoAmountDetailsComponent,
    AramcoAmountDetailsCashComponent,
    AramcoInvoiceInquiryComponent
  ],
  imports: [
    CommonModule,
    AramcoRoutingModule,
    SharedModule,
    CommonComponentsModule,
    MatButtonToggleModule,
    MatTableModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class AramcoModule { }
