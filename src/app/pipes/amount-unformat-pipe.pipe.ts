import { Pipe, PipeTransform } from '@angular/core';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { RootScopeData } from 'src/app/rootscope-data';

@Pipe({
  name: 'amountUnformatPipe'
})
export class AmountUnformatPipePipe implements PipeTransform {


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
      inputNumber = value + '';
      inputNumber = inputNumber.replaceAll(',','');
    }
    
    let inputWholeNumberPart = inputNumber.lastIndexOf('.') > 0 ? inputNumber.substr(0, inputNumber.lastIndexOf('.')) : inputNumber
    inputWholeNumberPart = inputWholeNumberPart.replaceAll('.','');
    let inputDecimalPart = inputNumber.lastIndexOf('.') > 0 ? inputNumber.substr(inputNumber.lastIndexOf('.')+1) : '';
    let formatDecimalSeperator = requiredFormat.lastIndexOf('.') > requiredFormat.lastIndexOf(',') ? '.' : ',';
   
  
     inputDecimalPart = inputDecimalPart + '0000';
     inputDecimalPart = inputDecimalPart.substr(0, inputFractionSize);

     if(inputDecimalPart != '') {
      inputDecimalPart = formatDecimalSeperator + inputDecimalPart
    }
    let newNumber = '';
    newNumber += inputWholeNumberPart + inputDecimalPart;
    if(isConvertPositiveValue)
    {   
    newNumber ='-'+newNumber;
    }
    
    return newNumber;
  }

}
