import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-terminal-pos-maintenance',
  templateUrl: './terminal-pos-maintenance.component.html',
  styleUrls: ['./terminal-pos-maintenance.component.scss'],
})
export class TerminalPosMaintenanceComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  proceed() {
    this.router.navigate(['/pos/terminal_pos-maintenance-review']);
  }
}
