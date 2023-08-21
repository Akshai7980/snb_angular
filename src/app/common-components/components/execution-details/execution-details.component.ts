import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-execution-details',
  templateUrl: './execution-details.component.html',
  styleUrls: ['./execution-details.component.scss']
})
export class ExecutionDetailsComponent implements OnInit {
  @Input() exeType:any
  @Input() debAmt="0.00"
  @Input() initialState=true;
  @Input() businessDates:any;
  @Output() executionDataObj=new EventEmitter();
  @Input()dateError:any
  @Input()feeCharge:any
  @Input()vatCharge:any
  @Input()ccy:any
  @Input()debCcy:any
  @Input()checkType:any
  setMinDate:any
  // setMinDate=new Date((new Date().getFullYear()),0,1)
  setMaxDate=new Date((new Date().getFullYear()),11,31)
  maxDate=new Date("06/30/2022")
  executionType:any
  executionTypeWithin=["Immediate","Scheduled"]
  executionTypeNotWithin=["Immediate","Standard","Scheduled"]
  fee:any=[]
  exeObj:any={
    type:"Immediate",
    feeData:"",
    date:""
  }
  dateArray:any=[]
  rootScopeData: RootScopeDeclare = RootScopeData
  startDate: any;
  endDate: any;
  constructor(public datePipe:DatePipe,private transservice:TranslateService) { 
  }
  ngOnChanges(){
    this.exeObj.fee=this.feeCharge
    this.exeObj.vat=this.vatCharge
    if(this.businessDates){
      this.getfeeData();
      this.exeObj.callflag=false
      this.executionDataObj.emit(this.exeObj)
    }if(this.feeCharge && this.debAmt && this.vatCharge){
      // this.exeObj.amt=Number(this.debAmt)+Number(this.feeCharge)+Number(this.vatCharge)
      this.exeObj.amt = this.debAmt;
    }
  }

  ngOnInit(): void {
    // this.exeObj.amt=this.debAmt
    // this.executionDataObj.emit(this.exeObj)
    if(this.exeType && this.exeType==="withIn"){
      this.executionType=this.executionTypeWithin
    }else if(this.exeType && this.exeType==="notWithIn"){
      this.executionType=this.executionTypeNotWithin
    }
    
   
  }

  getfeeData(){
    this.exeObj.callflag=true
    this.exeObj.amt=this.debAmt
    let data;
    let month:any

    if(this.businessDates){
      if(this.exeObj.type === 'Immediate')
      {
        data=this.businessDates[0].businessDay +" - "+  this.transservice.instant("LBL_IMMEDIATE_TRANSFER") +" - ";
        this.exeObj.feeData=data
        this.exeObj.date=this.businessDates[0].businessDay;
        this.exeObj.valueDate=this.businessDates[0].businessDay;
      }
      else if(this.exeObj.type==='Standard')
      {
        data=this.businessDates[1].businessDay +" - " + this.transservice.instant("LBL_STANDARD_TRANSFER") +" -";
        this.exeObj.feeData=data
        this.exeObj.date=this.businessDates[1].businessDay;
        this.exeObj.valueDate=this.businessDates[1].businessDay; 
      }
      // else if(this.exeObj.type==='Scheduled'){

      // }
    }




  //   if(this.businessDates){
  //     this.businessDates.forEach((element:any, index : any) => {
  //       if(this.exeObj.type==='Immediate'){
  //         // month=Number(String(element.businessDay).substring(3,5))-1
  //         // this.setMinDate=new Date((new Date().getFullYear()),month,1)
  //         data=element.businessDay +" - "+  this.transservice.instant("LBL_IMMEDIATE_TRANSFER") +" - "
  //         this.exeObj.feeData=data
  //         this.exeObj.date=element.businessDay;
  //         this.exeObj.valueDate=element.businessDay;
  //         // this.exeObj.amt=this.debAmt+Number(this.feeCharge)+Number(this.vatCharge)
  //         this.exeObj.amt = this.debAmt;
  //       }else if (this.exeObj.type==='Standard'){
  //         data=element.businessDay+" - " + this.transservice.instant("LBL_STANDARD_TRANSFER") +" -" 
  //         this.exeObj.feeData=data
  //         // this.exeObj.amt=this.debAmt+Number(this.feeCharge)+Number(this.vatCharge)
  //         this.exeObj.amt = this.debAmt;
  //         this.exeObj.date=element.businessDay;
  //         this.exeObj.valueDate=element.businessDay;
  //       }
  //       else if(this.exeObj.type==='Scheduled'){
  //         // month=Number(String(element.businessDay).substring(3,5));
  //         // this.setMinDate=new Date((new Date().getFullYear()),month,1);
  //         // this.setMinDate = new Date(element.businessDay);
  //       }
  //      })
  //   }
  //  ;
  
  }
  feeSelected(event:any){
    this.exeObj.feeData=event
  }
  executionsType(event:any){
    this.exeObj.callflag=true
    this.executionDataObj.emit(this.exeObj)
    if(this.exeObj.type==='Scheduled'){
      this.exeObj.date=""
      //debugger;
      // this.businessDates.forEach((element:any) => {
      //   let day=String(element.businessDay).substring(0,2)
      //   let month=String(element.businessDay).substring(3,5)
      //   let year=String(element.businessDay).substring(6,10)
      //   this.dateArray.push(new Date(`${month}/${day}/${year}`).getTime())
      // });
      // this.exeObj.amt=this.debAmt+Number(this.feeCharge)+Number(this.vatCharge)
      if(this.checkType ==='Y'){
        let setEndDateOut : any = +(this.rootScopeData.userInfo.transferperdays ? this.rootScopeData.userInfo.transferperdays : 14)
        this.startDate = new Date(new Date().setDate(new Date().getDate() + 1));
        this.endDate = new Date(new Date().setDate(new Date().getDate() + setEndDateOut));
      }else{

        //     let currentdate = new Date();
        //     currentdate.setMinutes(0);
        //     currentdate.setSeconds(0);
        //     currentdate.setHours(0);

        //   let formattedDate = moment(this.businessDates[0].businessDay, 'DD/MM/YYYY');
        //   let firstBusinessDate = formattedDate.toDate();
        //   firstBusinessDate = new Date(firstBusinessDate);
        //  debugger;
        //  if(currentdate.toDateString() === firstBusinessDate.toDateString())          {
        //     // res.dataValue.businessDaysList.splice(0, 1);
        //     // res.dataValue.businessDaysList.splice(0, 1);  

        //     this.businessDates.splice(0, 1);
        //     this.businessDates.splice(0, 1);
        //   }     
        // debugger;
        this.businessDates.forEach((element: any) => {
          const time = moment(element.businessDay, 'DD/MM/YYYY').set({
            hour: 0,
            minute: 0,
            second: 0,
          });
  
          this.dateArray.push(time.valueOf());
        });
        const sortedAscDate = this.dateArray.sort(
          (objA: any, objB: any) => objA - objB
        );
        this.setMinDate = new Date(sortedAscDate[2]);
      }

      this.exeObj.amt = this.debAmt;
      //debugger;
    }else{
      this.getfeeData();
    }
  }
  getDate(event:any){
    if(event){
      this.exeObj.callflag=false
      this.exeObj.date=event
      this.exeObj.valueDate=this.datePipe.transform(event,"dd/MM/yyyy")
      this.executionDataObj.emit(this.exeObj)
    }
  }
}
