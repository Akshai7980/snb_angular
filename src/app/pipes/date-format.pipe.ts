import { Pipe, PipeTransform } from '@angular/core';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  rootScopeData: RootScopeDeclare = RootScopeData;  
  formatType:string ="";
   monthNames = ["Jan", "Feb", "Mar", "Apr", "May","Jun","Jul", "Aug", "Sep", "Oct", "Nov","Dec"];
 
  
 constructor() { }

  public transform(value: any):string {
    let requiredFormat = "dd/MM/yyyy";
    let newDateFormat :any; 
    if(value != undefined && value != "" && value != null){
     
    
    if (this.rootScopeData.userInfo.mDateFormat) {
      requiredFormat = this.rootScopeData.userInfo.mDateFormat;  
    }   

    let splitedDate = value.split("",10);
    let toMMDDYYYYFormat = splitedDate[3]+ +splitedDate[4] +"/"+splitedDate[0]+ +splitedDate[1] +"/"+ splitedDate[6]+ +splitedDate[7] +splitedDate[8]+ +splitedDate[9];  
    let convtdDate = new Date(toMMDDYYYYFormat);  
    let formatedDate = splitedDate[0]+ +splitedDate[1];
    let formatedMonth = splitedDate[3]+ +splitedDate[4];
    let formatYear = splitedDate[6]+ +splitedDate[7] +splitedDate[8]+ +splitedDate[9];


    if (toMMDDYYYYFormat && requiredFormat == "dd-MM-yyyy") {
      newDateFormat = "" + formatedDate + "-" + formatedMonth + "-" + formatYear;    
    }
    else if (convtdDate && requiredFormat == "dd/MM/yyyy") {
      newDateFormat = "" + formatedDate + "/" + formatedMonth + "/" + formatYear;
    }
    else if (convtdDate && requiredFormat == "MM-dd-yyyy") {
      newDateFormat = "" + formatedMonth + "-" +  formatedDate + "-" + formatYear;
    }
    else if (convtdDate && requiredFormat == "MM/dd/yyyy") {
      newDateFormat = "" + formatedMonth + "/" + formatedDate + "/" + formatYear;
    }
    else if (convtdDate && requiredFormat == "dd MMM,yyyy") {
      newDateFormat = "" + convtdDate.getDate() + " " + this.monthNames[convtdDate.getMonth()] + ", " + convtdDate.getFullYear();
    }
    return newDateFormat;
  }
  newDateFormat = "--";
  return newDateFormat;
}

}
