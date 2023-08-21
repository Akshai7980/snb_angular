import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { NumberSuffixPipe } from '../pipes/number-suffix.pipe';
import { DatePipe } from '@angular/common';
import { AmountUnformatPipePipe } from '../pipes/amount-unformat-pipe.pipe';
import { MaskCardNumberPipe } from '../pipes/mask-card-number.pipe';
// import { TranslationLoaderService } from '../common-components/services/translation-loader.service';
import { NumbersOlyDirective } from '../directives/numbers-oly.directive';
@NgModule({
  declarations: [
    CurrencyFormatPipe,
    DateFormatPipe,
    NumberSuffixPipe,
    AmountUnformatPipePipe,
    MaskCardNumberPipe,
    NumbersOlyDirective
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
  exports: [
    TranslateModule,
    CurrencyFormatPipe,
    DateFormatPipe,
    NumberSuffixPipe,
    AmountUnformatPipePipe,
    MaskCardNumberPipe,
    NumbersOlyDirective
  ],
   providers: [DatePipe,NumbersOlyDirective]
})
export class SharedModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
  // return new TranslationLoaderService(http);
}