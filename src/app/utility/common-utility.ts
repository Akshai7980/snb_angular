import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';
import { CommonService } from '../common-components/services/common.service';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RootScopeData } from '../rootscope-data';
import { RootScopeDeclare } from '../rootscope-declare';

@Injectable({
  providedIn: 'root',
})
export class CommonUtility {
  constructor(private commonService: CommonService, private transService : TranslateService) { }
  rootScopeData: RootScopeDeclare = RootScopeData;

  logoutClick(lan?:any) {
    this.rootScopeData.userLang = lan
    this.commonService.logOutApiCall().subscribe((response: any) => {
      let resp: any = response;
      if (resp.logout === "success") {        
        // this.deleteAllCookies(this.transService);
        // deleteDOMandShowReloginOPtion();
        // window.location.href = "../iportal/jsps/orbilogin.jsp";
      }
    }, error => {      
      this.deleteAllCookies(this.transService);
      // deleteDOMandShowReloginOPtion();
      // window.location.href = "../iportal/jsps/orbilogin.jsp";
    }
    )
  }


  deleteAllCookies(transService :TranslateService) {
    sessionStorage.clear();
    localStorage.removeItem('sessionID');
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";

    }
    deleteDOMandShowReloginOPtion(transService);
  }

}

export function deleteDOMandShowReloginOPtion(transService :TranslateService) {
  // var stylePath = window.location.origin + "/iportalweb/entl/cssfiles/snb.css";
  let rootScopeData: RootScopeDeclare = RootScopeData;
  let sessionMsg = "";
  let logInMsg = "";
  if(rootScopeData.userInfo.mLanguage){
    sessionMsg = transService?.instant("LBL_YOUR_SESSION_TIMED_OUT_MSG");
    logInMsg = transService?.instant("LBL_LOGIN_AGAIN");
  }else{
    if(rootScopeData.userLang === 'en_US'|| localStorage.getItem('rtl')==='false'){
      sessionMsg = "Your session has timed out. Please login again";
      logInMsg = "Login Again";
    }else if(rootScopeData.userLang === 'ar_SA' || localStorage.getItem('rtl')==='true'){
      sessionMsg = "انقضت مهلة جلستك. الرجاد الدخول على الحساب من جديد";
      logInMsg = "تسجيل الدخول مرة أخرى";
    }
  }

  var style = '<style>html, body {overflow: auto !important; width: 100%;height: 100%;margin: 0px;font-family: "Helvetica";}.snbLogo{background: url(assets/images/snb-logo.png) no-repeat center;height: 45px;width: 50px;background-size: contain;margin:0px 15px;}.logocntr{background: url(assets/images/logo.png) no-repeat center;height: 40px;width: 50px;background-size: contain; margin: 10px auto auto;} .cancelBtn{background: #006a52 !important;color: #fff !important;width: 300px;height: 40px;border: 1px solid #4c596e;border-radius: 100px;background-size: cover;font-size: 14px;text-align: center;cursor: pointer;} .footer{bottom: 0 !important; } .container {height: 300px !important;} .container {width: 400px;position: absolute;top: 0; bottom: 0;left: 0; right: 0;margin: 136px auto auto;border-radius: 30px;background-color: #ffffff;box-shadow: 0px 1px 2px rgb(0 0 0 / 20%);background-size: cover;} .cancelOption {text-align: center;position: absolute;bottom: 18px;margin-left: 50px;margin-right: 50px}.headerContainer { min-height: 50px;width: 100%;background-color: #006a52;display: flex;justify-content: space-between;}</style>';
  document.getElementsByTagName('body')[0].innerHTML = style + `\n\t\t<div class="headerContainer">\n\t\t\t<div class="snbLogo">\n\t\t\t</div>\n\t\t\t<div class="langIcon"></div>\n\t\t</div>\n\t\t<div class="container">\n        <div class="applicationLogo"></div>\n        <div id="authenticationType">\n     <div class="ValidationContainer">\n     <div class="logocntr"></div> \n <div class="" style="line-height: 40px;font-size: 20px;color: rgb(0 106 82);text-decoration: none solid rgb(0, 106, 82);margin: auto;text-align: center;font-family: HelveticaNeueMed;">SNB eCorp</div>         <div class="authenticationType" style="width: auto;padding-top: 40px; text-align:center;font-family:HelveticaNeueMed;color: rgb(3 70 56);line-height: 24px;font-size: 15px;">${sessionMsg} </div>\n                \n                <div class="m_top15">\n                   \n\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n                    \n\n                </div>\n\t\t\t\t&nbsp;&nbsp; \n                <div class="cancelOption">\t\t\t\t\t\t<a href="/iportalweb/iportal/jsps/orbilogin.jsp" class="cancel" target="_self"><button class="cancelBtn">${logInMsg}</button></a></div>\n\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\t\n\n</div>\n\t\t\t\n\t\t\t\t\t\t</div>\n</div>\n\t\n\t\n`;
  // window.location.href = "/iportalweb/iportal/jsps/orbilogin.jsp";
}

