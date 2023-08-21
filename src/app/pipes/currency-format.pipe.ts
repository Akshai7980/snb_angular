import { Pipe, PipeTransform } from '@angular/core';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';


const PADDING = '000000';
@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;
  rootScopeData: RootScopeDeclare = RootScopeData;
  
  public constructor() {
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = ',';
  }

  /**
   * 
   * Transform the number.
   *
   * @param {(any)} value
   * @param {number} [fractionSize=2]
   * 
   * @returns {string}
   * 
   */

   public transform(value: any, currencyCode: string): string {

    let isConvertPositiveValue:boolean = false;
    if(value < 0)
    {
      value = value + '';
      value = value.replaceAll('-','');
      isConvertPositiveValue = true;
    }
   

    let currencyFractionSize: any = {"JPY": 0, "XPF": 0, "XAF": 0, "BYR": 0, "OMR": 3, "BHD": 3,"JOD": 3,"KWD": 3,"LYD": 3, "TND": 3, "IQD": 3, "CLF": 4};
    let inputFractionSize = typeof currencyFractionSize[currencyCode] != 'undefined' ? currencyFractionSize[currencyCode] : 2;
    let requiredFormat = "##,##,###.##";
    if(this.rootScopeData.userInfo.mAmtFormat) {
      requiredFormat = this.rootScopeData.userInfo.mAmtFormat;
    }
    let inputNumber: any = 0.0;
    if(value) {
      inputNumber = value + '';// type converting as string
      inputNumber = inputNumber.replaceAll(',','');
    }
    //inputNumber = parseFloat(inputNumber).toFixed(inputFractionSize); // as part of decimal part truncation logic commented this line
    let inputWholeNumberPart = inputNumber.lastIndexOf('.') > 0 ? inputNumber.substr(0, inputNumber.lastIndexOf('.')) : inputNumber
    inputWholeNumberPart = inputWholeNumberPart.replaceAll('.','');
    let inputDecimalPart = inputNumber.lastIndexOf('.') > 0 ? inputNumber.substr(inputNumber.lastIndexOf('.')+1) : '';
    let formatDecimalSeperator = requiredFormat.lastIndexOf('.') > requiredFormat.lastIndexOf(',') ? '.' : ',';
    //let formatDecimalSeperatorIndex = requiredFormat.lastIndexOf('.') > requiredFormat.lastIndexOf(',') ? requiredFormat.lastIndexOf('.') : requiredFormat.lastIndexOf(',');
    let formatWholeNumberSeperator = formatDecimalSeperator == '.' ? ',' : '.';
    let formatLakhSeperatorDigits = requiredFormat.indexOf(formatWholeNumberSeperator);
    let inputWholeNumberTillThousandDecimal = inputWholeNumberPart.substr(0, inputWholeNumberPart.length - 3);
    let inputWholeNumberLengthTillThousandDecimal = inputWholeNumberTillThousandDecimal.length;
    let newNumber = '';
    for(let i=0; inputWholeNumberLengthTillThousandDecimal > i; i++) {
      newNumber += inputWholeNumberTillThousandDecimal[i];
      if(formatLakhSeperatorDigits == 2) {
        if(inputWholeNumberLengthTillThousandDecimal % 2 == 0 && i % 2 == 1){
          newNumber += formatWholeNumberSeperator;
        }else if(inputWholeNumberLengthTillThousandDecimal % 2 == 1 && i % 2 == 0){
         newNumber += formatWholeNumberSeperator;
        }
      }else if(formatLakhSeperatorDigits == 3) {
        if(inputWholeNumberLengthTillThousandDecimal % 3 == 0 && i % 3 == 2){
          newNumber += formatWholeNumberSeperator;
        }else if(inputWholeNumberLengthTillThousandDecimal % 3 == 1 && i % 3 == 0){
         newNumber += formatWholeNumberSeperator;
        }else if(inputWholeNumberLengthTillThousandDecimal % 3 == 2 && i % 3 == 1){
          newNumber += formatWholeNumberSeperator;
         }
      }
    }
    // decimal part truncation logic with required amount of digits start
    inputDecimalPart = inputDecimalPart + '0000'; //max number of decimal part is 4 digits (for currency CLF) so added 4 zeros
    inputDecimalPart = inputDecimalPart.substr(0, inputFractionSize);
    // decimal part truncation logic with required amount of digits end
    if(inputDecimalPart != '') {
      inputDecimalPart = formatDecimalSeperator + inputDecimalPart
    }
    let substrStartVal = inputWholeNumberPart.length - 3 <= 0 ? 0 : (inputWholeNumberPart.length - 3);
    newNumber += inputWholeNumberPart.substr(substrStartVal) + inputDecimalPart;
    if(isConvertPositiveValue)
    {   
    newNumber ='-'+newNumber;
    }
    return newNumber;
    
  }

}
