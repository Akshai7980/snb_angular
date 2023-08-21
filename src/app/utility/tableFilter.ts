import { CurrencyFormatPipe } from '../pipes/currency-format.pipe';
import { DateFormatPipe } from '../pipes/date-format.pipe';

export function showFilteredRows(tableId: string, searchValue: any): void {
    let filter, table, tr, td, txtValue, tdList;
    filter = searchValue;
    // filter = (<HTMLInputElement>document.getElementById(searchField)).value
    filter = filter?.toUpperCase();
    table = document.getElementById(tableId);
    tr = table?.getElementsByTagName('tr');
    if(tr && typeof filter != 'undefined') {
        for (let i = 0; i < tr.length; i++) {
            if(tr[i].classList.contains('groupHeader')) {
                continue;
            }
            tdList = tr[i].getElementsByTagName("td");
            let isTxtMatchFound = false;
            for(let j=0; j < tdList.length; j++) {
                td = tdList[j];
                if (td) {
                txtValue = td.textContent || td.innerText;
                //console.log('td['+j+']: ' + txtValue + ':: filter: ' + filter);
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    isTxtMatchFound = true;
                }
                }
                if(isTxtMatchFound) {
                    tr[i].style.display = "";
                }else {
                    tr[i].style.display = "none";
                }
            }
                
        }
    }
 }

 const curFormatPipe = new CurrencyFormatPipe;
 const datFormatPipe = new DateFormatPipe;
// const fiteredArr = filterPipe.transform(chkArray,txtSearch);
 export function showFilteredRecords(sourceObject: any, displayKeys: any, searchValue: any): any {
    // return sourceObject.filter(function (el: any) {
    //     return el.res_Val_Dt.indexOf(searchValue)
    //   });
    // Adding additional fields(formatted date and formatted amount) for search
    for(let propInd in displayKeys) {
        if(displayKeys[propInd].fieldType === 'date' || displayKeys[propInd].fieldType === 'amount1' || displayKeys[propInd].fieldType === 'amount2') {
            let newField = {"name": displayKeys[propInd].name+'_temp', "fieldType": "string"}
            displayKeys.push(newField);
        }
        // else if(displayKeys[propInd].fieldType === 'amount') {
        //     let newField = {"name": displayKeys[propInd].name+'_amount', "fieldType": "string"}
        //     displayKeys.push(newField);
        // }
    }
// console.log(displayKeys);
    let newDataToDisplay: any = [];
    for(let recordInd in sourceObject) {
        for(let propInd in displayKeys) {
            //console.log(displayKeys[propInd].fieldType +"::" + sourceObject[recordInd][displayKeys[propInd].name])
            let ccy1: any;
            let ccy2: any;
            sourceObject[recordInd][displayKeys[propInd].name] = sourceObject[recordInd][displayKeys[propInd].name] + '';
            if(displayKeys[propInd].fieldType === 'ccy1') {
                //get ccy for amount1
                ccy1 = sourceObject[recordInd][displayKeys[propInd].name];
            }else if(displayKeys[propInd].fieldType === 'ccy2') {
                //get ccy for amount2
                ccy2 = sourceObject[recordInd][displayKeys[propInd].name];
            }else if(displayKeys[propInd].fieldType === 'date') {
                //format date value and assign in a new field
                let dateVal = sourceObject[recordInd][displayKeys[propInd].name];
                sourceObject[recordInd][displayKeys[propInd].name +'_temp'] = datFormatPipe.transform(dateVal);
            }else if(displayKeys[propInd].fieldType === 'amount1') {
                //format amount value and assign in a new field
                let amtVal = sourceObject[recordInd][displayKeys[propInd].name];
                if(amtVal==="" || amtVal===0 ){
                    sourceObject[recordInd][displayKeys[propInd].name +'_temp'] = sourceObject[recordInd][displayKeys[propInd].name]; 
                }else{
                    sourceObject[recordInd][displayKeys[propInd].name +'_temp'] = curFormatPipe.transform(amtVal, ccy1);
                }
            }else if(displayKeys[propInd].fieldType === 'amount2') {
                //format amount value and assign in a new field
                let amtVal = sourceObject[recordInd][displayKeys[propInd].name];
                sourceObject[recordInd][displayKeys[propInd].name +'_temp'] = curFormatPipe.transform(amtVal, ccy2);
            }
            
            // console.log(sourceObject[recordInd][displayKeys[propInd].name].indexOf(searchValue));

            if(sourceObject[recordInd][displayKeys[propInd].name] && sourceObject[recordInd][displayKeys[propInd].name].toLowerCase().indexOf(searchValue.toLowerCase())>=0) {
                newDataToDisplay.push(sourceObject[recordInd]);
                break;
            }
        }
    }
    // console.log(newDataToDisplay)
    return newDataToDisplay;

   //  return sourceObject.res_Val_Dt.filter((word:any) => word.indexOf('e')>=0);
 }