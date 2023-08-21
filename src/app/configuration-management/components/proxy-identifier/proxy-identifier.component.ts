import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError, switchMap } from 'rxjs/operators';
import { PaginationComponent } from 'src/app/common-components/components/pagination/pagination.component';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { email, mobileNumberValidation, omit_special_char } from 'src/app/utility/common-utility';
import { ConfigurationManagementService } from '../../services/configuration-management.service';

@Component({
  selector: 'app-proxy-identifier',
  templateUrl: './proxy-identifier.component.html',
  styleUrls: ['./proxy-identifier.component.scss']
})
export class ProxyIdentifierComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  dataSourceLength: any
  dataSourceToPass: any
  manageDate: any
  norecordflag: boolean = false;
  noRecordFoundInfoObj: any;
  isLoadingCompelete = true;
  totalRecords: any;
  tablePageSize: any;
  fromRow: any;
  toRow: any;
  sourceData: any;
   storedData: any = [];
  @ViewChild('paginator')
  commonPagination!: PaginationComponent;
  proxyIdentifierData: any;
  cardAccNumber: any;
  accountNo: any;
  ibanAccNo: any;
  emailID:boolean = false;
  mobile:boolean = false;
  national_id:boolean = false;
  isProceed:boolean = false;
  dataSource:any
  readOly:boolean = false;
  getIpsData:any =[];
  @Output() onPayToSelect = new EventEmitter();
  @Output() showDataForProxy = new EventEmitter();
  @Input()debitAccDetails: any;
  setProxy={mobile:'',mobileFlag: false,email:'',emailFlag : false,nationalID:'',nationalIDFlag : false,reasonCode:'',reasonValue:'',reasonDescription:'',deregisterFlag:'Y'}
  viewSetProxy={mobile:'', mobileFlag: false,email:'',emailFlag : false,nationalID:'',nationalIDFlag : false,deregisterFlag:'N',reasonCode:'',reasonValue:'',reasonDescription:''}
  errObj={
    mobErr:false,
    emailErr:false,
    nationalErr:false,
    mobProxyValidation:false,
    nationalIdProxyValidation:false,
    emailProxyValidation:false
  }
  // isEmailValidation = true;
  userProfiledata ={
    "mobileNumber":'',
"email":'',
"nationalId":'',
"bankCode":''
  };
  corpData:any ;
  deregister: boolean = false;
  reasonList: any[] = [];
  selectedReason: any = '';
  otherReasonDescription: string = '';
  showNationalIdProxy: boolean = false;
  @ViewChild("toggleElementNationalID") refNationalId: ElementRef | any;
  @ViewChild("toggleElementEmail") refEmail: ElementRef | any;
  @ViewChild("toggleElementMobile") refMobile: ElementRef | any;
  checked:boolean = false;
  showMobileIdProxy: boolean = false;
  showEmailProxy: boolean = false;
  proxyMobile: any;
  proxyEmail: any;
  proxyNatId: any;
  isProceedWhenMobileChanged: string = "N";
  isProceedWhenNationalIdChanged: string = "N";
  isProceedWhenEmailChanged: string = "N";
  isCheckProceedWhenMobileChanged: string = "N";
  isCheckProceedWhenNationalIdChanged: string = "N";
  isCheckProceedWhenEmailChanged: string = "N";
  isProceedWhenChangedFlag: boolean = false;
  removeEmailWhileCropDetDisable: boolean = false;
  removeNatIdWhileCropDetDisable: boolean = false;
  removeMobileWhileCropDetDisable: boolean = false;

  constructor(private configManagement : ConfigurationManagementService,private router:Router) {
    this.rootScopeData.settingsActiveTabName = 'manageAlerts'
   }

  ngOnInit(): void {
    // console.log(this.debitAccDetails)
    this.getProxyData();
    //  this.getUserData();
    this.sourceData ={
      aliasType2 : "",
      aliasReference2 : '',
      aliasType1:''
    }
    this.noRecordFoundInfoObj = {
      "msg": "LNBL_NO_MANAGE_ALERTS",
      "btnLabel": "Apply Now",
      "btnLink": "/dashboard",
      "showBtn": "false",
      "showMsg": "true",
      "showIcon": "true"
    };
  }

  onClickCancel(){
   this.getProxyData();
  //  this.getUserData();
  }

  getUserData(){
    this.isLoadingCompelete = false;
    // this.configManagement.getUserProfileData().subscribe(
    //   (response:any)=>{ 
    //     this.isLoadingCompelete = true;
    //     if(response.data){
    //       this.userProfiledata = response.data;
    //       this.showDataBeforeToggle();
    //     }
    //   }, error => {
    //     this.isLoadingCompelete = true;
    //     // this.rootScopeData.showSystemError = true;
    //   })
    let params = {
      cifNo : this.debitAccDetails.COD_CORECIF,
    }

      this.configManagement.getCropCustomerDetails(params).subscribe(
        (response:any)=>{ 
          this.isLoadingCompelete = true;
          if(response.dataValue){
            this.corpData = response.dataValue;
            // this.showDataBeforeToggle();
            this.checkDataIsAvailavbleInProxyAndCrop();
          }
        }, error => {
          this.isLoadingCompelete = true;
          // this.rootScopeData.showSystemError = true;
        })

  }

  checkDataIsAvailavbleInProxyAndCrop(){
    if(this.userProfiledata.mobileNumber === '' && this.corpData.mobileNumber === ''){
      this.showMobileIdProxy = true;
    }
    if(this.userProfiledata.nationalId === '' && this.corpData.nationalId === ''){
      this.showNationalIdProxy = true;
    }
    if(this.userProfiledata.email === '' && this.corpData.email === ''){
      this.showEmailProxy = true;
    }
  }
  
  getProxyData() {
    this.isLoadingCompelete = false;
    this.readOly=true
    this.dataSource = this.setProxy;
    this.configManagement.getProxyIdentifierForIPSRegistration(this.debitAccDetails.OD_ACC_NO,this.debitAccDetails.OD_IBAN_ACC_NO,this.debitAccDetails.UNIT_ID).subscribe((PIdata: any) => {
      this.isLoadingCompelete = true;
      // debugger;
      this.proxyIdentifierData = PIdata;
      this.getIpsData = PIdata.data.ProxyList;
      this.getUserData();
      for(let i=0; i<this.getIpsData.length;i++){
        if(this.getIpsData[i].aliasType1 === '11'){
           this.mobile = true;
           this.isProceedWhenMobileChanged = "Y";
           this.isCheckProceedWhenMobileChanged = "Y";
           this.userProfiledata.mobileNumber = this.getIpsData[i].aliasReference1;
           this.viewSetProxy.mobileFlag = true;
          this.viewSetProxy.mobile = this.userProfiledata.mobileNumber;
          this.proxyMobile = this.userProfiledata.mobileNumber;
        }
        else if(this.getIpsData[i].aliasType1 === '12'){
          this.emailID = true;
          this.isProceedWhenEmailChanged = "Y";
          this.isCheckProceedWhenEmailChanged = "Y";
          this.userProfiledata.email = this.getIpsData[i].aliasReference1;
          this.viewSetProxy.emailFlag = true;
          this.viewSetProxy.email = this.userProfiledata.email;
          this.proxyEmail = this.userProfiledata.email;
        }
        else if(this.getIpsData[i].aliasType1 === '13'){
          this.national_id = true;
          this.isProceedWhenNationalIdChanged = "Y";
          this.isCheckProceedWhenNationalIdChanged = "Y";
          this.userProfiledata.nationalId = this.getIpsData[i].aliasReference1;
          this.viewSetProxy.nationalIDFlag = true;
          this.viewSetProxy.nationalID = this.userProfiledata.nationalId;
          this.proxyNatId = this.userProfiledata.nationalId;
        }
        else{

        }
      }
      

      // this.dataSourceLength = PIdata.data.length;
      // this.dataSourceToPass = new MatTableDataSource(PIdata.data)
      // if (this.proxyIdentifierData === null || this.proxyIdentifierData === '' || this.proxyIdentifierData === undefined) {
      //   this.norecordflag = !this.norecordflag;
      // }

    },
      error => {
        this.isLoadingCompelete = true;
      });
  }
  
  proceedToNext(){
    this.viewSetProxy.deregisterFlag = "N";
     const data = this.setProxy;
    if(this.mobile){
      this.errObj.mobErr=this.userProfiledata.mobileNumber!=''?false:true
    }if(this.emailID){
      this.errObj.emailErr=this.userProfiledata.email!=''?false:true
      this.errObj.emailErr = (!email(this.userProfiledata.email));
    }    
    if(this.national_id){
      this.errObj.nationalErr=this.userProfiledata.nationalId!=''?false:true
    }
    
    if(!this.errObj.mobErr && !this.errObj.emailErr && !this.errObj.nationalErr 
      && !this.errObj.emailProxyValidation && !this.errObj.nationalIdProxyValidation && !this.errObj.mobProxyValidation){
      this.isProceed=true;
      this.onPayToSelect.emit(this.viewSetProxy);
      this.showDataForProxy.emit(this.viewSetProxy);
    }
  }

  selectNumberType(event: any, datasource: any, column: any) {
    if (event.checked) {
      this.isCheckProceedWhenMobileChanged = "Y";
      this.isProceedWhenChanged();
      this.mobile = true;
      this.deregister = false;
      if(this.viewSetProxy.mobile){
        this.userProfiledata.mobileNumber = this.viewSetProxy.mobile;
        this.viewSetProxy.mobileFlag = true;
      }
      if(!this.proxyMobile){
        this.userProfiledata.mobileNumber = this.corpData.mobileNumber; 
        if(!this.userProfiledata.mobileNumber){
          this.mobile = false;
          this.removeMobileWhileCropDetDisable = false;
          this.refMobile.checked = false;
          this.showMobileIdProxy = true;
          this.beforeCheckDeregistrationProxyCondition();
          this.isCheckProceedWhenMobileChanged = "N";
          this.isProceedWhenChanged();
          return;
        }else{
          this.showMobileIdProxy = false;
          this.removeMobileWhileCropDetDisable = true;
        }   
        this.viewSetProxy.mobileFlag = true;
       this.viewSetProxy.mobile = this.userProfiledata.mobileNumber;

        // As PER POWWN DISCUSSION

      // let data = {
      //   proxyValue : this.corpData.bankCode+''+this.userProfiledata.mobileNumber,
      //   proxyType : "11"
      // }
      // this.configManagement.checkIPSRegIBANProxy(data).subscribe((res:any)=>{
      //   if(res && res.data && res.data.res_ErrorMessage === 'Sucess'){
      //     this.mobile = true;
      //     this.errObj.mobProxyValidation = true;
      //   }else{
      //     this.errObj.mobProxyValidation = false;
      //     this.mobile = true;
      //   }
      // })
    }
    }else {
     this.mobile = false;
     this.isCheckProceedWhenMobileChanged = "N";
     this.isProceedWhenChanged();
     this.userProfiledata.mobileNumber = '';
     this.beforeCheckDeregistrationProxyCondition();
    //  if(this.proxyMobile && !this.mobile && !this.emailID && !this.national_id){
    //    this.checkDeregisterationValue()
    //  }
      // this.errObj.mobErr=false;
      // if(this.errObj.mobProxyValidation === true){
      //   this.setProxy.mobile = "";
      //   this.viewSetProxy.mobile = ""
      //   this.userProfiledata.mobileNumber = "";
      // }
      if(this.removeMobileWhileCropDetDisable === true){
        this.setProxy.mobile = "";
        this.viewSetProxy.mobile = ""
        this.userProfiledata.mobileNumber = "";
      }
      this.errObj.mobProxyValidation = false;
      this.viewSetProxy.mobileFlag = false;
      // this.viewSetProxy.mobile = "";
    }
    // this.setProxy.mobile = datasource;
  }

  selectNationalIDType(event: any, datasource: any, column: any) {
    if (event.checked) {
      this.isCheckProceedWhenNationalIdChanged = "Y";
      this.isProceedWhenChanged();
      this.national_id = true;
      this.deregister = false;
      if(this.viewSetProxy.nationalID){
        this.userProfiledata.nationalId = this.viewSetProxy.nationalID;
        this.viewSetProxy.nationalIDFlag = true;
      }
      if(!this.proxyNatId){
      
      this.userProfiledata.nationalId = this.corpData.nationalId;
      if(!this.userProfiledata.nationalId){
        this.national_id = false;
        this.removeNatIdWhileCropDetDisable = false;
        this.refNationalId.checked = false;
        this.showNationalIdProxy = true;
        this.beforeCheckDeregistrationProxyCondition();
        this.isCheckProceedWhenNationalIdChanged = "N";
        this.isProceedWhenChanged();
        return;
      }else{
        this.showNationalIdProxy = false;
        this.removeNatIdWhileCropDetDisable = true;
      }
      
      this.viewSetProxy.nationalIDFlag = true;
      this.viewSetProxy.nationalID = this.userProfiledata.nationalId;

      // As PER POWWN DISCUSSION


      // let data = {
      //   proxyValue : this.corpData.bankCode+''+this.userProfiledata.nationalId,
      //   proxyType : "13"
      // }
      // this.configManagement.checkIPSRegIBANProxy(data).subscribe((res:any)=>{
      //   if(res && res.data && res.data.res_ErrorMessage === 'Sucess'){
      //     this.national_id = true;
      //     this.errObj.nationalIdProxyValidation = true;
      //   }else{
      //     this.errObj.nationalIdProxyValidation = false;
      //     this.national_id = true;
      //   }
      // })
    }
    }else {
       this.national_id = false;
       this.isCheckProceedWhenNationalIdChanged = "N";
       this.isProceedWhenChanged();
       this.userProfiledata.nationalId = '';
      //  this.checkDeregisterationValue();
      //if(this.proxyNatId){
        this.beforeCheckDeregistrationProxyCondition();
      //}
      // this.errObj.nationalErr=false
      // if(this.errObj.nationalIdProxyValidation === true){
      //   this.setProxy.nationalID = "";
      //   this.viewSetProxy.nationalID = "";
      //   this.userProfiledata.nationalId = "";
      // }
      if(this.removeNatIdWhileCropDetDisable === true){
        this.setProxy.nationalID = "";
        this.viewSetProxy.nationalID = "";
        this.userProfiledata.nationalId = "";
      }
      this.viewSetProxy.nationalIDFlag = false;
      // this.viewSetProxy.nationalID = "";
      this.errObj.nationalIdProxyValidation = false;
    }

  }

  selectType(event: any, datasource: any, column: any) {
    if (event.checked) {
      this.emailID = true;
      this.isCheckProceedWhenEmailChanged = "Y";
      this.isProceedWhenChanged();
      this.deregister = false;
      if(this.viewSetProxy.email){
        this.userProfiledata.email = this.viewSetProxy.email;
        this.viewSetProxy.emailFlag = true;
      }
      if(!this.proxyEmail){      
      this.userProfiledata.email = this.corpData.email;

      if(!this.userProfiledata.email){
        this.emailID = false;
        this.removeEmailWhileCropDetDisable = false;
        this.refEmail.checked = false;
        this.showEmailProxy = true;
        this.beforeCheckDeregistrationProxyCondition();
        this.isCheckProceedWhenEmailChanged = "N";
        this.isProceedWhenChanged();
        return;
      }else{
        this.emailID = true;
        this.removeEmailWhileCropDetDisable = true;
        this.showEmailProxy = false;
      }   
      
      this.viewSetProxy.emailFlag = true;
      this.viewSetProxy.email = this.userProfiledata.email

      // As PER POWWN DISCUSSION

      // let data = {
      //   proxyValue : this.corpData.bankCode+''+this.userProfiledata.email,
      //   proxyType : "12"
      // }
      // this.configManagement.checkIPSRegIBANProxy(data).subscribe((res:any)=>{
      //   if(res && res.data && res.data.res_ErrorMessage === 'Sucess'){
      //     this.emailID = true;
      //     this.errObj.emailProxyValidation = true;
      //   }else{
      //     this.errObj.emailProxyValidation = false;
      //     this.emailID = true;
      //   }
      // })
    }
    }else {
      this.emailID = false;
      this.isCheckProceedWhenEmailChanged = "N";
      this.isProceedWhenChanged();
      this.userProfiledata.email = '';
      // this.checkDeregisterationValue();
      
      this.beforeCheckDeregistrationProxyCondition();
      // this.errObj.emailErr=false;
      // if(this.errObj.emailProxyValidation === true){
      //   this.setProxy.email = "";
      //   this.viewSetProxy.email = "";
      //   this.userProfiledata.email = "";
      // }
      if(this.removeEmailWhileCropDetDisable === true){
        this.setProxy.email = "";
        this.viewSetProxy.email = "";
        this.userProfiledata.email = "";
      }
      this.viewSetProxy.emailFlag = false;
      // this.viewSetProxy.email = "";
      this.errObj.emailProxyValidation = false;
    }
  
  }

  ChangeMobileNumber()
  {    
    this.setProxy.mobile = this.userProfiledata.mobileNumber; 
    this.viewSetProxy.mobile = this.userProfiledata.mobileNumber;
    if(this.mobile){
      this.errObj.mobErr=  this.setProxy.mobile!=''?false:true
    }
  }

  ChangeEmailId()
  {
    this.setProxy.email = this.userProfiledata.email;
    this.viewSetProxy.email = this.userProfiledata.email;
    
   if(this.emailID){
       this.errObj.emailErr = (!email(this.userProfiledata.email));    
    }

    // if(this.emailID){
    //   this.errObj.emailErr=  this.setProxy.email!=''?false:true
    // }
    
    
  }

  ChangeNationalId()
  {
    this.setProxy.nationalID = this.userProfiledata.nationalId;
    this.viewSetProxy.nationalID = this.userProfiledata.nationalId;
    if(this.national_id){
      this.errObj.nationalErr=  this.setProxy.nationalID!=''?false:true
    }
  }
  numberOnly(event: any): boolean {
  return mobileNumberValidation(event)
  }
  
  nationalIdValidation(val: any) {
   return omit_special_char(val)
  }

  showDataBeforeToggle(){
    //Mobile
    this.mobile = false;
    this.sourceData.aliasType2 = "";
    // this.sourceData.aliasType2 = this.userProfiledata.MOBILE_NO;
    // if(this.storedData.aliasType2 !== '' && this.storedData.aliasType2 !== null && this.storedData.aliasType2 !== undefined){
    //   this.sourceData.aliasType2 = this.storedData.aliasType2;
    // }

    //National-Id
    this.national_id = false;
    this.sourceData.aliasType1 = "";
    // this.sourceData.aliasType1 = this.userProfiledata.NATIONAL_ID;
    // if(this.storedData.aliasType1 !== '' && this.storedData.aliasType1 !== null && this.storedData.aliasType1 !== undefined){
    // this.sourceData.aliasType1 = this.storedData.aliasType1;
    // }

    //Email
    this.emailID = false;
     this.sourceData.aliasReference2 = "";
    // this.sourceData.aliasReference2 = this.userProfiledata.EMAIL_ID;
    // if(this.storedData.aliasType1 !== '' && this.storedData.aliasType1 !== null && this.storedData.aliasType1 !== undefined){
    //   this.sourceData.aliasReference2 = this.storedData.aliasReference2;
    // }

    this.viewSetProxy.email = this.sourceData.aliasReference2;
    this.viewSetProxy.mobile = this.sourceData.aliasType2;
    this.viewSetProxy.nationalID = this.sourceData.aliasType1;
    this.viewSetProxy.mobileFlag = false;
    this.viewSetProxy.emailFlag = false;
    this.viewSetProxy.nationalIDFlag = false;

  }


  beforeCheckDeregistrationProxyCondition(){
    if(this.proxyEmail && !this.mobile && !this.emailID && !this.national_id){
      this.checkDeregisterationValue();
    }else if(this.proxyMobile && !this.mobile && !this.emailID && !this.national_id){
      this.checkDeregisterationValue();
    }else if(this.proxyNatId && !this.mobile && !this.emailID && !this.national_id){
      this.checkDeregisterationValue();
    }
  }


  checkDeregisterationValue(){
    if(!this.mobile && !this.emailID && !this.national_id){
      this.isProceedWhenChangedFlag = false;
       this.deregister = true
       this.getReasonsList();
    }
    else{
      this.deregister = false;
    }
  }

  reasonSelected(reason: any) {
    this.viewSetProxy.reasonCode = reason.reasonCode;
    this.viewSetProxy.reasonValue = reason.reasonValue;
    this.setProxy.reasonCode = reason.reasonCode;
    this.setProxy.reasonValue = reason.reasonValue;
    this.selectedReason = reason.reasonValue;
  }

  getReasonsList() {
    this.configManagement.getReasonLookup().subscribe(
      (reasons: any) => {
        if (reasons && reasons.data) {
          this.reasonList = reasons.data;
        }
      },
      () => {
      }
    );
  }

  proceedToNextderegister(){
    this.viewSetProxy.deregisterFlag = "Y";
    const data = this.setProxy;
    if(data.reasonCode == "4") {
      this.setProxy.reasonDescription = this.otherReasonDescription;
      this.viewSetProxy.reasonDescription = this.otherReasonDescription;
    }
    if(!this.errObj.mobErr && !this.errObj.emailErr && !this.errObj.nationalErr 
      && !this.errObj.emailProxyValidation && !this.errObj.nationalIdProxyValidation && !this.errObj.mobProxyValidation){
      this.isProceed=true;
      this.onPayToSelect.emit(this.viewSetProxy);
      this.showDataForProxy.emit(this.viewSetProxy);
    }   
  }

  isProceedWhenChanged(){
    if(this.isProceedWhenMobileChanged !== this.isCheckProceedWhenMobileChanged){
      this.isProceedWhenChangedFlag = true;
    }else if(this.isProceedWhenEmailChanged !== this.isCheckProceedWhenEmailChanged){
      this.isProceedWhenChangedFlag = true;
    }else if(this.isProceedWhenNationalIdChanged !== this.isCheckProceedWhenNationalIdChanged){
      this.isProceedWhenChangedFlag = true;
    }else {
      this.isProceedWhenChangedFlag = false;
    }
  }

}
