import { __classPrivateFieldSet } from "tslib";

export function expandCollapse(val:any,event:any,setContainer:any,setToolsElement:any){
  
   if(val){
    let collapse =event.target.closest(".summaryConainer");
    document.getElementById(setContainer)?.classList.add('hide');
    document.getElementById(setToolsElement)?.classList.add('hide');
    collapse?.classList.remove('summaryConainer')
    collapse?.classList.add('summaryCntnrHeight')
    }else{
    let collapse =event.target.closest(".summaryConainer");
    document.getElementById(setContainer)?.classList.remove('hide');
    document.getElementById(setToolsElement)?.classList.remove('hide');
    collapse?.classList.add('summaryConainer')
    collapse?.classList.remove('summaryCntnrHeight')
    }
  }