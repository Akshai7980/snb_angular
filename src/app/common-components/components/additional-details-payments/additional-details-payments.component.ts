import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-additional-details-payments',
  templateUrl: './additional-details-payments.component.html',
  styleUrls: ['./additional-details-payments.component.scss']
})
export class AdditionalDetailsPaymentsComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData
  @Output() additionalDetailsEmit = new EventEmitter<string>();
  @Input() additionalDetailsErrorObj: any = {};
  @Input() showAddDetInitiateScreen = true;
  @Input() relationshipArrayDataSource: any;
  @Input() purposeOfTransferArrayDataSource: any;
  @Input() showAdditionalDetails: any;
  @Output() purposeCode = new EventEmitter();
  @Output() relationshipCode = new EventEmitter();
  @Input() rootScopeObject:any;
  @Input() setpurposeCode:any;
  @Input() setrelationship:any;
  @Input() setInstructionVal1:any;
  @Input() setInstructionVal2:any;
  @Input() setNarrationVal:any;
  @Input() showNarrationDetails:boolean = false;

  @Input() maxDate: any;
  @Input() minDate: any;

  vDate: any;

  additionalDetailsObj: any = {
    purpose: "",
    relationship: "",
    valueDate: "",
    narration: "",
    purposeCode: "",
    relationShipCode: "",
    categoryCode: "",
    category: "",
    subPurposeCode: "",
    subPurpose: "",
    intructions1:"",
    instructions2:""
  };

  isOpen: boolean = false;

  seletedPurpose: any = 'LBL_CHOOSE_AN_SELECT_OPTION';
  relationShipEmit: boolean = false;
  amendDisabled = false;

  constructor() { }

  ngOnInit(): void {
    if(this.rootScopeData?.localSITransactionObject?.amend === 'Y' || 
     this.rootScopeData.internationalSITransactionObject.amend === 'Y'){
      this.amendDisabled = true;
    }
    else {
      this.amendDisabled = false;
    }
    if (this.rootScopeObject) {
      this.additionalDetailsObj.narration = this.rootScopeObject.transactionCustRef;
      this.seletedPurpose = this.rootScopeObject.secPurposeCodeDesc;
      this.additionalDetailsObj.relationship = this.rootScopeObject.relCodeDesc;
    }

    if(this.setpurposeCode){
      this.seletedPurpose = this.additionalDetailsObj.subPurpose =  this.setpurposeCode;
      this.additionalDetailsObj.relationship = this.setrelationship;
      this.additionalDetailsObj.relationShipCode = this.setrelationship;  
    }
    var selectedDate = new Date();
    this.vDate = selectedDate;
    let vDateEmit = "" + selectedDate.getDate().toString().padStart(2, "0") + "/" + (selectedDate.getMonth() + 1).toString().padStart(2, "0") + "/" + selectedDate.getFullYear();
    this.additionalDetailsObj.valueDate = vDateEmit;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }

  triggerCloneRelationshipCode(){
    for (let i = 0; i < this.purposeOfTransferArrayDataSource.length; i++) {
      for (let j = 0; j < this.purposeOfTransferArrayDataSource[i].purpose.length; j++) {
        for (let k = 0; k < this.purposeOfTransferArrayDataSource[i].purpose[j].subPurpose.length; k++) {
          if (this.rootScopeObject.secPurposeCodeDesc === this.purposeOfTransferArrayDataSource[i].purpose[j].subPurpose[k].subPurposeDesc) {
            let category = this.purposeOfTransferArrayDataSource[i];
            let purpose = this.purposeOfTransferArrayDataSource[i].purpose[j];
            let subPurpose = this.purposeOfTransferArrayDataSource[i].purpose[j].subPurpose[k];
            this.additionalDetailsObj.categoryCode = category.categoryCode;
            this.additionalDetailsObj.category = category.categoryDesc;
            this.additionalDetailsObj.purpose = purpose.purposeDesc;
            this.additionalDetailsObj.purposeCode = purpose.purposeCode
            this.additionalDetailsObj.subPurpose = subPurpose.subPurposeDesc;
            this.additionalDetailsObj.subPurposeCode = subPurpose.subPurposeCode;
          }
        }
      }
    }
    this.purposeCode.emit(this.additionalDetailsObj);
    this.relationShipEmit = true;
  }
  
  emitCloneRelationshipCode(){
   for(let i=0;i<this.relationshipArrayDataSource.length;i++){
    if(this.rootScopeObject.relCodeDesc === this.relationshipArrayDataSource[i].REL_CODE_DESC){
      this.additionalDetailsObj.relationShipCode = this.relationshipArrayDataSource[i].REL_CODE;
    }
   }
   this.relationshipCode.emit(this.additionalDetailsObj.relationShipCode); 
  }

  ngOnChanges() {
    if(this.purposeOfTransferArrayDataSource.length > 0 && this.rootScopeObject && this.rootScopeData.isCloneClicked){
      this.rootScopeData.isCloneClicked = false;
      this.triggerCloneRelationshipCode();
    }
    if(this.relationshipArrayDataSource.length > 0 && this.rootScopeObject && this.relationShipEmit){
      this.relationShipEmit = false;
      this.emitCloneRelationshipCode();
    }
    //debugger
    if(this.setrelationship){
      this.additionalDetailsObj.relationship = this.setrelationship;   
      this.additionalDetailsObj.relationShipCode = this.setrelationship;   
      this.additionalDetailsObj.intructions1 = this.setInstructionVal1;
      this.additionalDetailsObj.instructions2 = this.setInstructionVal2;
      this.additionalDetailsObj.narration = this.setNarrationVal;
    }
    
  }

  /*purposeChanged(event: any) {
    if(this.additionalDetailsObj.purpose != undefined && this.additionalDetailsObj.purpose != "" && this.additionalDetailsObj.purpose != null){
      this.additionalDetailsErrorObj.purposeError = "";
    }
    if(this.additionalDetailsObj.purpose){
      for(let i=0;i<this.purposeOfTransferArrayDataSource.length;i++){
        if(this.additionalDetailsObj.purpose === this.purposeOfTransferArrayDataSource[i].purposeCodeDesc){
          this.additionalDetailsObj.purposeCode = this.purposeOfTransferArrayDataSource[i].purposeCode;
        }
      }
    }
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
    this.purposeCode.emit(this.additionalDetailsObj.purposeCode);
  }*/

  relationshipChanged() {
    if (this.additionalDetailsObj.relationship != undefined && this.additionalDetailsObj.relationship != "" && this.additionalDetailsObj.relationship != null) {
      this.additionalDetailsErrorObj.relationshipError = "";
    }
    if (this.additionalDetailsObj.relationship) {
      for (let i = 0; i < this.relationshipArrayDataSource.length; i++) {
        if (this.additionalDetailsObj.relationship === this.relationshipArrayDataSource[i].REL_CODE_DESC) {
          this.additionalDetailsObj.relationShipCode = this.relationshipArrayDataSource[i].REL_CODE;
        }
      }
    }
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
    this.relationshipCode.emit(this.additionalDetailsObj.relationShipCode);
  }

  tovalue() {
    var selectedDate = new Date(this.vDate);
    let vDate = "" + selectedDate.getDate().toString().padStart(2, "0") + "/" + (selectedDate.getMonth() + 1).toString().padStart(2, "0") + "/" + selectedDate.getFullYear();
    if (vDate) {
      this.additionalDetailsErrorObj.valueDateError = "";
    }
    this.additionalDetailsObj.valueDate = vDate;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }

  narrationOnBlur(event: any) {
    let narration = event.target.value
    this.additionalDetailsObj.narration = narration;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }

  instructions1OnBlur(event: any) {
    let instruction1 = event.target.value
    this.additionalDetailsObj.intructions1 = instruction1;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }

  instructions2OnBlur(event: any) {
    let instruction2 = event.target.value
    this.additionalDetailsObj.instructions2 = instruction2;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }

  showMenuList(event: any) {
    event?.stopPropagation();
    if(this.rootScopeData.localSITransactionObject.amend === "Y" || 
    this.rootScopeData.internationalSITransactionObject.amend === "Y" || 
    this.rootScopeData.ownAccountSITransactionObject.amend === "Y" || 
    this.rootScopeData.withinBankSITransactionObject.amend === "Y" ){ 
      this.isOpen = false;
    }else {
      this.isOpen = !this.isOpen;
    }
   
  }

  getPurpose(category: any, purpose: any, subpurpose: any) {
    // console.log("JHHDHDH",category,purpose,subpurpose)
    this.isOpen = !this.isOpen;
    if (subpurpose && subpurpose.subPurposeCode) {
      this.additionalDetailsErrorObj.purposeError = '';
    }
    this.seletedPurpose = subpurpose.subPurposeDesc;
    this.additionalDetailsObj.categoryCode = category.categoryCode;
    this.additionalDetailsObj.category = category.categoryDesc;
    this.additionalDetailsObj.purpose = purpose.purposeDesc;
    this.additionalDetailsObj.purposeCode = purpose.purposeCode
    this.additionalDetailsObj.subPurpose = subpurpose.subPurposeDesc;
    this.additionalDetailsObj.subPurposeCode = subpurpose.subPurposeCode;

    // if(subpurpose){
    //   for(let i=0;i<this.purposeOfTransferArrayDataSource[0].purpose.length;i++){
    //     // console.log(i)
    //     if(this.purposeOfTransferArrayDataSource[0].purpose[i].purposeDesc ===purpose.purposeDesc){
    //       // console.log("Selected Purpose",this.purposeOfTransferArrayDataSource[0].purpose[i])
    //       for(let j=0;j<this.purposeOfTransferArrayDataSource[0].purpose[i].subPurpose.length;j++){
    //         // console.log(this.purposeOfTransferArrayDataSource[0].purpose[i].subPurpose[j])
    //         if(this.purposeOfTransferArrayDataSource[0].purpose[i].subPurpose[j].subPurposeDesc === subpurpose.subPurposeDesc){
    //           // console.log("Selected SubPurpose",this.purposeOfTransferArrayDataSource[0].purpose[i].subPurpose[j])
    //           this.additionalDetailsObj.purposeCode = this.purposeOfTransferArrayDataSource[0].purpose[i].purposeCode;
    //           this.additionalDetailsObj.subPurposeCode = this.purposeOfTransferArrayDataSource[0].purpose[i].subPurpose[j].subPurposeCode;
    //         }
    //       }
    //     }
    //   }
    // }

    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
    this.purposeCode.emit(this.additionalDetailsObj);
  }

  onClickMainCatExpand( categoryCode: string, isExpand: boolean){
    this.purposeOfTransferArrayDataSource = this.purposeOfTransferArrayDataSource.map((eachCategory: any) => {
      if(eachCategory?.categoryCode === categoryCode) {
        return { ...eachCategory, expand: !isExpand}
      }else{
       return { ...eachCategory}
      }
   })
   //console.log(this.purposeOfTransferArrayDataSource)
  }

  onClickSubCatExpand(categoryCode: string, purposeCode: string, isExpand: boolean){
    this.purposeOfTransferArrayDataSource = this.purposeOfTransferArrayDataSource.map((eachCategory: any) => {
        if(eachCategory?.categoryCode === categoryCode) {
          return {
            ...eachCategory,
            purpose: eachCategory?.purpose?.map((eachPurpose: any) => {
              if(eachPurpose?.purposeCode === purposeCode) {
                return{ ...eachPurpose, expand: !isExpand}
              }else {
                return {...eachPurpose}
              }
          })
          }
        }else {
          return eachCategory;
        }
     });
    //  console.log(this.purposeOfTransferArrayDataSource);
   }

}
