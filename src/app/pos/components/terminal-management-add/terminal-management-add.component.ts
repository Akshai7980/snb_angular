import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal-management-add',
  templateUrl: './terminal-management-add.component.html',
  styleUrls: ['./terminal-management-add.component.scss'],
})
export class TerminalManagementAddComponent implements OnInit {
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
    this.router.navigate(['/pos/terminal_management_add-review']);
  }
}
