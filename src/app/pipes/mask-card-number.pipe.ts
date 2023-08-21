import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCardNumber'
})
export class MaskCardNumberPipe implements PipeTransform {

  public transform(value: any):string {
    let valueFormat=value;
    let valueFormatStart=valueFormat.slice(0, 6);
    let valueFormatMiddle=valueFormat.slice(6, 12).replace('X');
    valueFormatMiddle="XXXXXX";
    let valueFormatLast=valueFormat.slice(12, 16);
    let finalString=valueFormatStart+valueFormatMiddle+valueFormatLast;
    let stringFormatArr=[4,8,12,16];
    finalString = finalString.substring(0,stringFormatArr[0]) + " " + finalString.substring(4,stringFormatArr[1]) + " " + finalString.substring(8,stringFormatArr[2]) + " "+ finalString.substring(12,stringFormatArr[3]) 

    return finalString;
  }

}
