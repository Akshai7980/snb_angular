import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal-request-for-stand',
  templateUrl: './terminal-request-for-stand.component.html',
  styleUrls: ['./terminal-request-for-stand.component.scss'],
})
export class TerminalRequestForStandComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  proceedButton() {
    this.router.navigate(['/pos/terminal_request-for-stand-review']);
  }
}
