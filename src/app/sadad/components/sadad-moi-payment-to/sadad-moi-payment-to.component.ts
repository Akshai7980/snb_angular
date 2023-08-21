import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaxLengthValidator, MinLengthValidator } from '@angular/forms';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { amountUnFormat } from 'src/app/utility/amount-unformat';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import { SadadPaymentService } from '../../services/sadad-payment.service';

@Component({
  selector: 'app-sadad-moi-payment-to',
  templateUrl: './sadad-moi-payment-to.component.html',
  styleUrls: ['./sadad-moi-payment-to.component.scss'],
})
export class SadadMoiPaymentToComponent implements OnInit {
  @Input() selectedObj: any;
  total = 0;
  moiTo = {
    biller: '',
    serviceType: '',
    nationalId: '',
    dob: '',
    amt: '',
    billerCode: '',
    dynamicObject: [],
    receiptAmt: '',
    billerId: '',
    date: '',
  };
  readOly = false;
  dataSource: any;
  footerSource: any;
  formatType = 'SAR';
  footerSourceColumn = ['desc', 'amount'];
  isProceed = false;
  isLoadingCompelete = false;
  billerinformdataSource: any;
  billerName: string = '';
  selectedBillerName:any;
  billerinformdataSourceLocal:any;
  billerEmpty:boolean=false;
  selectedServiceType:any;
  serviceTypeDataLocal:any;
  serviceTypeEmpty:boolean=false;
  billerId: string = '';
  billerCode: string = '';
  serviceTypeData: any;
  serviceCode: string = '';
  serviceDynamicValue: any = [];
  rootScopeData: RootScopeDeclare = RootScopeData;
  languageval: string = '';
  checkedvalue: any = {};
  dynamicObject: any;
  dynamicarray: any = [];
  amount: any;
  dynamicFieldsForPayload: any = [];
  showError: any = [];
  @Output() dynamicParamValues = new EventEmitter();
  displayedColumns = [
    'biller',
    'ServiceType',
    'description',
    'amount',
    'action',
  ];
  // billers=['CivilRegistration','Motor Vehicles','Driving Licences','Saudi Passport']
  // serviceTypes=['Birth Registration','Death Registration','Marriage Registration','Divorce Registration']
  @Output() onPayToSelect = new EventEmitter();
  @Input() selectedObjData: any;
  @Output() feesInq = new EventEmitter();
  serviceFeeAmt: any;
  serviceTaxAmt: any;
  totalPayableAmt: string = 'LBL_TOTAL_PAYABLE_AMT';
  description: string = 'LBL_DESCRIPTION';
  nationalID: string = 'LBL_NATIONAL_ID';
  amountToDisp: string = 'LBL_AMOUNT';
  amountValidation = false;
  valueDate=new Date();
  showErrorAPIFail:boolean=false;
  newDate:any ={};
  showErrorForValidation: any =[];
  showLengthValidationError: any = [];
  showErrorFromAPIFail: boolean = false;
  showErrorFromAPIFailData: any;
  dynamicFieldsForView: any = [];
  insufAmtErrMsg : boolean = false;
  constructor(
    private curencyPipe: CurrencyFormatPipe,
    private sadadService: SadadPaymentService,public datePipe:DatePipe
  ) {
    let userInfo = this.rootScopeData.userInfo;
    this.languageval = userInfo.mLanguage;
  }

  ngOnInit(): void {
    if (this.selectedObj) {
      this.dataSource = this.selectedObj;
    }
    this.billerinform();
  }

