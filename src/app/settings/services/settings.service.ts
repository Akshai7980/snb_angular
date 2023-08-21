import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(private http: HttpClient) {}

  changePasswordApiCall(
    oldPass: any,
    newPass: any,
    confirmPass: any,
    otp: any,
    otpRef: any
  ): Observable<any> {
    let inputPayload = {
      headerValue: {
        moduleId: 'CHGPWD',
      },
      dataValue: {
        userNo: '',
        unitId: '',
        gcif: '',
        encryptionFlag: 'N',
        encryption: 'SALT',
        encryptionKey: '',
        inputChannelId: '',
        PARAM1: otp,
        PARAM2: otpRef,
        oldPassword: oldPass,
        newPassword: newPass,
        cnfPassword: confirmPass,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/changePasswordSuccess.json');
    } else {
      return this.http.post(`${environment.restAPI}`, inputPayload);
    }

    // return this.http.get("assets/simulateAPI/changePasswordError.json", inputPayload)
    // return this.http.get("assets/simulateAPI/changePasswordSuccess.json");
    // return this.http.post(`${environment.restAPI}`, inputPayload);
  }

  getManageAlerts() {
    let reqData = {
      headerValue: {
        moduleId: 'MANAGEALERTS',
      },
      dataValue: {
        userNo: '',
        gcif: '',
        sortColumn: '',
        sortDirection: '',
        fromRowNo: '0',
        toRowNo: '45',
        filterMap: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        groupBy: '',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/manageAlerts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }

    //  return this.http.post(`${environment.restAPI}`, reqData );
    //return this.http.get('assets/simulateAPI/manageAlerts.json')
  }

  submitManageAlerts(storedData: any) {
    let accnum = this.rootScopeData.userInfo.userNo;
    let reqData = {
      headerValue: {
        moduleId: 'SAVEMANAGEALRTS',
      },
      dataValue: {
        userNo: '',
        gcif: '',
        sortColumn: '',
        sortDirection: '',
        fromRowNo: '0',
        toRowNo: '45',
        alertSubscription: storedData,
        filterMap: [
          {
            filterField: '',
            filterConstraint: 'contains',
            filterValue: '',
          },
        ],
        unitId: '',
        groupBy: '',
      },
      footerValue: {
        userNo: accnum,
        gcif: '',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/submitManageAlerts.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }

    //  return this.http.post(`${environment.restAPI}`, reqData);
    // return this.http.get('assets/simulateAPI/submitManageAlerts.json')
  }

  savePreferenceApiCall(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'PREFERNCE',
      },
      dataValue: {
        userNo: '',
        gcif: '',

        formatting: {
          languageSelected: params.language,
          amountFormat: params.amountFormat,
          dateFormat: params.dateFormat,
          timeZone: params.timeZone,
        },
      },
      footerValue: {
        userNo: '202007003340',
        gcif: '3000010021',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/savePreference.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }

    // return this.http.post(`${environment.restAPI}`, reqData);
    // return this.http.get('assets/simulateAPI/savePreference.json')
  }

  saveAppearanceApiCall(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'APPEARENCES',
      },
      dataValue: {
        userNo: '',
        gcif: '',

        appearance: {
          darkMode: params.darkMode,
          themeColour: params.themeColor,
          fontSize: params.fontSize,
        },
      },
      footerValue: {
        userNo: '202007003340',
        gcif: '3000010021',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/saveAppearance.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }

    // return this.http.post(`${environment.restAPI}`, reqData);
    //return this.http.get('assets/simulateAPI/saveAppearance.json')
  }

  fileUpload(formdata: any): Observable<any> {
    //var formdata = formdata;
    return this.http.post(`${environment.uploadUserImage}`, formdata);
  }

  getUserProfileData() {
    let reqData = {
      headerValue: {
        moduleId: 'USERPROFILE',
      },
      dataValue: {
        userNo: '',
        gcif: '',
      },
      footerValue: {
        userNo: '202005003160',
        gcif: '1004',
      },
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/userProfile.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }

    // return this.http.post(`${environment.restAPI}`, reqData);
    //return this.http.get('assets/simulateAPI/userProfile.json')
  }
  getNationalIdDetails() {
    let reqData = {
      headerValue: {
        moduleId: 'USERPROFILE',
      },
      dataValue: {},
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/National_Id_Details.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  updateNationalId(obj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'NATIDEXPPROCEED',
      },
      dataValue: {
        INPUT_FUNCTION_CODE: 'UPIDFNC',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'UPNATID',
        nationalId: obj.ID_NUMBER,
        exp_Date: obj.EXP_DATE,
        dateofBirth: obj.DOB,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/National_Id_Proceed.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  nationalAddressApi() {
    let reqData = {
      headerValue: {
        moduleId: 'NATADDCIFLKUP',
        simulate: 'N',
      },
      dataValue: {
        productName: 'CUSER',
        subProductName: 'UPNATAD',
        functionCode: 'UPNTFNC',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/nationalAddress.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  getNationalAddressDetails(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'NATADDDETAILS',
      },
      dataValue: {
        id: reqObj.cifId,
        productName: 'CUSER',
        subProductName: 'UPNATAD',
        functionCode: 'UPNTFNC',
        unitId: reqObj.unitId,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/NationalAddressDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  crExpiryDetails() {
    let reqData = {
      headerValue: {
        moduleId: 'CRDETAILS',
        simulate: 'N',
      },
      dataValue: {
        subProductName: 'UPDCREX',
        unitId: this.rootScopeData.userInfo.UNIT_ID,
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/crExpiryDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  submiNationalApi(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'NATADDSUBMIT',
        simulate: 'N',
      },
      dataValue: {
        AUTH_TYPE_O: reqObj.AUTH_TYPE_O,
        PARAM2: reqObj.PARAM2,
        PARAM1: reqObj.PARAM1,
        SEL_PARSED_RULE_ID: reqObj.PARSED_RULE_ID,
        SELECTION_FLAG: reqObj.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'UPNTFNC',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'UPNATAD',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: reqObj.INPUT_CIF_NO,
        INPUT_UNIT_ID: reqObj.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: '',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: 'C',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: reqObj.INPUT_VALUE_DATE,
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        BUILDNO: reqObj.BUILDNO,
        STREET_NAME: reqObj.STREET_NAME,
        DIST_NAME: reqObj.DIST_NAME,
        CITY: reqObj.CITY,
        ZIP_CODE: reqObj.ZIP_CODE,
        COUNTRY: reqObj.COUNTRY,
        COUNTRY_NAME: reqObj.COUNTRY_NAME,
        INPUT_HOST_CODE: 'UPAD',
        pageType:reqObj.pageType
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/UpdateNationalAddress_Submit.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  submitCrExpiryApi(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'CRSUBMIT',
        simulate: 'N',
      },
      dataValue: {
        AUTH_TYPE_O: reqObj.AUTH_TYPE_O,
        PARAM2: reqObj.PARAM2,
        PARAM1: reqObj.PARAM1,
        SEL_PARSED_RULE_ID: reqObj.PARSED_RULE_ID,
        SELECTION_FLAG: reqObj.SELECTION_FLAG,
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'UPCRFNC',
        INPUT_PRODUCT: 'CUSER',
        INPUT_SUB_PRODUCT: 'UPDCREX',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: reqObj.CIF_NO,
        INPUT_UNIT_ID: this.rootScopeData.userInfo.UNIT_ID,
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: '',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: 'C',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: reqObj.INPUT_VALUE_DATE,
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        CIF_NO: reqObj.CIF_NO,
        CIF_NAME: reqObj.CIF_NAME,
        CR_NUM: reqObj.CR_NUM,
        EXP_DATE: reqObj.EXP_DATE,
        INPUT_HOST_CODE: 'UPCR',
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/updateCrExpiry_Submit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  changePVNSubmit(reqObj: any) {
    let reqData = {
      headerValue: {
        moduleId: 'CHANGEPVN',
      },
      dataValue: {
        encryptionFlag: 'N',
        encryption: 'SALT',
        encryptionKey: '',
        inputChannelId: '',
        PARAM1: '',
        PARAM2: '',
        oldPvn: reqObj.oldPvn1,
        tokenCode: reqObj.tokenCodePvn,
        newPvn: reqObj.nPv,
        confirmPvn: reqObj.conPvn,
        languageId: 'en_US',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/changePvnSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  tokenInquiryApi() {
    let reqData;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/tokenInquiry.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  tokenRequestApi() {
    let reqData;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/sadadDebitLKp.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
  feeDetails() {
    let reqObj;
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/executionCharges.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObj);
    }
  }

  // ------------------------------------ FATCA APIs Starts Here ---------------------------------

  fetchCifLooUp() {
    const reqObj = {
      headerValue: {
        moduleId: 'FATCACIFLKP',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'FATCA',
        functionCode: 'FATCAFNC',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/cifLooUpFatca.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqObj);
    }
  }

  fatcaDetailsApi() {
    const reqData = {
      headerValue: {
        moduleId: 'FATCADETAIL',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {},
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fatcaDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getCountriesList() {
    const reqData = {
      headerValue: {
        moduleId: 'FATCACOUNTRY',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        action: 'GET_COUNTRY_DROP_DOWN',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fatcaCountriesList.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // sharif confirmed on all the params passed here.
  fatcaSubmit(params: any) {
    const reqData = {
      headerValue: {
        moduleId: 'FATCASUBMIT',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        AUTH_TYPE_O: '',
        PARAM2: '',
        PARAM1: '',
        SEL_PARSED_RULE_ID: '',
        SELECTION_FLAG: 'N',
        INPUT_ACTION: 'SAVE_TXN',
        INPUT_FUNCTION_CODE: 'FATCAFNC',
        INPUT_PRODUCT: 'CORESVS',
        INPUT_SUB_PRODUCT: 'FATCA',
        INPUT_ENTL_VALUE: '',
        INPUT_CIF_NO: params.INPUT_CIF_NO, //
        INPUT_UNIT_ID: params.INPUT_UNIT_ID, //
        INPUT_DEBIT_ORG_ACC_NO: '',
        INPUT_LANGUAGE_ID: 'en_US',
        INPUT_TXN_STATUS: 'RA',
        INPUT_CUST_TYPE: '',
        INPUT_REQ_COUNTRY_CODE: '',
        INPUT_VALUE_DATE: '',
        INPUT_TXN_CURRENCY: '',
        INPUT_TXN_AMOUNT: '0',
        INPUT_HOST_CODE: 'FATCA',
        INPUT_VERSION_NO: '1',
        INPUT_SERVICE: 'PAYMNT_FT',
        ESTABLISHMENT_NAME: params.ESTABLISHMENT_NAME, //
        OWNER_NAME: params.OWNER_NAME, //
        NATIONALITY: params.NATIONALITY, //
        COUNTRY_OF_BIRTH: params.COUNTRY_OF_BIRTH, //
        TAX_RESIDENCY: params.TAX_RESIDENCY, //
        COUNTRY1: params.COUNTRY1, //
        COUNTRY1_TAX_ID: params.COUNTRY1_TAX_ID, //
        COUNTRY2: params.COUNTRY2, //
        COUNTRY2_TAX_ID: params.COUNTRY2_TAX_ID, //
        COUNTRY3: params.COUNTRY3, //
        COUNTRY3_TAX_ID: params.COUNTRY3_TAX_ID, //
        FATCACLASS: params.FATCACLASS, //
      },
      footerValue: {},
    };
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/fatcaSubmit.json');
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  // ------------------------------------ FATCA APIs Ends Here ---------------------------------

  getNatBusinessAddr(params : any){
    const payLoad = {
      "headerValue": {
        "moduleId": "GET_BUSINESS_ADDR"
      },
      "dataValue": {
        "Cif": params.cifNo,
        "unitId": params.UNIT_ID
      },
       "footerValue": {}
    }
    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/businessAddr.json');
    } else {
      return this.http.post(`${environment.restAPI}`, payLoad);
    }
  }

  getExpiryDateCRExpiry(params : any){
    const payLoad = {
      "headerValue": {
        "moduleId": "GET_CR_DATE_BY_CR_NO"
      },
      "dataValue": {
        "CRNNumber": params.crNo,
        "unitId": params.UNIT_ID,
      },
       "footerValue": {}
    }

    if (environment.localURL) {
      return this.http.get('assets/simulateAPI/crExpiryDateDetails.json');
    } else {
      return this.http.post(`${environment.restAPI}`, payLoad);
    }

  }
}
