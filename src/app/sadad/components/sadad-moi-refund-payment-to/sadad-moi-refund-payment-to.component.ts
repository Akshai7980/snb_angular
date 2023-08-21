import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaxLengthValidator, MinLengthValidator } from '@angular/forms';
import { AmountUnformatPipePipe } from 'src/app/pipes/amount-unformat-pipe.pipe';
import { CurrencyFormatPipe } from 'src/app/pipes/currency-format.pipe';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import { SadadPaymentService } from '../../services/sadad-payment.service';

@Component({
  selector: 'app-sadad-moi-refund-payment-to',
  templateUrl: './sadad-moi-refund-payment-to.component.html',
  styleUrls: ['./sadad-moi-refund-payment-to.component.scss']
})
export class SadadMoiRefundPaymentToComponent implements OnInit {
  @Input()selectedObj:any
  total=0
  moiTo={biller:'',serviceType:'',nationalId:'',dob:'',amt:'', billerCode:'', dynamicObject:[], receiptAmt:'', billerId:''}
  readOly=false
  dataSource:any
  footerSource:any
  formatType=''
  footerSourceColumn=['desc','amount']
  isProceed=false;
  isLoadingCompelete = false;
  billerName:string="";
  billerId: string = "";
  billerCode: string = "";
  serviceDynamicValue: any = [];
  rootScopeData:RootScopeDeclare=RootScopeData;
  languageval :string ="";
  checkedvalue: any = {};
  dynamicObject: any;
  dynamicFieldsForPayload: any = [];
  @Output() dynamicParamValues = new EventEmitter;
  dynamicarray: any= [];
  displayedColumns=['biller','ServiceType','description','action'];
  billerRefundInformdataSourceLocal:any;
  billerEmpty:boolean=false;
  selectedBillerName:any;
  // billers=['CivilRegistration','Motor Vehicles','Driving Licences','Saudi Passport']
  // serviceTypes=['Birth Registration','Death Registration','Marriage Registration','Divorce Registration']  @Output() onPayToSelect = new EventEmitter();
  @Input() selectedObjData: any;
  billerRefundInformdataSource: any;
  refundServiceTypeData: any;
  refundServiceCode: any;
  serviceFeeAmt: any;
  serviceTaxAmt: any;
  refundServiceTypeDataLocal:any;
  serviceTypeEmpty: any;
  selectedServiceType:any;
  @Output() onPayToSelect = new EventEmitter()
  @Output() feesInq = new EventEmitter()
  totalPayableAmt:string = "LBL_TOTAL_PAYABLE_AMT";
  description:string = "LBL_DESCRIPTION";
  nationalID:string = "LBL_NATIONAL_ID";
  amountToDisp:string = "LBL_AMOUNT";
  showError: any = [];
  serviceCode: string = '';
  amountValidation = false;

  constructor(private curencyPipe:CurrencyFormatPipe,private sadadService: SadadPaymentService,public datePipe:DatePipe) {
    let userInfo=this.rootScopeData.userInfo;  
    this.languageval = userInfo.mLanguage;
   }

