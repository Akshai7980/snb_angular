import { Injectable } from '@angular/core';
import { RootScopeDeclare } from '../rootscope-declare';
import { RootScopeData } from '../rootscope-data';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from "rxjs/operators";
import { deleteDOMandShowReloginOPtion } from "../utility/common-utility";
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  sessionData:any
  authToken:any
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor(private transService:TranslateService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.sessionData=this.rootScopeData.jSessionId;
        
        if(this.sessionData == null){
             this.authToken=""
        }else{
            this.authToken=this.sessionData
        }
        let authReq: any;
        if(request.method == "POST") {
          if(request.body.headerValue) {

            request.body.headerValue._dinsess=this.rootScopeData.userInfo._cpReqToken;
          }else if(request.body.MODULE_ID){

            request.body._dinsess=this.rootScopeData.userInfo._cpReqToken;
          }
            if(request.body.dataValue) {
              request.body.dataValue.languageId=this.rootScopeData.userInfo.mLanguage;
              
            }else if(request.body.data) {
              request.body.data.languageId=this.rootScopeData.userInfo.mLanguage;

            }else if(request.body.MODULE_ID){
              request.body.languageId=this.rootScopeData.userInfo.mLanguage;

            }
            authReq =request.clone({
                setHeaders:{ JSESSIONID:this.authToken }
            });
        }else if(request.method == "GET") {
            if(request.url.indexOf('RestControllerServlet') >= 0) {
              authReq =request.clone({
                setHeaders:{ JSESSIONID:this.authToken }
            });
            }else {
              authReq =request.clone({
                  setHeaders:{ JSESSIONID:this.authToken },
                  params: (request.params ? request.params : new HttpParams()).set('langId', this.rootScopeData.userInfo.mLanguage).set('_dinsess', this.rootScopeData.userInfo._cpReqToken)
              });
            }
        }


        return next.handle(authReq).pipe(
          tap((data:any) => {
            // Do your success stuff in here
            if(data.body && data.body.status == '500') {
              this.rootScopeData.showSystemError = true;
              this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
            }
          }),
          catchError((error: HttpErrorResponse) => {
            if(error.status == 403) {
              deleteDOMandShowReloginOPtion(this.transService);
            }else if(error.status != 200){
              this.rootScopeData.showSystemError = true;
              this.rootScopeData.toastMessage = "LBL_ERROR_UNABLE_TO_PROCESS";
            }
            return throwError(error);
        })
        );
  }
}
