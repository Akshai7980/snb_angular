import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-terminal-mada-material',
  templateUrl: './terminal-mada-material.component.html',
  styleUrls: ['./terminal-mada-material.component.scss'],
})
export class TerminalMadaMaterialComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  proceedButton() {
    this.router.navigate(['/pos/terminal_request-for-stand-review']);
  }
}