  ngOnInit(): void {
    if(this.selectedObj){
      this.dataSource=this.selectedObj
    }
    this.billerRefundinform();
  }
  ondynamicSelect(name: any, engName: any, value: any) {
    let vname = name;
    let vvalue = value;
    for (let i = 0; i < this.serviceDynamicValue.length ; i++) {
      if (name === this.serviceDynamicValue[i].name) {
        this.dynamicFieldsForPayload[i] = {
          name: vname,
          value: vvalue,
          englishName: engName,
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
          value: vvalue,
          englishName: engName,
        };
      } else {
        for (let i = 0; i < this.dynamicarray.length; i++) {
          if (this.dynamicarray[i].name == vname) {
            this.dynamicarray.splice(i, 1);
            this.dynamicObject = {
              name: vname,
              value: vvalue,
              englishName: engName,
            };
          } else {
            this.dynamicObject = {
              name: vname,
              value: vvalue,
              englishName: engName,
            };
          }
        }
      }
      this.dynamicarray.push(this.dynamicObject);
      this.moiTo.dynamicObject = this.dynamicFieldsForPayload;
      // this.sadadService.getSadadMoiRefundAmount(this.dynamicFieldsForPayload, this.selectedObjData.OD_ACC_NO, this.billerId, this.billerName,this.refundServiceCode).subscribe((feesData:any) => {
      //   this.isLoadingCompelete = true;
      //   if(feesData.data && feesData.data.feeReferenceId){
      //     this.feesInq.emit(feesData)
      //     this.isProceed = false;
      //   }
      //   else if(feesData.data && feesData.data.res_ErrorCode){
      //     this.rootScopeData.showSystemError = true;
      //     this.rootScopeData.toastMessage = feesData.data.errorDesc;
      //     this.isProceed = true;
      //   }
       
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
            englishName: engName,
          };
          this.moiTo.dynamicObject = this.dynamicFieldsForPayload;
        }
      }
    }

    if(this.dynamicFieldsForPayload.length>1){
      for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
        let dynamicfieldsTrim = this.dynamicFieldsForPayload[i].value.trim()
        if(this.dynamicFieldsForPayload[i].name === name){
          if (dynamicfieldsTrim.length > 0) {
            this.showError[i] = false;
          } else {
            this.showError[i] = true;
          }    
        }
      }
    }
  }

  // errorCHecking(ii:any) {
  //   for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
  //     if( ii == i){
  //       if (
  //         this.dynamicFieldsForPayload[i].value.length > 0 &&
  //         this.dynamicFieldsForPayload[i].value.length < 10
  //       ) {
  //         this.showError[i] = true;
  //       } else {
  //         this.showError[i] = false;
  //       }
  //     }
  //   }
  // }

  setReadOly(){

    for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
      let dynamicfieldsTrim = this.dynamicFieldsForPayload[i].value.trim()
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
 

    this.total=0;
    this.dataSource=[this.moiTo]
    this.readOly=true
    // fetch data based on moiTo Object
    let objData = this.selectedObjData
    this.isLoadingCompelete = false;
    this.dynamicParamValues.emit(this.dynamicFieldsForPayload);
    this.sadadService.getSadadMOIRefChargesApiCall(objData).subscribe((result)=>{
      let convtd_ccy = result.data[0].chargeInfo[0].ccy;
      let serviceFee = result.data[0].chargeInfo[0].charge ? result.data[0].chargeInfo[0].charge : "0.0";
      let serviceTax = result.data[0].chargeInfo[0].tax ? result.data[0].chargeInfo[0].tax : "0.0";
      this.serviceFeeAmt = this.curencyPipe.transform(serviceFee.trim(), convtd_ccy);
      this.serviceTaxAmt = this.curencyPipe.transform(serviceTax.trim(), convtd_ccy);
      this.footerSource=[{desc:'Service Fee',amt:this.serviceFeeAmt+" "+convtd_ccy},{desc:'Service Tax',amt:this.serviceTaxAmt+" "+convtd_ccy}]
      this.total=Number(serviceFee) + Number(serviceTax)
      let convrtTotal = this.total.toString();
      let moiToAmt = this.curencyPipe.transform(convrtTotal,convtd_ccy)
      this.moiTo.amt = this.getUnformattedCurrency(moiToAmt,'').trim()
      this.moiTo.receiptAmt = this.curencyPipe.transform(convrtTotal,convtd_ccy)+" "+convtd_ccy
      this.isLoadingCompelete = true;
    }, () => {
      this.isLoadingCompelete = true;
    })
  }

  selectedRow(val:any){
    if(val=='iconClick'){
      this.readOly=false;
      this.moiTo.amt='';
      this.moiTo.biller='';
      this.moiTo.dob='';
      this.moiTo.serviceType='';
      this.selectedObj=null;
      this.isProceed=false
      this.rootScopeData.sadadReset=true
      this.moiTo.nationalId='';
      this.moiTo.billerCode='';
      this.moiTo.dynamicObject=[];
      this.moiTo.receiptAmt='';
      this.moiTo.billerId='';
    }
  }
  proceedToNext(){
    this.setReadOly();
    for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
      let dynamicfieldsTrim = this.dynamicFieldsForPayload[i].value.trim()
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
 
     this.dataSource=[this.moiTo]
    let moiToamnt = 0;
    if(moiToamnt >= 0)
    {
      this.amountValidation = false;
      this.isProceed = true;
      this.readOly = false;
      this.moiTo.amt = '0'
      this.dataSource[0].amt = this.moiTo.amt;
      this.dataSource[0].serviceCode = this.refundServiceCode;
      this.onPayToSelect.emit(this.dataSource);
    }
    else{
      this.amountValidation = true
      return;
    }
    
    // this.dynamicParamValues.emit(this.dynamicFieldsForPayload);
  }
  getDate(val:any){
    this.moiTo.dob=val
  }
  billerRefundinform() {
    this.isLoadingCompelete = false;
    this.sadadService.getSadadMoiRefundBillerInfo().subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billerRefundInformdataSource = data.data;
        this.billerRefundInformdataSourceLocal=data?.data;
      }, error => {
        this.isLoadingCompelete = true;
      }
    )
  }

  onBillerRefundSelect(data: any) {
    this.billerName = data.billerName;
    if (this.billerName) {
      this.billerId = data.billerId;
      this.billerCode = data.billerCode;
      this.moiTo.billerCode = this.billerCode;
      this.moiTo.billerId = data.billerId;
      this.refundServiceType();
    }
  }

  refundServiceType() {
    this.isLoadingCompelete = false;
    this.sadadService.getSadadMoiRefundServiceTypeInfo(this.billerName, this.billerCode, this.billerId).subscribe((serviceData: any) => {
    this.isLoadingCompelete = true;
    this.refundServiceTypeData = serviceData.data;
    this.refundServiceTypeDataLocal = serviceData.data;
    }, error => {
    this.isLoadingCompelete = true;
    })
  }
  searchBiller(event: any){    
    const searchValue: string = event?.target?.value;
    if(searchValue.length > 0 ){
      this.billerEmpty=false
    }
    this.selectedBillerName = this.billerRefundInformdataSourceLocal;
    this.billerRefundInformdataSource = this.selectedBillerName?.filter((eachBiller: any) =>
      (eachBiller?.billerName as string)?.toLowerCase().includes(searchValue?.toLowerCase()));
      // this.billerRefundInformdataSource ? this.billerEmpty=true : this.billerEmpty=false
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
  }
  searchServiceType(event: any){    
    const searchValue: string = event?.target?.value;
    if(searchValue.length > 0 ){
      this.serviceTypeEmpty=false
    }
    this.selectedServiceType = this.refundServiceTypeDataLocal;
    this.refundServiceTypeData = this.selectedServiceType?.filter((eachService: any) =>
      (eachService?.serviceName as string)?.toLowerCase().includes(searchValue?.toLowerCase()));
      // this.refundServiceTypeData ? this.serviceTypeEmpty=true : this.serviceTypeEmpty=false
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
            this.billerEmpty=false
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
  onSelectRefundServiceType(data: any) {
    if (this.moiTo.serviceType) {
      this.refundServiceCode = data.serviceCode;
      this.sadadService.getSadadMoiRefundDynamicfields(this.billerName, this.billerCode, this.billerId,data.serviceCode).subscribe((dynamicData: any) => {
      this.isLoadingCompelete = true;
      this.isProceed = false;
      this.serviceDynamicValue = dynamicData.data[0].parameters;
      for (let i = 0; i < this.serviceDynamicValue.length; i++) {
        this.dynamicFieldsForPayload[i] = {
          name: this.serviceDynamicValue[i].name,
          value: ' ',
          englishName: this.serviceDynamicValue[i].englishName,
        };
      }
      for (let i = 0; i < this.dynamicFieldsForPayload.length; i++) {
        this.showError[i]=false;
      }
      }, error => {
      this.isLoadingCompelete = true;
      })
    }
  }

  getUnformattedCurrency(amount: string, currency: string): string {
    const unformattedAmountPipeFilter = new AmountUnformatPipePipe();
    return `${unformattedAmountPipeFilter.transform(amount, currency)} ${currency}`;
  }

  omitSplCharacters(val:any){
    return NumberValidation_Omit_Char(val);
  }

  onSelectedDate(name :any,englishName:any,value:any)
  {
    let selectedDate = this.datePipe.transform(new Date(value),"dd/MM/yyyy")
    this.ondynamicSelect(name,englishName , selectedDate);
  }
}
