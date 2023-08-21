import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-advanced-filter-beneficiary',
  templateUrl: './advanced-filter-beneficiary.component.html',
  styleUrls: ['./advanced-filter-beneficiary.component.scss']
})
export class AdvancedFilterBeneficiaryComponent implements OnInit {
  status='Active';
  searchwithin="Transfer Within Bank";
  nickName:any;
  bankName:any;
  clearFlag:boolean = false;
  leftToggle=true;
  rightToggle=false;
  @Input() showAdvancedSearchPopup:any;
  @Output() advancedSearchParams =new EventEmitter();
  showDateErrorMessage: boolean = false;
  @Input() selectedBene: any;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.selectedBene){
      if(this.selectedBene === "Transfer Within Bank"){
        this.searchwithin="Transfer Within Bank";
      }else if(this.selectedBene === "Domestic Fund Transfer"){
        this.searchwithin="Domestic Fund Transfer";
      }else if(this.selectedBene === "International Fund Transfer"){
        this.searchwithin="International Fund Transfer";
      }
    }
  }


  leftToggleCntl(){
    if(this.leftToggle=true){
      document.getElementById('leftToggle')?.classList.add('active');
      document.getElementById('rightToggle')?.classList.remove('active');
      this.rightToggle = false;
    }
  }
  rightToggleCntl(){
    if(this.rightToggle=true){
      document.getElementById('rightToggle')?.classList.add('active');
      document.getElementById('leftToggle')?.classList.remove('active');
      this.leftToggle=false;
    }
  }
  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }
  onClickApply(){
    let params;  
        // params = 
        // {
        //   nickname :this.nickName,
        //   bankname : this.bankName,
        //   beneficiaryType : this.searchwithin,
        //   status: this.status
        // }


        if(this.leftToggle){
          // if(this.nickName){
            params = 
            {
              nickname :this.nickName,
              bankname : "",
              beneficiaryType : this.searchwithin,
              status: this.status,
              type: "NickName"
            }
            this.advancedSearchParams.emit(params);
            this.showAdvancedSearchPopup = false;    
            this.leftToggle=true;
            this.rightToggle=false;
            // this.nickName = "";
            this.leftToggleCntl();
            this.clearFlag = false;
            // this.clearFlag = !this.clearFlag;
          // }else{
          //   this.showDateErrorMessage = true;
          // }
         
        }else if(this.rightToggle){
         // if(this.bankName){
          params = 
          {
            nickname : "",
            bankname : this.bankName,
            beneficiaryType : this.searchwithin,
            status: this.status,
            type: "BankName"
          }
          this.advancedSearchParams.emit(params);
            this.showAdvancedSearchPopup = false;
            this.showDateErrorMessage = false;
            this.leftToggle=false;
            this.rightToggle=true;
            // this.bankName = "";
            this.rightToggleCntl();
            this.clearFlag = false;
            // this.clearFlag = !this.clearFlag;
          //}
        }
        // this.advancedSearchParams.emit(params);
        this.showAdvancedSearchPopup = false;
        this.clearFlag = !this.clearFlag;
    
     
   
  }
  
  onClickClear(){
    this.leftToggle=true;
    this.rightToggle=false;
    this.clearFlag = !this.clearFlag;
    this.status='Active';
    this.searchwithin=this.selectedBene;
    this.nickName = "";
    this.bankName="";
    this.leftToggleCntl();
  }
  
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }

}
