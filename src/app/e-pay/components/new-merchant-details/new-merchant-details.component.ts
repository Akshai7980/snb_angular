import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { email, mobileNumberValidation, omit_special_char } from 'src/app/utility/common-utility';
import { EpayServiceService } from '../../services/epay-service.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
@Component({
  selector: 'app-new-merchant-details',
  templateUrl: './new-merchant-details.component.html',
  styleUrls: ['./new-merchant-details.component.scss']
})
export class NewMerchantDetailsComponent implements OnInit,OnChanges {
  rootScopeData: RootScopeDeclare = RootScopeData;
  merchantObj:any={
    arabicName:"",
    engName:"",
    phone:"",
    city:"",
    address:"",
    dlgFirstName:'',
    dlgLastName:'',
    dlgMob:'',
    dlgEmail:'',
    tcFirstName:'',
    tcLastName:'',
    tcMob:'',
    tcEmail:'',
    websiteURL:'',
    pmtType:'',
    pmtSrvProvider:'',
    schemas:'',
    gateWay:'',
    comment:''
  }
  errObj:any={
    arbNameErr:'',
    engNameErr:'',
    phoneErr:'',
    cityErr:'',
    addressErr:'',
    dlgmobErr:'',
    tcEmailErr:'',
    schemaErr:'',
    dlgFnameErr:'',
    dlgLnameErr:'',
    dlgEmailErr:'',
    tcFnameErr:'',
    tcLnameErr:'',
    tcmobErr:'',
    urlErr:'',
    pmtTypeErr:'',
    pmtSrvPvdErr:'',
    gatewaydErr:''
  }
  @Input() isReadOly:boolean=false;
  cities:any;
  pmtTypes:any;pmtSvcPvds:any;schemas:any;gateways:any;
  // @Input() cities:any=['Ad-Dilam','Al-Dilam','Al-Abwa','Al Arthaweeiyah','Al Bukaryiyah'];
  // @Input() pmtTypes:any=['Option1','Option2','Option3'];
  // @Input() pmtSvcPvds:any=['Moyasar','Payfort','Paytabs'];
  // @Input() schemas:any=['Schemas-1','Schemas-2','Schemas-3','Schemas-4'];
  // @Input() gateways:any=['Amazon Payment Service','PAytabs','2checkout'];

  @Output() merchantDetailsObj = new EventEmitter();
  @Output() hideMerchant = new EventEmitter();
  @Input() modify :any;
  hideBtn:boolean=false
  constructor(private epayService:EpayServiceService) { }
  ngOnChanges(): void {
  }

  ngOnInit(): void {
    this.getCity();
    this.getPaymentOption();
    this.getPaymentServiceProvider();
    this.getPaymentSchema();
    this.getPaymentGateway();
  }
  