  billerinform() {
    this.isLoadingCompelete = false;
    let param = {
      pageCall: undefined
    }
    this.sadadService.getSadadMoiBillerInfo(param).subscribe(
      (data) => {
        this.isLoadingCompelete = true;
        this.billerinformdataSource = data.data;
        this.billerinformdataSourceLocal =data?.data;
      },
      (error) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  onBillerSelect(data: any) {
  if((this.billerName != data.billerName) && this.billerName){
    this.moiTo.serviceType='';
    this.serviceDynamicValue=[];
    this.checkedvalue={};
    this.newDate={}
  }
    this.billerName = data.billerName;
    if (this.billerName) {
      this.showErrorAPIFail = false;
      this.billerId = data.billerId;
      this.billerCode = data.billerCode;
      this.moiTo.billerId = data.billerId;
      this.moiTo.billerCode = data.billerCode;
      this.serviceType();
      this.billerEmpty=false;
    }
  }

  serviceType() {
    this.isLoadingCompelete = false;
    this.sadadService
    .getSadadMoiService(this.billerName, this.billerCode, this.billerId,undefined)
    .subscribe(
      (serviceData: any) => {
        this.isLoadingCompelete = true;
        this.serviceTypeData = serviceData.data;
        this.serviceTypeDataLocal = serviceData.data;
      },
      (error) => {
        this.isLoadingCompelete = true;
      }
    );
  }
  searchBiller(event: any){    
    const searchValue: string = event?.target?.value;
    if(searchValue.length > 0 ){
      this.billerEmpty=false
    }
    this.selectedBillerName = this.billerinformdataSourceLocal;
    this.billerinformdataSource = this.selectedBillerName?.filter((eachBiller: any) =>
      (eachBiller?.billerName as string)?.toLowerCase().includes(searchValue?.toLowerCase()));
  }
  resetBillerInput(event: any){
    const blurredValue: string = event?.target?.value;
    const billerFound = this.selectedBillerName?.filter((eachBiller: any) =>
      (eachBiller?.billerName as string)?.toLowerCase() === blurredValue?.toLowerCase());
      (billerFound?.length > 0) ? this.billerEmpty=true : this.billerEmpty=false
      if (billerFound?.length > 0 && blurredValue?.length > 0) {
        for(let billerObj of billerFound){
          if(billerObj?.billerName === blurredValue){
            this.billerEmpty=false;
            break
          }else{
            this.billerEmpty=true;
          }
        }
      } else {
        if(billerFound?.length === 0){
          this.billerEmpty=true;
        }
      }
      // this.billerinformdataSource ? this.billerEmpty=true : this.billerEmpty=false
  }

  searchServiceType(event: any){    
    const searchValue: string = event?.target?.value;
    if(searchValue.length > 0 ){
      this.serviceTypeEmpty=false
    }
    this.selectedServiceType = this.serviceTypeDataLocal;
    this.serviceTypeData = this.selectedServiceType?.filter((eachService: any) =>
      (eachService?.serviceName as string)?.toLowerCase().includes(searchValue?.toLowerCase()));
      // this.serviceTypeData ? this.serviceTypeEmpty=true : this.serviceTypeEmpty=false
  }
  resetServiceTypeInput(event: any){
    const blurredValue: string = event?.target?.value;
    const serviceTypeFound = this.selectedServiceType?.filter((eachService: any) =>
      (eachService?.serviceName as string)?.toLowerCase() === blurredValue?.toLowerCase());
      (serviceTypeFound?.length > 0) ? this.billerEmpty=true : this.billerEmpty=false;
      if (serviceTypeFound?.length > 0 && blurredValue?.length > 0) {
        for(let servieTypeObj of serviceTypeFound){
          if(servieTypeObj?.serviceName === blurredValue){
            this.serviceTypeEmpty=false;
            this.billerEmpty=false;
            break
          }else{
            this.serviceTypeEmpty=true;
          }
        }
      } else {
        if(serviceTypeFound?.length === 0){
          this.serviceTypeEmpty=true;
        }
      }
  }

  onSelectserviceType(data: any) {
    if (this.moiTo.serviceType) {
      this.checkedvalue = {};
      this.newDate={};
      this.serviceDynamicValue = [];
      this.serviceCode = data.serviceCode;
      this.isLoadingCompelete = false;
      this.showErrorAPIFail = false;
      this.sadadService
      .getSadadMoiDynamicfields(
        this.billerName,
        this.billerCode,
        this.billerId,
        data.serviceCode
      )
      .subscribe(
        (dynamicData: any) => {
          this.isLoadingCompelete = true;
          this.serviceDynamicValue = dynamicData.data[0].parameters;
          for (let i = 0; i < this.serviceDynamicValue.length; i++) {
            this.dynamicFieldsForPayload[i] = {
              name: this.serviceDynamicValue[i].name,
              value: ' ',
              englishName: this.serviceDynamicValue[i].englishName,
              type: this.serviceDynamicValue[i].type,
              minLength : this.serviceDynamicValue[i].minimumLength,
            };
          }
          for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
            this.showError[i]=false;
          }
        },
        (error) => {
          this.isLoadingCompelete = true;
        }
      );
    }
  }

  ondynamicSelect(name: any, engName: any, value: any,type:any) {
    let vname = name;
    let vvalue = value;
    for (let i = 0; i < this.serviceDynamicValue.length ; i++) {
      // if(this.serviceDynamicValue[i].type ==='Number' || this.serviceDynamicValue[i].type ==='text'){
      //   if(this.serviceDynamicValue[i].minimumLength === value.length){
      //     this.showLengthValidationError = '';
      //     this.showErrorForValidation[i] = false;
      //   }else{
      //     this.showErrorForValidation[i] = true;
      //     this.showLengthValidationError = `Please Enter minimun length of ${this.serviceDynamicValue[i].englishName} is ${this.serviceDynamicValue[i].minimumLength}`
      //   }
      // }
      if (name === this.serviceDynamicValue[i].name) {
        this.dynamicFieldsForPayload[i] = {
          name: vname,
          value: vvalue,
          englishName: engName,
          type:type.type,
          minLength : type.minimumLength,
        };
        this.dynamicFieldsForView[i] = {
          name: vname,
          value: vvalue,
          englishName: engName,
          type:type.type,
          minLength : type.minimumLength,
        };
        // this.errorCHecking(i);
      }
    }
    if (
      value != undefined ||
      value != null ||
      value != '' ||
      (value != 0 && value == MinLengthValidator && value == MaxLengthValidator)
    ) {
      if (this.dynamicarray.length == 0) {
        this.dynamicObject = {
          name: vname,
          value: vvalue
        };
      } else {
        for (let i = 0; i < this.dynamicarray.length; i++) {
          if (this.dynamicarray[i].name == vname) {
            this.dynamicarray.splice(i, 1);
            this.dynamicObject = {
              name: vname,
              value: vvalue
            };
          } else {
            this.dynamicObject = {
              name: vname,
              value: vvalue
            };
          }
        }
      }
      this.dynamicarray.push(this.dynamicObject);
      this.moiTo.dynamicObject = this.dynamicFieldsForView;
      // this.sadadService.getSadadMoiamount(this.dynamicFieldsForPayload, this.selectedObjData.OD_ACC_NO, this.billerId, this.billerName,this.serviceCode).subscribe((feesData:any) => {
      //   this.isLoadingCompelete = true;
      //   this.serviceFeeAmt = feesData.data.feeDetails.fee.amount;
      //   this.feesInq.emit(feesData)
      // }, () => {
      //   this.isLoadingCompelete = true;
      // })
    } else {
      for (let i = 0; i < this.dynamicarray.length; i++) {
        if (this.dynamicarray[i].name == vname) {
          this.dynamicarray.splice(i, 1);
          this.dynamicObject = {
            name: vname,
            value: '',
          };
          this.moiTo.dynamicObject = this.dynamicFieldsForView;
        }
      }
    }
    if(this.dynamicFieldsForPayload.length>1){
      this.showErrorAPIFail=false;
      for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
        // code changes start here
       let dynamicfieldsTrim = this.dynamicFieldsForPayload[i].value ? this.dynamicFieldsForPayload[i].value.trim() : ''
       // code changes end here
       if(this.dynamicFieldsForPayload[i].name === name){
          if (dynamicfieldsTrim.length > 0) {
            this.showError[i] = false;
          } else {
            this.showError[i] = true;
          }    
        }

      if(this.dynamicFieldsForPayload[i].name === name){
        if(this.dynamicFieldsForPayload[i].type ==='Number' || this.dynamicFieldsForPayload[i].type ==='text'){
          if(this.dynamicFieldsForPayload[i].minLength === value.length){
            this.showLengthValidationError[i] = '';
            this.showErrorForValidation[i] = false;
          }else{
            this.showErrorForValidation[i] = true;
            this.showLengthValidationError[i] = `Please Enter minimun length of ${this.dynamicFieldsForPayload[i].englishName} is ${this.dynamicFieldsForPayload[i].minLength}`
          }
        }
      }
        
       }
    }

  }

