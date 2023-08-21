import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(public http:HttpClient) { }

  getalertDtls(params :any){;
      let reqData = {
        "headerValue": {
          "moduleId": "ALERTINQ",
          "simulate": `${environment.isSimulate}`,
          "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
        },
        "dataValue": {
          "userNo": "",
          "gcif": "",
          "fromRowNo": params.fromRow,
          "toRowNo": params.toRow,
          "filterMap": [
            {
              "filterField": "",
              "filterConstraint": "contains",
              "filterValue": ""
            }
          ],
          "unitId": "",
          "groupBy": ""
        },
        "footerValue": {}
      }
      if(environment.localURL){
        return this.http.get('assets/simulateAPI/alertsSummary.json');
       }else{
       return this.http.post(`${environment.restAPI}`,reqData)
       }
      // return this.http.post(`${environment.restAPI}`,reqData)    
    //  return this.http.get('/assets/simulateAPI/alertsSummary.json')
  }

  deleteAlertAPiCall(refNum: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "DELETEALERTS",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "messageId": refNum,
        "sortColumn": "",
        "sortDirection": "",
        "fromRowNo": "0",
        "toRowNo": "45",
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "groupBy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/delete-record.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
  //  return this.http.get('/assets/simulateAPI/delete-record.json')
    
  }

  getNotificationsSummaryCall(params:any): Observable<any> {
    let reqData = {
      "headerValue": {
        "moduleId": "NOTIFICATIONINQ",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "fromRowNo":params.fromRow,
        "toRowNo": params.toRow,
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "groupBy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/notification-summary.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
    // return this.http.get('/assets/simulateAPI/notification-summary.json')
  }

  deleteNotificationAPiCall(refNum: any) {
    let reqData = {
	  "headerValue": {
		"moduleId": "DELETENOTIFICATIONS",
			"simulate": `${environment.isSimulate}`
	  },
	  "dataValue": {
		"userNo": "",
		"gcif": "",
		"messageId": refNum,
		"sortColumn": "",
		"sortDirection": "",
		"fromRowNo": "0",
		"toRowNo": "45",
		"filterMap": [
		  {
			"filterField": "",
			"filterConstraint": "contains",
			"filterValue": ""
		  }
		],
		"unitId": "",
		"languageId": "en_US",
		"groupBy": ""
	  },
	  "footerValue": {}
	}
    return this.http.post(`${environment.restAPI}`, reqData)

  }

  getAnnouncementsSummary(params :any): Observable<any> {
    let reqData =
    {
      "headerValue": {
        "moduleId": "BROADCAST",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "LOGIN_ID": "",
        "fromRowNo":params.fromRow,
        "toRowNo": params.toRow,
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/announcement.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
  // return this.http.get('/assets/simulateAPI/announcement.json')
    
  }

  getInboxSummary(params :any){
    let reqData = {
      "headerValue": {
        "moduleId": "MAILINBOXSUMMINQ",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "groupBy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/inboxSummary.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`,reqData)
  //  return this.http.get('/assets/simulateAPI/inboxSummary.json')
  }


  getSentMailsummaryApiCall(params :any) {

    let reqData = {
      "headerValue": {
        "moduleId": "SENTMAILSUMMINQ",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder": params.sortDirection
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "groupBy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/sent-summary.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
  //  return this.http.get('/assets/simulateAPI/sent-summary.json')

  }


  getViewTrashSummaryAPiCall() {
    let reqData = {
      "headerValue": {
        "moduleId": "VIEWTRASH",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "sortColumn": "",
        "sortDirection": "",
        "fromRowNo": "0",
        "toRowNo": "45",
        "groupBy": "",
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "userId": "BANK",
        "accCcy": ""
      },
      "footerValue": {}
    }
    return this.http.post(`${environment.restAPI}`, reqData)


  }
  deleteTrashAPiCall(refNum: any, type: any) {
    let reqData = {
      "headerValue": {
        "moduleId": "DELETEMAIL",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "mailId": refNum,
        "type": type,
        "sortColumn": "",
        "sortDirection": "",
        "fromRowNo": "0",
        "toRowNo": "45",
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "groupBy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/trashDeleteRes.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
    //return this.http.get('http://localhost:4200/assets/simulateAPI/trashDeleteRes.json');

  }
  getTrashSummaryAPiCall(params:any) {
    let reqData = {
      "headerValue": {
        "moduleId": "VIEWTRASH",
        "simulate": `${environment.isSimulate}`,
        "sortColumn": params.sortcolumn,
        "sortOrder":  params.sortDirection,
      },
      "dataValue": {
        "userNo": "",
        "gcif": "",
        "fromRowNo": params.fromRow,
        "toRowNo": params.toRow,
        "groupBy": "",
        "filterMap": [
          {
            "filterField": "",
            "filterConstraint": "contains",
            "filterValue": ""
          }
        ],
        "unitId": "",
        "userId": "BANK",
        "accCcy": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/trashSummary.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    // return this.http.post(`${environment.restAPI}`, reqData)
    //  return this.http.get('/assets/simulateAPI/trashSummary.json');


  }


  emptyTrashAPiCall() {
    let reqData = {
      "headerValue": {
        "moduleId": "EMPTYTRASH",
        "simulate": `${environment.isSimulate}`
      },
      "dataValue": {
        "userNo": "",
        "gcif": ""
      },
      "footerValue": {}
    }
    if(environment.localURL){
      return this.http.get('assets/simulateAPI/trashDeleteRes.json');
     }else{
     return this.http.post(`${environment.restAPI}`,reqData)
     }
    //  return this.http.post(`${environment.restAPI}`, reqData)
    //return this.http.get('http://localhost:4200/assets/simulateAPI/trashDeleteRes.json');

  }
}
