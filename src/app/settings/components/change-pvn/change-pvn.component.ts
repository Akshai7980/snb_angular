import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { SettingsService } from '../../services/settings.service';

declare function encrypt(plaintext: any, password: any, nBits: any): any;
@Component({
  selector: 'app-change-pvn',
  templateUrl: './change-pvn.component.html',
  styleUrls: ['./change-pvn.component.scss']
})
export class ChangePvnComponent implements OnInit {
  showReceipt : boolean = false;
  isLoadingCompelete = true;
  oldPVN : any;
  newPVN : any;
  confPVN : any;
  tokenCode : any;
  rootScopeData: RootScopeDeclare = RootScopeData;
  oldPvnErr : boolean = false;
  newPvnErr : boolean = false;
  samePvnErr : boolean = false;
  pvnMissMatchErr : boolean = false;
  pvnMatch : boolean = false;
  tokenCodeErr : boolean = false;
  confPvnErr : boolean = false;
  receiptData : any;
  failureMsg: boolean= false;
  statuserror: any;
  constructor(private settingService: SettingsService) { }

  ngOnInit(): void {
  }
  validate(event:any,field:any){
    if(field==='oldPvn'){
      this.oldPvnErr=!(event.target.value) || event.target.value.length!== 4 ?true:false;
    }else if(field==='token'){
      this.tokenCodeErr=!(event.target.value) || event.target.value.length!== 8 ?true:false;
    }else if(field==='newPvn'){
      this.newPvnErr=!(event.target.value) || event.target.value.length!== 4 ?true:false;
      if(this.oldPVN && this.oldPVN === this.newPVN){
        this.newPvnErr=false;
      }
      this.samePvnErr=this.newPVN && this.oldPVN && this.oldPVN === this.newPVN ? true:false;
    }else if(field==='cPvn'){
      this.confPvnErr = !(event.target.value) ? true:false
    }
  }
  numbrers(event:any){
   return NumberValidation_Omit_Char(event)
  }
  onProceed(){
    this.oldPvnErr=!this.oldPVN || this.oldPVN.length !==4 ?true:false;
    this.newPvnErr=!this.newPVN || this.newPVN.length !==4?true:false;
    this.confPvnErr=!this.confPVN || this.confPVN.length !==4 ?true:false;
    this.tokenCodeErr=!this.tokenCode|| this.tokenCode.length !==8?true:false;
      
    if(!this.oldPvnErr && !this.newPvnErr&&!this.tokenCodeErr && !this.samePvnErr && !this.pvnMissMatchErr){
    let encrypt_oldPVN = encrypt(this.oldPVN,systemproperty.encryption_password ,systemproperty.encryption_nBits)
      let encrypt_confPVN = encrypt(this.confPVN,systemproperty.encryption_password ,systemproperty.encryption_nBits)
      let encrypt_newPVN = encrypt(this.newPVN,systemproperty.encryption_password ,systemproperty.encryption_nBits)
      let encrypt_tokenCode = encrypt(this.confPVN,systemproperty.encryption_password ,systemproperty.encryption_nBits)
      this.isLoadingCompelete = false;
      let reqObj = {
       "oldPvn1": encrypt_oldPVN,
       "tokenCodePvn": encrypt_confPVN,
       "nPv": encrypt_newPVN,
       "conPvn": encrypt_tokenCode
      
      }
      this.settingService.changePVNSubmit(reqObj).subscribe((res: any) => {
      this.isLoadingCompelete = true;
      if(res && res.dataValue && res.dataValue.status === "S"){
      this.isLoadingCompelete=true;
      this.constructReceiptData();
      this.showReceipt = true;
      this.failureMsg = false;
      }else if(res.dataValue.status === "F"){
      this.isLoadingCompelete = true;
      this.statuserror = res.dataValue.description
      this.failureMsg = true;
      }
      })
      
      }
    
    
  }
  confirmPVNCheck(){
    this.confPvnErr=false
    this.pvnMissMatchErr =true;
    this.pvnMatch = false;
    if(this.newPVN === this.confPVN){
      this.pvnMissMatchErr = false;
      this.pvnMatch = true;
      this.confPvnErr=false;
    }
    if(!this.confPVN){
      this.confPvnErr = true;
      this.pvnMissMatchErr = false;
      this.pvnMatch = false;
    }
  }
  constructReceiptData(){
    let userId = this.rootScopeData.userInfo.loginID ? this.rootScopeData.userInfo.loginID : '';
    this.receiptData = {
      "msg1": "LBL_CONFIRMATION",
      "msg2": "LBL_PVN_SUBMIT_MSG",
      "receiptDetails": [
        {
          "title": "LBL_REQUEST_DETAILS",
          "isTable": "false",
          "data": '',
          "fieldDetails": [
            {
              "dispKey": "LBL_ACTION_BY",
              "dataKey": userId
            },            
          ]
        }
                
      ],
      
      "LoginButton": {
        "buttonLabel": "LBL_LOGIN"
      },
      
    };
  }
}
