import { RootScopeData } from 'src/app/rootscope-data';


export function amountUnFormat(amt: any): string {
  let currencyFormat = ''//from rootscope


  let requiredFormat = "##,##,###.##";
  if(RootScopeData.userInfo.mAmtFormat) {
    requiredFormat = RootScopeData.userInfo.mAmtFormat;
  }

  let formatDecimalSeperator = requiredFormat.lastIndexOf('.') > requiredFormat.lastIndexOf(',') ? '.' : ',';
  let formatWholeNumberSeperator = formatDecimalSeperator == '.' ? ',' : '.';
  let unFormattedAmt = amt.replaceAll(formatWholeNumberSeperator, '');
  unFormattedAmt = unFormattedAmt.replace(',','.');
  return unFormattedAmt;
}