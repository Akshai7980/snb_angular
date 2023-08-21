import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-pos-terminal-add-new-terminal',
  templateUrl: './pos-terminal-add-new-terminal.component.html',
  styleUrls: ['./pos-terminal-add-new-terminal.component.scss'],
})
export class PosTerminalAddNewTerminalComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  leftToggle = true;
  rightToggle = false;
  numberOfTerminals = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];
  

  constructor(private router: Router) {}

  ngOnInit(): void {}

  leftToggleCntl() {
    document.getElementById('leftToggle')?.classList.add('active');
    document.getElementById('rightToggle')?.classList.remove('active');
    this.leftToggle = true;
    this.rightToggle = false;
  }
  rightToggleCntl() {
    document.getElementById('rightToggle')?.classList.add('active');
    document.getElementById('leftToggle')?.classList.remove('active');
    this.rightToggle = true;
    this.leftToggle = false;
  }
  allowNumbersOnly(e: any) {
    var code = e.which ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
      e.preventDefault();
    }
  }
  proceed() {
    this.router.navigate(['/pos/terminal_add-review']);
     
  }
  backToMerchant() {
    this.rootScopeData.showTerminalSelect = true;
    this.rootScopeData.showAddNewMerchantContainer = false;
    this.rootScopeData.showMerchantSelect = true;
    this.rootScopeData.showViewMerchant = false;
    this.rootScopeData.showNewTerminal = false;
    
  }
}
