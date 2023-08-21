import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-terminal-pos-papper-roll',
  templateUrl: './terminal-pos-papper-roll.component.html',
  styleUrls: ['./terminal-pos-papper-roll.component.scss'],
})
export class TerminalPosPapperRollComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  proceedButton() {
    this.router.navigate(['/pos/terminal_pos-paper-roll-review']);
  }
}