  errorCHecking(ii:any) {
    // for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
    //   if( ii == i){
    //     if (
    //       this.dynamicFieldsForPayload[i].value.length > 0 &&
    //       this.dynamicFieldsForPayload[i].value.length < 10
    //     ) {
    //       this.showError[i] = true;
    //     } else {
    //       this.showError[i] = false;
    //     }
    //   }
    // }
  }

  setReadOly() {
    //this.ondynamicSelect();
    this.showErrorAPIFail=false;

    for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
      // code changes start here
     let dynamicfieldsTrim = this.dynamicFieldsForPayload[i].value ? this.dynamicFieldsForPayload[i].value.trim() : ''
     // code changes end here
        if (dynamicfieldsTrim.length > 0) {
          this.showError[i] = false;
        } else {
          this.showError[i] = true;
        }    
     }

    for(let j=0 ;j< this.showError.length;j++)
    {
      if(this.showError[j] === true)
      {
        return;
      }
    }

    for(let k=0 ;k< this.showErrorForValidation.length;k++)
    {
      if(this.showErrorForValidation[k] === true)
      {
        return;
      }
    }

    this.total = 0;
    this.dataSource = [this.moiTo];
    // this.readOly = true;
    // fetch data based on moiTo Object
    let objData = this.selectedObjData;
    this.isLoadingCompelete = false;
    // code changes start here
    for(let i =0;i<this.dynamicFieldsForPayload.length; i++){
      delete this.dynamicFieldsForPayload[i].englishName;
      delete this.dynamicFieldsForPayload[i].type;
      delete this.dynamicFieldsForPayload[i].minLength;
    }
    for(let i =0;i<this.dynamicFieldsForView.length; i++){
      delete this.dynamicFieldsForView[i].type;
      delete this.dynamicFieldsForView[i].minLength;
    }
    this.showErrorFromAPIFailData = '';
    this.showErrorFromAPIFail = false;
    this.sadadService.getSadadMoiamount(this.dynamicFieldsForPayload, this.selectedObjData.OD_ACC_NO, this.billerId, this.billerName,this.serviceCode).subscribe((feesData:any) => {
      this.isLoadingCompelete = true;
      if(feesData.data && feesData.data.statusDesc === "Success") {
        this.serviceFeeAmt = feesData.data.feeDetails.fee.amount;
        this.readOly = true;
        this.feesInq.emit(feesData);
        this.sadadService.getSadadMOIChargesApiCall(objData).subscribe(
          (result) => {
            if( result && result.data && result.data.length > 0 && result.data[0].chargeInfo && result.data[0].chargeInfo.length > 0){
              //console.log("TEST::", result.data.length)
              let convtd_ccy = result.data[0].chargeInfo[0].ccy;
              this.serviceTaxAmt = result.data[0].chargeInfo[0].tax ? result.data[0].chargeInfo[0].tax : '0.0';
              this.total = Number(this.serviceFeeAmt) + Number(this.serviceTaxAmt);
              let convrtTotal = this.total.toString();
              let moiToAmt = this.curencyPipe.transform(convrtTotal, convtd_ccy);
              this.moiTo.amt = this.getUnformattedCurrency(moiToAmt, '').trim();
              this.moiTo.receiptAmt = this.curencyPipe.transform(convrtTotal, convtd_ccy) + ' ' + convtd_ccy;
            }else{
              //console.log("T1")
              this.serviceFeeAmt = this.serviceFeeAmt ? this.serviceFeeAmt : '0.0';
              this.serviceTaxAmt = '0.0';
              this.footerSource = [
                { desc: 'Service Fee', amt: this.serviceFeeAmt},
                { desc: 'Service Tax', amt: '0.0'},
              ];
              this.total = Number(this.serviceFeeAmt) + Number(this.serviceTaxAmt);
              // let convrtTotal = this.total.toString();
              // let moiToAmt = this.curencyPipe.transform(convrtTotal, '');
              this.moiTo.amt = this.total.toString();
              this.moiTo.receiptAmt = this.total.toString();
              // this.moiTo.receiptAmt = this.curencyPipe.transform(convrtTotal, '');
            }
            
            this.isLoadingCompelete = true;
          },
          () => {
            this.isLoadingCompelete = true;
            this.serviceTaxAmt = 0;
            this.footerSource = [
              { desc: 'Service Fee', amt: this.serviceFeeAmt},
              { desc: 'Service Tax', amt: this.serviceTaxAmt},
            ];
            this.total = Number(this.serviceFeeAmt) + Number(this.serviceTaxAmt);
            let convrtTotal = this.total.toString();
            let moiToAmt = this.curencyPipe.transform(convrtTotal, this.formatType);
            this.moiTo.amt = this.getUnformattedCurrency(moiToAmt, '').trim();
            this.moiTo.receiptAmt = this.curencyPipe.transform(convrtTotal, this.formatType) + ' ' + this.formatType;
          }
        );
      }else if(feesData.data.errorDesc){
        this.showErrorFromAPIFailData = feesData.data.errorDesc;
        this.showErrorFromAPIFail = true;
        this.readOly = false;
      }else {
        // set error
        this.showErrorAPIFail=true;
        this.readOly = false;
      }       
    }, () => {
      this.isLoadingCompelete = true;
      // set error
      this.showErrorAPIFail=true;
      this.readOly = false;
    })
    // this.dynamicFieldsForView = this.dynamicFieldsForPayload;
    for(let i =0;i<this.dynamicFieldsForView.length; i++){
      delete this.dynamicFieldsForView[i].type;
      delete this.dynamicFieldsForView[i].minLength;
    }
    this.dynamicParamValues.emit(this.dynamicFieldsForView);
    for(let i =0;i<this.dynamicFieldsForPayload.length; i++){
      delete this.dynamicFieldsForPayload[i].englishName;
      delete this.dynamicFieldsForPayload[i].type;
      delete this.dynamicFieldsForPayload[i].minLength;
    }
  }
  selectedRow(val: any) {
    if (val == 'iconClick') {
      this.readOly = false;
      // this.moiTo.amt = '';
      // this.moiTo.biller = '';
      // this.moiTo.dob = '';
      // this.moiTo.serviceType = '';
      this.selectedObj = null;
      this.isProceed = false;
      this.rootScopeData.sadadReset = true;
      // this.moiTo.nationalId = '';
      // this.moiTo.billerCode = '';
      // this.moiTo.dynamicObject = [];
      // this.moiTo.receiptAmt = '';
      // this.moiTo.billerId = '';
      // this.checkedvalue = {};
      // this.serviceDynamicValue = [];
    }
  }
  proceedToNext() {    
    let moiToamnt = parseFloat(this.moiTo.amt)
    if(moiToamnt > 0 && moiToamnt < Number(amountUnFormat(this.selectedObjData.CURR_AVAIL_BAL_AMT)))
    {
      this.amountValidation = false;
      // this.insufAmtErrMsg = false;
      this.isProceed = true;
      this.dataSource[0].amt = this.moiTo.amt;
      this.onPayToSelect.emit(this.dataSource);
    }else if(moiToamnt > Number(amountUnFormat(this.selectedObjData.CURR_AVAIL_BAL_AMT)) ){
      this.amountValidation = false;
      this.rootScopeData.validationErrorToast = true;
      this.rootScopeData.validationToastMessage = "LBL_INSUFFICIENT_BALANCE";
      // this.insufAmtErrMsg = true;
      return;
    }else{
      this.amountValidation = true;
      // this.insufAmtErrMsg = false;
      return;
    }
    
    // this.dynamicParamValues.emit(this.dynamicFieldsForPayload);
  }
  getDate(val: any) {
    this.moiTo.dob = val;
  }
  getUnformattedCurrency(amount: string, currency: string): string {
    const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
    return `${unformattedAmountPipeFilter.transform(
      amount,
      currency
    )} ${currency}`;
  }

  omitSplCharacters(val:any){
    return NumberValidation_Omit_Char(val);
  }


  onSelectedDate(name :any,englishName:any,value:any,type:any)
  {
    let selectedDate = this.datePipe.transform(new Date(value),"dd/MM/yyyy")
    this.ondynamicSelect(name,englishName , selectedDate,type);
  }
  
}
