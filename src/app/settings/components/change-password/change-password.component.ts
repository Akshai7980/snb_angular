import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/common-components/services/common.service';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { deleteDOMandShowReloginOPtion } from 'src/app/utility/common-utility';
import { SettingsService } from '../../services/settings.service';
import { systemproperty } from 'src/assets/systemProperties/systemproperties';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePassConfirmPopupComponent } from '../change-pass-confirm-popup/change-pass-confirm-popup.component';
import { TranslateService } from '@ngx-translate/core';

declare function encrypt(plaintext: any, password: any, nBits: any): any;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  passwordStrengthbar = false;
  currentPassword:any;
  newPassword:any;
  reEnteredPassword:any;
  passwordMismatchError:boolean = false;
  passwordStrength = 'Weak';
  passwordMatch: boolean = false;
  currentPassWordValid: boolean = true;
  newPassWordValid: boolean = true;
  reenterPassWordValid: boolean = true;
  lowerCase: boolean = false;
  upperCase: boolean = false;
  number: boolean = false;
  specialCharacter: boolean = false;
  minimumCharacter: boolean = false;
  strongPassword: boolean = false;
  passwordCriteriaValid: boolean = false;
  secAuthRef: any;
  userOtpValue: any;
  isOtpValid:any;
  inValidValid:boolean=false;
  step1:boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  isLoadingCompelete = true;
  errInChnanging=false;
  err:any;
  initReqParam={
    accNo:"",
    amt:"0",
    pdroductCode:"PAYMNT",
    subPrdCode:"CHGPWD",
    cif:"",
    unitId:"IGTBSA"
  }
  callBack:boolean = false;
  pageCall:any;
  changePassword = "changePassword";
  constructor(private settingService:SettingsService,private commonService:CommonService,private router:Router,public dialog: MatDialog,private transService : TranslateService) {
    this.rootScopeData.settingsActiveTabName = 'changePassword'
    this.pageCall = 'changePassword'
  }

  ngOnInit(): void {
    
  }

  onClickSubmit(){
    this.currentPassWordValid = this.currentPassword ? true:false;
    this.newPassWordValid = this.newPassword ? true:false;
    this.reenterPassWordValid = this.reEnteredPassword ? true:false;    
    if(this.currentPassWordValid && this.newPassWordValid && this.reenterPassWordValid && this.strongPassword && this.passwordMatch){
     let encrypt_currentPassword = encrypt(this.currentPassword,systemproperty.encryption_password ,systemproperty.encryption_nBits)
     let encrypt_newPassword = encrypt(this.newPassword,systemproperty.encryption_password ,systemproperty.encryption_nBits)
     let encrypt_reEnterPassword = encrypt(this.reEnteredPassword,systemproperty.encryption_password ,systemproperty.encryption_nBits)
     this.isLoadingCompelete = false; 
     this.settingService.changePasswordApiCall(encrypt_currentPassword,encrypt_newPassword,encrypt_reEnterPassword,this.userOtpValue,this.secAuthRef).subscribe((res: any) => {
        this.isLoadingCompelete = true;
        if(res.dataValue.status === "S"){
         this.step1 = false;
         this.step2 = false;
         this.callBack = false;
         //this.step3 = true;

        //  deleteDOMandShowReloginOPtion();
        //  window.location.href="../iportal/jsps/orbilogin.jsp";

        let dialogRef = this.dialog.open(ChangePassConfirmPopupComponent,{
          width:'400px',
          disableClose: true
        });   
        const sub = dialogRef.componentInstance.onClose.subscribe(() => {
          this.dialog.closeAll();
         }); 
        }
        else if(res.dataValue.status === "ER"){
          this.step1 = false;
          this.step2 = true;
          this.errInChnanging=true;
          this.passwordMatch=false
          this.err=res.dataValue.description;
        }
     },error => {
      this.step1 = false;
      this.step2 = true;
      this.isLoadingCompelete = true;
    }
     );
    }
    
  }
  onClickCancel(){
  this.currentPassword = "";
  this.newPassword = "";
  this.reEnteredPassword = "";
  this.passwordStrengthbar = false;
  this.currentPassWordValid = true;
  this.newPassWordValid = true;
  this.reenterPassWordValid = true;
  this.passwordCriteriaValid = false;
  this.passwordMismatchError = false;
  this.passwordMatch = false;
  this.lowerCase = false;
  this.upperCase = false;
  this.number = false;
  this.specialCharacter = false;
  this.minimumCharacter = false;
  this.router.navigate(['/settings/preferences'])
  }
  confirmPassWordCheck(){
    this.passwordMismatchError = true;
    this.reenterPassWordValid = true;
    this.errInChnanging=false
    this.passwordMatch = false;
    if(this.newPassword === this.reEnteredPassword){
      this.passwordMismatchError = false;
      this.passwordMatch = true;
    }
    if(!this.reEnteredPassword){
      this.passwordMismatchError = false;
      this.passwordMatch = false;
    }
  }
  onBlurCurrentPassword(){
    this.currentPassWordValid = this.currentPassword ? true:false;
    this.errInChnanging=false
  }
  onBlurNewPassword(){
    this.newPassWordValid = this.newPassword ? true:false;
    this.errInChnanging=false
  }
  onBlurReenterPassword(){
    this.reenterPassWordValid = this.reEnteredPassword ? true:false;
    this.errInChnanging=false
  }

  newpassword(){
    //password criteria code start
    this.passwordStrengthbar = true;
    if(this.newPassword.match("(?=.*?[a-z])")){
      this.lowerCase = true;
    }else{
      this.lowerCase = false;
    }
    if(this.newPassword.match("(?=.*?[A-Z])")){
      this.upperCase = true;
    }else{
      this.upperCase = false;
    }
    if(this.newPassword.match("(?=.*?[0-9])")){
      this.number = true;
    }else{
      this.number = false;
    }
    if(this.newPassword.match("(?=.*?[#?!@$%^&*-])")){
      this.specialCharacter = true;
    }else{
      this.specialCharacter = false;
    }
    if(this.newPassword.match(".{8,}")){
      this.minimumCharacter = true;
    }else{
      this.minimumCharacter = false;
    }
    //password criteria code end
    if(this.lowerCase && this.upperCase && this.number && this.specialCharacter && this.minimumCharacter){
      this.strongPassword = true;
      this.passwordCriteriaValid = false;
    }
    if(!this.strongPassword){
      this.passwordCriteriaValid = true;
      this.newPassWordValid = true;
    }
    //progress bar code start
    if(this.newPassword.length > 12 && this.strongPassword){
      this.passwordStrength = 'Strong'
    }else if ((this.newPassword.length >= 8 && this.newPassword.length <= 12) && this.strongPassword) {
       this.passwordStrength = 'Good'
    }else if(this.newPassword.length < 8 || !this.strongPassword) {
      this.passwordStrength = 'Weak'
    }
    //progress bar code end
    if(this.newPassword.length === 0){
      this.passwordStrengthbar = false;
      this.passwordCriteriaValid = false;
    }
  }

  onSecondFactorValue(authValue: any) {
    let vAuthvalue = authValue;
    this.secAuthRef = authValue.data.secfRefNo;
  }

  getOtpValue(otpValue: any) {
    this.userOtpValue = otpValue;  
    this.isLoadingCompelete = false;
    if(!this.userOtpValue || this.userOtpValue.length !== 4){
      this.isLoadingCompelete = true;
      this.isOtpValid = "LBL_PLS_ENTER_OTP";
      return;
    }else{
      this.isOtpValid = false;
      this.commonService.logOutSecFacAuthCheck(this.userOtpValue,this.secAuthRef).subscribe((response:any)=>{   
        let resp: any = response;
         this.isLoadingCompelete = true;
            if(resp.data.status === "S"){
              this.step1 = false;
              this.callBack = true;
              this.step2 = false;
              this.step3 = false;
              this.inValidValid=false;
            }
            else if(resp.data.status === "F")
            {
             this.userOtpValue = "";
             this.secAuthRef = "";
             this.inValidValid = true
            //  this.isOtpValid = true;
             return
            }
          },error => {
            this.isLoadingCompelete = true;
          }
      )
    }
  }

  logOut(){
    this.isLoadingCompelete = false;
    this.commonService.logOutApiCall().subscribe((response:any)=>{   
      let resp: any = response;
       this.isLoadingCompelete = true;
          if(resp.logout === "success"){
            deleteDOMandShowReloginOPtion(this.transService);
            window.location.href="../iportal/jsps/orbilogin.jsp";
          }
    }, error => {
            this.isLoadingCompelete = true;
            deleteDOMandShowReloginOPtion(this.transService);
            window.location.href="../iportal/jsps/orbilogin.jsp";
    }
    )
  }
  cancel(){
    this.userOtpValue=''
    this.router.navigateByUrl('dashboard')
  }

  callBackSuccess(){
     this.callBack = false;
     this.step2 = true;
  }

  getCanelBtnClick(){
    this.callBack = false;
    this.step1 = true;
    this.router.navigate(['/settings/changePassword']);
  }
}


