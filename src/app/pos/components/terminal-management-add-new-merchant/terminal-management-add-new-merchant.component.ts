import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';


@Component({
  selector: 'app-terminal-management-add-new-merchant',
  templateUrl: './terminal-management-add-new-merchant.component.html',
  styleUrls: ['./terminal-management-add-new-merchant.component.scss'],
})
export class TerminalManagementAddNewMerchantComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  showTerminalAdd: boolean = false;
  shopName = [
    { value: 'Abha' },
    { value: 'Ad-Dilam' },
    { value: 'Al-Abwa' },
    { value: 'Al Artaweeiyah' },
    { value: 'Badr' },
  ];
  commercialNameInArabic: any ;
  terminalAddArabic: any;
  shopNameArabic: any;
  commercialNameInEng: any;
  termianlAdd: any;
  shopNameEng: any;
  phone: any;
  companyEmail: any;
  personFirststname: any;
  personLastName: any;
  mobilNo1: any;
  mobileNo2: any;
  comments: any;
  addMerchants: any;
  terminalCity: any;
  showAddBtn :boolean = false;
  @Output() addMerchnat = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void { }
  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }

  addSelectedValue() {

    this.addMerchants = [
      {
        commercialNameInArabic: this.commercialNameInArabic,
        terminalAddArabic: this.terminalAddArabic,
        shopNameArabic: this.shopNameArabic,
        commercialNameInEng: this.commercialNameInEng,
        termianlAdd: this.termianlAdd,
        shopNameEng: this.shopNameEng,
        phone: this.phone,
        companyEmail: this.companyEmail,
        personFirststname: this.personFirststname,
        personLastName: this.personLastName,
        mobilNo1: this.mobilNo1,
        mobileNo2: this.mobileNo2,
        comments: this.comments,
        addMerchants: this.addMerchants,
        cityName: this.terminalCity.value
      }
    ]
    this.addMerchnat.emit(this.addMerchants);
  }
  add() {
      this.showTerminalAdd = true;
      this.rootScopeData.showAddNewMerchantContainer = false;
      this.rootScopeData.showMerchantSelect = false;
      this.rootScopeData.showAddNewTerminal = true;
      this.rootScopeData.showViewMerchant = true;
      this.rootScopeData.showNewTerminal = true;
      this.addSelectedValue();

  }
  backToMerchant() {
    this.rootScopeData.showTerminalSelect = true;
    this.rootScopeData.showAddNewMerchantContainer = false;
    this.rootScopeData.showMerchantSelect = true;
  }

 


}