  validate(event:any,field:any){
    if(field==='aName'){
      let arabic = /[\u0600-\u06FF0-9]/;
      let valid=arabic.test(event.target.value)
      this.errObj.arbNameErr=!this.merchantObj.arabicName || !valid?'LBL_COM_REG_NAME_ERR':''
    }else if(field==='eName'){
      let regExp=/^([a-zA-Z0-9 ]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.engNameErr=!this.merchantObj.engName || !valid ? 'LBL_COM_REG_NAME_ERR':''
    }else if(field==='phone'){
      let regExp=/^([0-9 +]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.phoneErr=!this.merchantObj.phone || !valid?'LBL_PHN_NO_ERR':''
    }else if(field==='address'){
      this.errObj.addressErr=!this.merchantObj.address?'LBL_ADDRESS_ERR':''
    }else if(field==='dlgFname'){
      let regExp=/^([a-zA-Z0-9 ]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.dlgFnameErr=!this.merchantObj.dlgFirstName || !valid?'LBL_DLG_FNAME_ERR':''
    }else if(field==='dlgLname'){
      let regExp=/^([a-zA-Z0-9 ]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.dlgLnameErr=!this.merchantObj.dlgLastName || !valid?'LBL_DLG_LNAME_ERR':''
    }else if(field==='dlgmob'){
      let regExp=/^([0-9 +]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.dlgmobErr=!this.merchantObj.dlgMob || !valid?'LBL_DLG_MOB_ERR':''
    }else if(field==='email'){
      let isValid = email(event.target.value)
      this.errObj.dlgEmailErr=!this.merchantObj.dlgEmail || !isValid ? 'LBL_DLG_EMAIL_ERR':''
    }else if(field==='tcFname'){
      let regExp=/^([a-zA-Z0-9 ]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.tcFnameErr=!this.merchantObj.tcFirstName || !valid?'LBL_TC_FNAME_ERR':''
    }else if(field==='tcLname'){
      let regExp=/^([a-zA-Z0-9 ]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.tcLnameErr=!this.merchantObj.tcLastName || !valid?'LBL_TC_LNAME_ERR':''
    }else if(field==='tcmob'){
      let regExp=/^([0-9 +]+)$/
      let valid= regExp.test(event.target.value)
      this.errObj.tcmobErr=!this.merchantObj.tcMob || !valid?'LBL_TC_MOB_ERR':''
    }else if(field==='tcEmail'){
      let isValid = email(event.target.value)
      this.errObj.tcEmailErr=!this.merchantObj.tcEmail || !isValid ?'LBL_TC_EMAIL_ERR':''
    }else if(field==='webUrl'){
      this.errObj.urlErr=!this.merchantObj.websiteURL?'LBL_WEB_URL_ERR':''
    }else if(field==='city'){
      this.errObj.cityErr=''
    }else if(field==='pmtType'){
      this.errObj.pmtTypeErr=''
    }else if(field==='pmtSvcPvd'){
      this.errObj.pmtSrvPvdErr=''
    }else if(field==='schema'){
      this.errObj.schemaErr=''
    }else if(field==='gateWay'){
      this.errObj.gatewaydErr=''
    }
  }
  // getGateway(){
  //   let param={
  //     "action": "GET_POS_CARD_TYPE_ACTION",
  //     "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ""
  //  };
  //  this.epayService.getCitiesOption(param).subscribe((res:any)=>{
  //    if(res && res.data && res.data[0].city.length>0){
  //      // this.isLoadingCompelete=true;
  //      this.cities=res.data[0].city;
  //      // this.showStmtDetails=true;
  //    }else{
  //    }
  //  },err=>{
  //  })
  // }
  getPaymentSchema(){
    let param={
      "action": "GET_PAYMENT_SCHEMA_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ""
   };
   this.epayService.getPaymentSchema(param).subscribe((res:any)=>{
     if(res && res.data && res.data[0].paySchema.length>0){
       // this.isLoadingCompelete=true;
       this.schemas=res.data[0].paySchema;
       // this.showStmtDetails=true;
     }else{
     }
   },err=>{
   })
  }

  getPaymentGateway(){
    let param={
      "action": "PYTGTWAY",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ""
   };
   this.epayService.getPaymentGateway(param).subscribe((res:any)=>{
     if(res && res.data && res.data[0].payGateWays.length>0){
       // this.isLoadingCompelete=true;
       this.gateways=res.data[0].payGateWays;
       // this.showStmtDetails=true;
     }else{
     }
   },err=>{
   })
  }
  getPaymentServiceProvider(){
    let param={
      "action": "GET_PAYMENT_SERVICE_PROVIDER_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ""
   };
   this.epayService.getPaymentServiceProvider(param).subscribe((res:any)=>{
     if(res && res.data && res.data[0].payService.length>0){
       // this.isLoadingCompelete=true;
       this.pmtSvcPvds=res.data[0].payService;
       // this.showStmtDetails=true;
     }else{
     }
   },err=>{
   })
  }

  getPaymentOption(){
    let param={
      "action": "GET_PAYMENT_TYPE_ACTION",
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ""
   };
   this.epayService.getPaymentOption(param).subscribe((res:any)=>{
     if(res && res.data && res.data[0].paymentType.length>0){
       // this.isLoadingCompelete=true;
       this.pmtTypes=res.data[0].paymentType;
       // this.showStmtDetails=true;
     }else{
     }
   },err=>{
   })

  }
  getCity(){
    // this.isLoadingCompelete=false;
    let param={
       "action": "GET_CITY_ACTION",
       "unitId": this.rootScopeData?.userInfo?.UNIT_ID ? this.rootScopeData?.userInfo?.UNIT_ID : ""
    };
    this.epayService.getCitiesOption(param).subscribe((res:any)=>{
      if(res && res.data && res.data[0].city.length>0){
        // this.isLoadingCompelete=true;
        this.cities=res.data[0].city;
        // this.showStmtDetails=true;
      }else{
      }
    },err=>{
    })

  }
  onClickCancel(){
    this.hideMerchant.emit(true)
  }
  fectchFee(){
    this.errObj.arbNameErr = !this.merchantObj.arabicName?'LBL_COM_REG_NAME_ERR':'';
    this.errObj.engNameErr = !this.merchantObj.engName?'LBL_COM_REG_NAME_ERR':'';
    this.errObj.phoneErr = !this.merchantObj.phone?'LBL_PHN_NO_ERR':'';
    this.errObj.addressErr = !this.merchantObj.address?'LBL_ADDRESS_ERR':'';
    this.errObj.dlgFnameErr = !this.merchantObj.dlgFirstName?'LBL_DLG_FNAME_ERR':'';

    this.errObj.dlgLnameErr = !this.merchantObj.dlgLastName?'LBL_DLG_LNAME_ERR':'';
    this.errObj.dlgmobErr = !this.merchantObj.dlgMob?'LBL_DLG_MOB_ERR':'';
    this.errObj.dlgEmailErr = !this.merchantObj.dlgEmail?'LBL_DLG_EMAIL_ERR':'';
    this.errObj.tcFnameErr = !this.merchantObj.tcFirstName?'LBL_TC_FNAME_ERR':'';
    this.errObj.tcLnameErr = !this.merchantObj.tcLastName?'LBL_TC_LNAME_ERR':'';

    this.errObj.tcmobErr = !this.merchantObj.tcMob?'LBL_TC_MOB_ERR':'';
    this.errObj.tcEmailErr = !this.merchantObj.tcEmail?'LBL_TC_EMAIL_ERR':'';
    this.errObj.urlErr = !this.merchantObj.websiteURL?'LBL_WEB_URL_ERR':'';
    this.errObj.cityErr = !this.merchantObj.city?'LBL_CITY_ERR':'';
    this.errObj.pmtTypeErr = !this.merchantObj.pmtType?'LBL_PMTTYPE_ERR':'';

    this.errObj.pmtSrvPvdErr = !this.merchantObj.pmtSrvProvider?'LBL_PMT_SVC_ERR':'';
    this.errObj.gatewaydErr = !this.merchantObj.gateWay?'LBL_GATEWAY_ERR':'';
    this.errObj.schemaErr = !this.merchantObj.schemas?'LBL_SCHMEMA_ERR':'';

if(!this.errObj.arbNameErr && !this.errObj.engNameErr && !this.errObj.phoneErr && !this.errObj.addressErr && !this.errObj.dlgFnameErr 
  && !this.errObj.dlgLnameErr && !this.errObj.dlgmobErr && !this.errObj.dlgEmailErr && !this.errObj.dlgEmailErr && !this.errObj.tcLnameErr
  && !this.errObj.tcmobErr && !this.errObj.tcEmailErr && !this.errObj.urlErr && !this.errObj.cityErr && !this.errObj.pmtTypeErr
  && !this.errObj.pmtSrvPvdErr && !this.errObj.gatewaydErr && !this.errObj.schemaErr){

    this.hideBtn=true;
    this.merchantDetailsObj.emit(this.merchantObj)
  }
  }
  charsOly(event:any){
    return (omit_special_char(event))
  }
  numberOly(event:any){
    return mobileNumberValidation(event)
  }
  arabicOly(event:any){
    var unicode = event.charCode ? event.charCode : event.keyCode
   
    if (unicode == 32){
      return true;
    }else {
    if ((unicode < 48 || unicode > 57) && (unicode < 0x0600 || unicode > 0x06FF)){ //if not a number or arabic
      return false; //disable key press
    }else{
      return true;
    } 
    }
  }
  validateEmail(event:any){
    const charCode = /[a-zA-Z0-9@.]/;
    return charCode.test(event.key)
  }

  

}
