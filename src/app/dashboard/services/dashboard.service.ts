import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // private accountSummaryReqData: any;
  // private financeSummaryReqData: any;
  // private depositSummaryReqData :any;
  // private cardSummaryReqData :any;

constructor(private http:HttpClient) { }

getAnnouncementsInfo(){
  let broadCastReqData={
    "MODULE_ID":"BROADCAST",
    "simulate": `${environment.isSimulate}`,
    "device" : "DS"
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/broadcast.json');
     }else{
      return this.http.post(`${environment.restAPI}`, broadCastReqData)
    }

    // return this.http.post(`${environment.restAPI}`,broadCastReqData);
  //return this.http.get('assets/simulateAPI/broadcast.json');
}
getTaskData(){
   let pendingActivitiesCountReqData={
    "headerValue": {
    "moduleId":"PENDCOUNT"
    },
    
     "dataValue":{
    "sortColumn":"",
    "sortDirection":"", 
    "fromRowNo":"0",
    "toRowNo":"45",
    "filterMap":[{"filterField":"ACTION_DISPVAL",
    "filterConstraint":"contains",
    "filterValue":""}],
    "unitId" : "",
    "groupBy":""
    }, 
    "footerValue": {}
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/pa-pendingActivityCount.json');
     }else{
      return this.http.post(`${environment.restAPI}`, pendingActivitiesCountReqData)
    }

    // return this.http.get('assets/simulateAPI/pa-pendingActivityCount.json');
    //  return this.http.post(`${environment.restAPI}`, pendingActivitiesCountReqData);
}
getMarketPlaceInfo(){
  let marketPlaceInput = {
    "MODULE_ID": "MARKETPLACE",
    "device" : "DS"
  }

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/marketPlace.json');
   }else{
    return this.http.post(`${environment.restAPI}`, marketPlaceInput);
    // return this.http.post(`${environment.cashCloudService}`+'/marketPlace', marketPlaceInput);
  }
  // return this.http.get('assets/simulateAPI/marketPlace.json');
  // return this.http.post(`${environment.cashCloudService}`+'/marketPlace', marketPlaceInput);
}
getAccountSummaryCall(): Observable<any> {
  let accountSummaryReqData = { "MODULE_ID": "DASHBOARDCASASUMMARY", "simulate": `N` }

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/accountsSummary.json');
   }else{
    return this.http.post(`${environment.restAPI}`, accountSummaryReqData);
  }
  //return this.http.get('/assets/simulateAPI/accountsSummary.json');
  // return this.http.post(`${environment.restAPI}`, accountSummaryReqData);
}

financeSummaryApiCall(): Observable<any> {
  let financeSummaryReqData = { "MODULE_ID": "DASHBOARDLOANSUM", "PREFERRED_CCY": "", "simulate": `N` }

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/loansSummary.json');
   }else{
    return this.http.post(`${environment.restAPI}`, financeSummaryReqData);
  }
  // return this.http.post(`${environment.restAPI}`, financeSummaryReqData);
  //return this.http.get('assets/simulateAPI/loansSummary.json');
}

depositSummaryApiCall(): Observable<any> {
  let depositSummaryReqData = {
    "MODULE_ID": "DEPOSITSUM",
    "PREFERRED_CCY": "",
    "simulate": `N`
  }

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/depositSummary.json');
   }else{
    return this.http.post(`${environment.restAPI}`, depositSummaryReqData);
  }
  //  return this.http.get('assets/simulateAPI/depositSummary.json')
  //  return this.http.post(`${environment.restAPI}`, depositSummaryReqData);
}

cardsSummaryApiCall(): Observable<any> {
  let cardSummaryReqData = {
    "MODULE_ID": "CARDSUM",
    "PREFERRED_CCY": "",
    "simulate": `N`
  }
  if(environment.localURL){
    return this.http.get('assets/simulateAPI/CardsSummary.json');
   }else{
    return this.http.post(`${environment.restAPI}`, cardSummaryReqData);
  }
  // return this.http.get('assets/simulateAPI/CardsSummary.json');
  // return this.http.post(`${environment.restAPI}`, cardSummaryReqData);
}
CreditLimit(): Observable<any>{
  let creditLimitReqData={
    "MODULE_ID":"CREDITUTIL",
    "simulate": `N`
    }

    if(environment.localURL){
      return this.http.get('assets/simulateAPI/CreditLimit.json');
     }else{
      return this.http.post(`${environment.restAPI}`, creditLimitReqData);
    }
  // return this.http.get('assets/simulateAPI/CreditLimit.json');
  // return this.http.post(`${environment.restAPI}`, creditLimitReqData);
}

getNetPositionApiCall(): Observable<any>{
  let netPositionReqData={
    "MODULE_ID":"NETPOSITION",
    "simulate": `${environment.isSimulate}`
    }
    
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/net-position.json');
     }else{
      return this.http.post(`${environment.restAPI}`, netPositionReqData);
    }
     //return this.http.get('assets/simulateAPI/net-position.json');
    // return this.http.post(`${environment.restAPI}`,netPositionReqData);

}


getPromotionsInfo(){
  let promotions = {
    "MODULE_ID":"PROMOTION",
    "device" : "DS"
  }

  if(environment.localURL){
    return this.http.get('assets/simulateAPI/marketPlace.json');
   }else{
    return this.http.post(`${environment.restAPI}`, promotions);
  }
  // return this.http.get('assets/simulateAPI/marketPlace.json');
  // return this.http.post(`${environment.cashCloudService}`+'/marketPlace', marketPlaceInput);
}

}
