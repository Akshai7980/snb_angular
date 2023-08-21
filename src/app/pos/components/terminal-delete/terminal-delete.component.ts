import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminal-delete',
  templateUrl: './terminal-delete.component.html',
  styleUrls: ['./terminal-delete.component.scss'],
})
export class TerminalDeleteComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  proceedButton() {
    this.router.navigate(['/pos/terminal_delete_review']);
  }
}