export function getPdf(containerId: any, trans: any, pdfName?: any, receipt?: boolean) {
  let receiptCntr: any = document.getElementById(containerId)
  let receiptCntrHeight: any = receiptCntr?.clientHeight;
  let receiptCntrWidth: any = receiptCntr?.clientWidth;
  const options = { background: 'white', width: receiptCntrWidth, height: receiptCntrHeight };

  domtoimage.toPng(receiptCntr, options).then((imgData: any) => {
    const doc = new jsPDF(receiptCntrWidth > receiptCntrHeight ? 'l' : 'p', 'mm', [receiptCntrWidth, receiptCntrHeight + 150]);
    const imgProps = doc.getImageProperties(imgData);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    let img = new Image()
    img.src = "assets/images/snb-logo-print.png";
    doc.addImage(img, 'png', (pdfWidth / 2 - 50), 0, 100, 100);
    doc.addImage(imgData, 'PNG', 0, 100, pdfWidth, pdfHeight);
    doc.setFontSize(40);
    doc.setTextColor(162, 162, 162);
    let footer = trans.instant('LBL_PRINT_FOOTER_CONTENT_1')
    if (receipt) {
      doc.text(footer, 250, (receiptCntrHeight + 120));
    } else {
      doc.text(footer, 400, (receiptCntrHeight + 120));
    }
    doc.save(pdfName);
  });
}
export function dateFormateChanger(dateString: string): Date {
  let day = dateString.substring(0, 2);
  let month = dateString.substring(3, 5);
  let year = dateString.substring(6, 10);
  return new Date(month + "/" + day + "/" + year);
}
export function mobileNumberValidation(event: any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (!(charCode >= 48 && charCode <= 57 || charCode == 43)) {
    return false;
  }
  return true;
}
export function omit_special_char(event: any): boolean {
  let k;
  k = event.charCode;
  return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
}

export function NumberValidation_Omit_Char(event: any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

export function email(event: any): boolean {
  const charCode = /\S+@\S+\.\S+/;
  return charCode.test(event);
}

export function applyRightTheme(themeColor: any, isDarkMode: any) {
  let rightTheme = isDarkMode ? 'dark' : themeColor;
  document.body.setAttribute('theme', rightTheme);
}


export function sorting(sortDirection: any): string {
  if (sortDirection === 'desc') {
    sortDirection = 'asc';
  } else if (sortDirection === 'asc') {
    sortDirection = 'desc';
  }
  return sortDirection;

}

export function dateFormat(el: any) {
  var formatItems = 'dd/mm/yyyy'.split('/');
  var dateItems = el.beneFileUploadDate.split('/');
  var monthIndex = formatItems.indexOf('mm');
  var dayIndex = formatItems.indexOf('dd');
  var yearIndex = formatItems.indexOf('yyyy');
  var month = parseInt(dateItems[monthIndex]) - 1;
  var formatedDate = new Date(
    dateItems[yearIndex],
    month,
    dateItems[dayIndex]
  );
  return formatedDate;
}
//Print Header Logo
export function logoprint() {
  let logo = "assets/images/snb-logo-print.png";
  return logo;
}

export function integerOnly(event: any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}


export function amountValidation(amount1:any ,amount2 :any): boolean {
  let convertedAmount1 = Number(amount1);
  let convertedAmount2 = Number(amount2);
  if (convertedAmount1 < convertedAmount2) {
     return false
  }
  return true;
}






