import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { ConfigurationManagementService } from '../../services/configuration-management.service';

@Component({
  selector: 'app-deregistration-proxy-identifier',
  templateUrl: './deregistration-proxy-identifier.component.html',
  styleUrls: ['./deregistration-proxy-identifier.component.scss'],
})
export class DeregistrationProxyIdentifierComponent implements OnInit {
  isProceed: boolean = false;
  isLoadingComplete: boolean = true;
  setProxy = { mobile: '', email: '', nationalId: '', reasonCode: '', reasonValue: '', reasonDescription: '' };
  sourceData: any;
  dataSource: any;
  mobile: boolean = true;
  nationalId: boolean = true;
  emailId: boolean = true;
  deregister: boolean = false;
  // nationalIdDisable: boolean = false;
  rootScopeData: RootScopeDeclare = RootScopeData;
  reasonList: any[] = [];
  selectedReason: any = '';
  otherReasonDescription: string = '';

  @Output() onPayToSelect = new EventEmitter();
  @Output() cancelProxy = new EventEmitter();
  constructor(
    private readonly configManagement: ConfigurationManagementService
  ) {}

  ngOnInit(): void {
    this.setProxyValues();
  }

  setProxyValues(): void {
    const account = this.rootScopeData.selectedProxy;
    //debugger;
    if (account.PROXY_1) {
      if(account.PROXY_1_VALUE){
        this.mobile = true;
        this.setProxy.mobile = account.PROXY_1_VALUE;
      }     
      else{
        this.mobile = false;
      } 
    }
    else{
      this.mobile = false;
    } 
    if (account.PROXY_2) {
      if(account.PROXY_2_VALUE){
        this.emailId = true;
        this.setProxy.email = account.PROXY_2_VALUE;
      }    
      else{
        this.emailId = false;
      }  
    }
    else{
      this.emailId = false;
    } 
    
      if (account.PROXY_3 ) {
        if(account.PROXY_3_VALUE){
          this.nationalId = true;
          this.setProxy.nationalId = account.PROXY_3_VALUE;
        }
        else{
          this.nationalId = false;
        }        
      }
      else{
        this.nationalId = false;
      }   
    
  }

  getReasonsList() {
    this.configManagement.getReasonLookup().subscribe(
      (reasons: any) => {
        if (reasons && reasons.data) {
          this.reasonList = reasons.data;
        }
      },
      () => {
        this.isLoadingComplete = true;
      }
    );
  }

  reasonSelected(reason: any) {
    this.setProxy.reasonCode = reason.reasonCode;
    this.setProxy.reasonValue = reason.reasonValue;
    this.selectedReason = reason.reasonValue;
  }

  selectNumberType(event: any, dataSource: any) {
    if (event.checked && !this.deregister) {
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.setProxy.mobile = dataSource;
  }

  selectNationalIDType(event: any, dataSource: any) {
    if (event.checked && !this.deregister) {
      this.nationalId = true;
    } else {
      this.nationalId = false;
    }
    this.setProxy.nationalId = dataSource;
  }

  selectType(event: any, dataSource: any) {
    if (event.checked && !this.deregister) {
      this.emailId = true;
    } else {
      this.emailId = false;
    }
    this.setProxy.email = dataSource;
  }

  selectDeregister(event: any, dataSource: any) {
    // debugger;
    if (!event.checked) {
      //debugger;
      // this.mobile = true;
      // this.nationalId = true;
      // this.emailId = true;
      this.setProxyValues()
      this.deregister = false
      this.selectedReason = '';
      this.setProxy.reasonCode = '';
      this.setProxy.reasonValue = '';
      this.setProxy.reasonDescription = '';
      // this.nationalIdDisable = this.rootScopeData.selectedProxy.DISABLENATIONALIDFLAG ==='Y' ? true : false
    } else {
      this.getReasonsList();
      // this.mobile = false;
      // this.nationalId = false;
      // this.emailId = false;
      // if(!this.mobile){
      //   this.setProxy.mobile = '';
      // }
      // if(!this.nationalId){
      //   this.setProxy.nationalId = '';
      // }
      // if(!this.emailId){
      //   this.setProxy.email = '';
      // }
      this.deregister = true;
      // this.nationalIdDisable = true
    }
    // this.nationalIdDisable = this.rootScopeData.selectedProxy.DISABLENATIONALIDFLAG ==='Y' ? true : false
  }

  proceedToNext() {
    const data = this.setProxy;
    if(data.reasonCode == "4") {
      this.setProxy.reasonDescription = this.otherReasonDescription;
    }
    if (data.mobile || data.email || data.nationalId) {
      this.isProceed = true;
      this.onPayToSelect.emit({
        mobile: this.mobile,
        email: this.emailId,
        nationalId: this.nationalId,
        deregister: this.deregister,
        proxy: this.setProxy,
      });
    }
  }

  cancel(): void {
    this.cancelProxy.emit('iconClick');
  }
}
