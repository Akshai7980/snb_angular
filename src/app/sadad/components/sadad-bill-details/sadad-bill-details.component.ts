import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {RootScopeDeclare} from '../../../rootscope-declare';
import {RootScopeData} from '../../../rootscope-data';
import { SadadPaymentService } from '../../services/sadad-payment.service';
import { NumberValidation_Omit_Char, omit_special_char } from 'src/app/utility/common-utility';
@Component({
  selector: 'app-sadad-bill-details',
  templateUrl: './sadad-bill-details.component.html',
  styleUrls: ['./sadad-bill-details.component.scss']
})
export class SadadBillDetailsComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  @Input() validations :any;
  @Input() clearFlag :any;
  isLoadingCompelete=false
  billergroupsfromApi: any = [];
  billerNamefromApi: any = [];
  selectedBillerGroup:any;
  billergroupsfromApiLocal:any;
  billerGroupEmpty:boolean=false;

  selectedBillerCompany:any;
  billerNamefromApiLocal:any;
  billerCompanyEmpty:boolean=false;

  nickname = "";
  groupoption:any;
  nameoption:any;
  subscriberID:string="";
  groupName:any;
  groupCode:any;
  groupId:any;
  groupCategory:any;
  billerCode: any;
  billerId: any;
  isNameValid:boolean=false;
  isSubscriberValid:boolean = false;
  isShortNameValid:boolean = false;
  isNicknameValidCheck:boolean=true;
  isSubscriberInValid : boolean = false;
  @Output() onValidationCheck = new EventEmitter();
  @Output() submitParams = new EventEmitter();
  @Output() inqData = new EventEmitter();
  @Output() clearFormEmit = new EventEmitter();
  getBillerGroupFromName: any;


  constructor(private sadadService: SadadPaymentService) { }

  ngOnInit(): void {
    this.getBillergroup();
    //this.getBillerName
  }


  ngOnChanges()
  {
   if(this.validations == true)
   {
    this.validationCheck();
   }

   if(this.clearFlag == true)
   {
    this.clearformClick();
   }
  }

  getBillergroup() {
    this.isLoadingCompelete = false;
    this.sadadService.getSadadBillerGroupsApiCall().subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billergroupsfromApi = data.data;
        this.billergroupsfromApiLocal=data?.data;

      }, error => {
        this.isLoadingCompelete = true;
      }

    )
  }

  getBillerName(grpcode: any, grpId: any) {

    this.isLoadingCompelete = false;
    this.sadadService.getSadadBillerNamesApiCall(grpcode, grpId).subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billerNamefromApi = data.data;
        this.billerNamefromApiLocal=data?.data;

      }, error => {
        this.isLoadingCompelete = true;
      }

    )
  }

  searchBillGroup(event: any){    
    const searchValue: string = event?.target?.value;
    if(searchValue.length > 0 ){
      this.billerGroupEmpty=false
    }
    this.selectedBillerGroup = this.billergroupsfromApi;
    this.billergroupsfromApiLocal = this.selectedBillerGroup?.filter((eachBillGroup: any) =>
      (eachBillGroup?.englishName as string)?.toLowerCase().includes(searchValue?.toLowerCase()));
      // this.billergroupsfromApiLocal ? this.billerGroupEmpty=true : this.billerGroupEmpty=false
  }
  resetBillGroupInput(event: any){
    const blurredValue: string = event?.target?.value;
    const billerGroupFound = this.billergroupsfromApiLocal?.filter((eachService: any) =>
      (eachService?.englishName as string)?.toLowerCase() === blurredValue?.toLowerCase());
      (billerGroupFound?.length > 0) ? this.billerGroupEmpty=true : this.billerGroupEmpty=false;
      if (billerGroupFound?.length > 0 && blurredValue?.length > 0) {
        for(let billerGroupObj of billerGroupFound){
          if(billerGroupObj?.englishName === blurredValue){
            this.billerGroupEmpty=false;
            break
          }else{
            this.billerGroupEmpty=true;
          }
        }
      } else {
        if(billerGroupFound?.length === 0){
          this.billerGroupEmpty=true;
        }
      }
  }

  searchBillCompany(event: any){    
    const searchValue: string = event?.target?.value;
    if(searchValue.length > 0 ){
      this.billerCompanyEmpty=false
    }
    this.selectedBillerCompany = this.billerNamefromApi;
    this.billerNamefromApiLocal = this.selectedBillerCompany?.filter((eachBillGroup: any) =>
      (eachBillGroup?.billerName as string)?.toLowerCase().includes(searchValue?.toLowerCase()));
      // this.billerNamefromApiLocal ? this.billerCompanyEmpty=true : this.billerCompanyEmpty=false
  }
  resetBillCompanyInput(event: any){
    const blurredValue: string = event?.target?.value;
    const billerGroupFound = this.billerNamefromApiLocal?.filter((eachService: any) =>
      (eachService?.billerName as string)?.toLowerCase() === blurredValue?.toLowerCase());
      (billerGroupFound?.length > 0) ? this.billerCompanyEmpty=true : this.billerCompanyEmpty=false;
      if (billerGroupFound?.length > 0 && blurredValue?.length > 0) {
        for(let billerGroupObj of billerGroupFound){
          if(billerGroupObj?.billerName === blurredValue){
            this.billerCompanyEmpty=false;
            break
          }else{
            this.billerCompanyEmpty=true;
          }
        }
      } else {
        if(billerGroupFound?.length === 0){
          this.billerCompanyEmpty=true;
        }
      }
  }

  onNickNameValidation()
  {
    this.isLoadingCompelete = false;
    this.rootScopeData.nicknameValidationCheck = false;
    this.sadadService.addSadadBillerNickname(this.nickname).subscribe(
      data => {
        this.isLoadingCompelete = true;
        var vdata = data.data.RECORD_EXIST;
        if (vdata == "false") {
           this.isNicknameValidCheck = true;
           this.rootScopeData.nicknameValidationCheck = true;
        }
        else {
           this.isNicknameValidCheck = false;          
        }

      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.nicknameValidationCheck = false;
      }

    )
  }


  onSubscriberValidation()
  {
    this.isLoadingCompelete = false;
    this.rootScopeData.subscribeValidationCheck = false;
    this.sadadService.sadadBillersInquiry(this.subscriberID,this.billerId).subscribe(
      data => {
        this.isLoadingCompelete = true;
        if(data.data.accountId+'' === this.subscriberID)
        {
          this.inqData.emit(data.data)
          this.rootScopeData.subscribeValidationCheck = true;
          this.isSubscriberInValid = false
        }             
        else
        {
          this.isSubscriberInValid = true
        } 
      }, error => {
        this.isLoadingCompelete = true;
        this.rootScopeData.nicknameValidationCheck = false;
      }

    )
  }



  groupOption(value: any) {
  //  this.isGroupValid = this.groupoption ? true : false;
    this.groupName = value.englishName;
    this.groupCode = value.billerGroupCode;
    this.groupId = value.billergroupId;
    this.groupCategory = value.billerCategory;

     this.getBillerName(this.groupCode, this.groupId);
  }

  BillerNameOption(billervalue: any) {
   this.isNameValid = this.nameoption ? false : true;
    this.nameoption = billervalue.billerName;
    this.billerCode = billervalue.billerCode;
    this.billerId = billervalue.billerId;
    this.getBillerGroupFromName = billervalue.billerGroupName;
  }


  validationCheck()
  {
    this.isNameValid = this.nameoption ? false : true;
    this.isSubscriberValid = this.subscriberID ? false : true;
    this.isShortNameValid = this.nickname ? false : true;
    let params = {
      billerCompany : this.nameoption,
      subscriberId : this.subscriberID,
      billerCode : this.billerCode,
      billerGroupname : this.getBillerGroupFromName,
      billerGroupCode : this.groupCode,
      nickName : this.nickname,
      billerId : this.billerId,
      category :this.groupCategory
    }
    if(!this.isNameValid && !this.isSubscriberValid && !this.isShortNameValid)
    {
      this.onValidationCheck.emit('Y');
      this.submitParams.emit(params);
    }
   

  }

  clearformClick()
  {
    this.groupoption = '';
    this.nameoption ='';
    this.subscriberID='';
    this.nickname='';
    this.clearFlag = false;
    this.isNameValid = this.nameoption === '' ? false : true;
    this.isSubscriberValid = this.subscriberID === '' ? false : true;
    this.isShortNameValid = this.nickname === '' ? false : true;
    this.clearFormEmit.emit(false);
  }
  specialCharValidation(val: any) {
    return omit_special_char(val)
   }

   alphabetsValidation(val:any){
    return NumberValidation_Omit_Char(val)
   }
}
