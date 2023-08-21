import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {
  [x: string]: any;
  @Input() moreActionList: any;
  @Output() onMenuClick = new EventEmitter();
  isOpen = false;
  showtext: boolean = false;
  dropvalue: any = [];
  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor() {
    this.isMasterSel = false;
  }

  ngOnInit(): void {

  }
  showMenuList(event: any) {

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.cifFilter();
    }
  }

  // menuClick(clickedMenu: any) {  
  //   this.onMenuClick.emit(clickedMenu.OD_ACC_NO);
  //   //this.isOpen = false;
  // }

  checkUncheckAll() {
    for (let i = 0; i < this.moreActionList.length; i++) {
      this.moreActionList[i].isSelected = this.isMasterSel;
    }
    this.onMenuClick.emit('');

  }
  // Check All Checkbox Checked
  isAllSelected(clickedMenu:any ,event:any) {
    if(event.target.checked)
    {
      this.onMenuClick.emit(clickedMenu.CIF_NO);
    }
    else{
      this.onMenuClick.emit('');
    }
    
    // this.isMasterSel = this.moreActionList.every(function (apilist: any) {
    //   return apilist.isSelected == true;
    // })
  }


  cifFilter() {
    let particularRecord :any=[];

    if(this.rootScopeData.activeTabName=='casa')
    {
      let tableValue = this.rootScopeData.accountsSummaryObject;
      for(let i=0;i < tableValue.length;i++)
      {
        if(particularRecord){
          if (particularRecord.find((test:any) => test.CIF_NO === tableValue[i].COD_CORECIF) === undefined) { 
            Object.assign(tableValue[i], { CIF_NO: tableValue[i].COD_CORECIF});
            particularRecord.push(tableValue[i]);
            this.moreActionList = particularRecord;
          }
        }
       
      }   
    }
    else if(this.rootScopeData.activeTabName == 'loans'){
      let tableValue = this.rootScopeData.accountsSummaryObject;
      for(let i=0;i < tableValue.length;i++)
      {
        if(particularRecord){
          if (particularRecord.find((test:any) => test.CIF_NO === tableValue[i].CIF_NO) === undefined) { 
            Object.assign(tableValue[i], { CIF_NO: tableValue[i].CIF_NO});
            particularRecord.push(tableValue[i]);
            this.moreActionList = particularRecord;
          }
        }
       
      }   
    }
    else if(this.rootScopeData.activeTabName == 'singleTransfer'){
     
      let tableValue = this.rootScopeData.accountsSummaryObject;
      
      for(let i=0;i < tableValue.length;i++)
      {
        if(particularRecord){
          if (particularRecord.find((test:any) => test.CIF_NO === tableValue[i].CIF_NO) === undefined) { 
            Object.assign(tableValue[i], { CIF_NO: tableValue[i].CIF_NO});
            particularRecord.push(tableValue[i]);
            this.moreActionList = particularRecord;
          }
        }
       
      }   
    }
    else if(this.rootScopeData.activeTabName == 'sadadTransfer'){
      let tableValue = this.rootScopeData.accountsSummaryObject;
      for(let i=0;i < tableValue.length;i++)
      {
         
        if(particularRecord){
          if (particularRecord.find((test:any) => test.CIF_NO === tableValue[i].CIF_NO) === undefined) { 
            Object.assign(tableValue[i], { CIF_NO: tableValue[i].CIF_NO});
            particularRecord.push(tableValue[i]);
            this.moreActionList = particularRecord;
          }
        }
      
      }  
    }
    else if(this.rootScopeData.activeTabName == 'downloadcenter'){
      let tableValue = this.rootScopeData.accountsSummaryObject;
      for(let i=0;i < tableValue.length;i++)
      {
         
        if(particularRecord){
          if (particularRecord.find((test:any) => test.CIF_NO === tableValue[i].COD_CORECIF) === undefined) { 
            Object.assign(tableValue[i], { CIF_NO: tableValue[i].COD_CORECIF});
            particularRecord.push(tableValue[i]);
            this.moreActionList = particularRecord;
          }
        }
      
      }  
    }

    else if(this.rootScopeData.activeTabName == 'sadadBiller'){
      let tableValue = this.rootScopeData.accountsSummaryObject;
      for(let i=0;i < tableValue.length;i++)
      {
         
        if(particularRecord){
          if (particularRecord.find((test:any) => test.CIF_NO === tableValue[i].gcif) === undefined) { 
            Object.assign(tableValue[i], { CIF_NO: tableValue[i].gcif});
            particularRecord.push(tableValue[i]);
            this.moreActionList = particularRecord;
          }
        }
      
      }  
    }

    else if(this.rootScopeData.activeTabName == 'esalBiller'){
      let tableValue = this.rootScopeData.accountsSummaryObject;
      for(let i=0;i < tableValue.length;i++)
      {
         
        if(particularRecord){
          if (particularRecord.find((test:any) => test.CIF_NO === tableValue[i].gcif) === undefined) { 
            Object.assign(tableValue[i], { CIF_NO: tableValue[i].gcif});
            particularRecord.push(tableValue[i]);
            this.moreActionList = particularRecord;
          }
        }
      
      }  
    }
    
  }
}
