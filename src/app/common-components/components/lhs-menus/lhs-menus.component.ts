import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lhs-menus',
  templateUrl: './lhs-menus.component.html',
  styleUrls: ['./lhs-menus.component.scss']
})
export class LhsMenusComponent implements OnInit {
rootScopeData:RootScopeDeclare=RootScopeData;
menu:any;

arr:any;
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.arr = this.rootScopeData.userEntitlements.treeMenu;
    if(this.rootScopeData.userInfo.isPayrollOnboarded === 'N'){
      this.arr.forEach(function (o: any) {
        if (o.level2Menu) {
          o.level2Menu = o.level2Menu.filter(
            (s: any) => s.itemId != 'ONBOARDING'
          );
        }
      });
    }

    this.findActiveScreenOnload();
  }
  findActiveScreenOnload() {
    let that = this;
    window.setTimeout(function(){
      let ulHeight:any = 0;
      ulHeight = document.getElementById('lhsMenuCntr')?.clientHeight;
      if(ulHeight > 30){
        
        document.getElementById('lhsMenuCntr')?.querySelectorAll('a').forEach(function(obj){
          if(obj.classList.contains('active')) {
            // that.expandCollapseSubMenus(obj.id);
            let level2_id = obj.closest('.level2Cntr')?.getAttribute('id');
            obj.closest('.level2Cntr')?.classList.remove('hide');
            document.querySelector('.'+level2_id)?.classList.add('highlight');

            let level3_id = obj.closest('.level3Cntr')?.getAttribute('id');
            obj.closest('.level3Cntr')?.classList.remove('hide');
            document.querySelector('.'+level3_id)?.classList.add('highlight');
          }
        });
        
      }else {
        that.findActiveScreenOnload();
      }
    }, 1000);
    
  }
  clearAllActiveTabs() {
    document.getElementById('lhsMenuCntr')?.querySelectorAll('a').forEach(function(obj){
      obj.classList.remove('active');
      obj.classList.remove('highlight');
    });
  }
  hideSubmenuGroups() {
    document.getElementById('lhsMenuCntr')?.querySelectorAll('.level2Cntr').forEach(function(obj){
      obj.classList.add('hide');
    });
  }
  expandCollapseSubMenus(id: any) {
    this. clearAllActiveTabs();
    let targettedSubMenuGroup = document.getElementById(id);
    let curElem = document.querySelector('.'+id);
    curElem?.classList.add('active');
    let isExpanded = targettedSubMenuGroup?.classList.contains('hide')?false: true;
    if(isExpanded) {
      targettedSubMenuGroup?.classList.add('hide');
      curElem?.classList.remove('expanded');
    }else {
      targettedSubMenuGroup?.classList.remove('hide');
      curElem?.classList.add('expanded');
    }
  }

  menuClick(itemId: any, level: any, routerPath: string) {
    this.clearAllActiveTabs();
    this.hideSubmenuGroups();
    if(routerPath === "/pos/posStatement" || routerPath === "/pos/posTerminalManagement" || routerPath === "/pos/posServiceRequest"){
      this.rootScopeData.showtransaction = true;
      this.rootScopeData.showMerchantDetail = false;
      this.rootScopeData.showMerchantSelect = false;
      this.rootScopeData.showNewTerminal = false;
      this.rootScopeData.showViewMerchant = false;
      this.rootScopeData.showAddNewMerchantContainer = false;
    }
    if (itemId === "TRADE_SSO") {
      this.rootScopeData.callTradeSSO = true;
    } else {
      if (!this.menu) {
          this.router.navigate([routerPath]);
      } else {
        this.reloadCurrentRoute(routerPath, itemId);
      }
    }
    if(level == 'level2') {
      document.querySelector('.'+itemId)?.closest('.level2Cntr')?.classList.remove('hide');
      document.querySelector('.'+itemId)?.closest('.level2Cntr')?.closest('li')?.querySelector('a')?.classList.add('highlight');
    }else if(level == 'level3') {
      document.querySelector('.'+itemId)?.closest('.level2Cntr')?.classList.remove('hide');
      document.querySelector('.'+itemId)?.closest('.level3Cntr')?.classList.remove('hide');
      document.querySelector('.'+itemId)?.closest('.level3Cntr')?.closest('li')?.querySelector('a')?.classList.add('highlight');
      document.querySelector('.'+itemId)?.closest('.level2Cntr')?.closest('li')?.querySelector('a')?.classList.add('highlight');
    }
    this.menu=itemId

  }
  reloadCurrentRoute(route:any,itemId:any) {
    let currentUrl = route;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        this.rootScopeData.currentUrl=route
    });
  }

}
