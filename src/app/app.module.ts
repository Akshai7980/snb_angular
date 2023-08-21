import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthHeaderInterceptor } from './interceptor/auth-header.interceptor';
//import {NgxPrintModule} from 'ngx-print';
import { CommonComponentsModule } from './common-components/common-components.module';
import { DashboardModule } from './dashboard/dashboard.module';
// import { DateFormatPipe } from './pipes/date-format.pipe';
//import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslatePaginatorLabels } from './utility/paginator-labels';
import { PayrollComponent } from './payroll/payroll.component';

@NgModule({
  declarations: [
    AppComponent,
    PayrollComponent
    // DateFormatPipe,
  //  CurrencyFormatPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonComponentsModule,
    OverlayModule,
  //  NgxPrintModule,
    DashboardModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })
  ],
 
  providers: [{
    provide: HTTP_INTERCEPTORS, 
    useClass: AuthHeaderInterceptor, 
    multi: true
  },
  {provide:MatPaginatorIntl,useClass:TranslatePaginatorLabels}
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}