import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-receipt',
  templateUrl: './success-receipt.component.html',
  styleUrls: ['./success-receipt.component.scss']
})
export class SuccessReceiptComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onClickFinish(){
    this.router.navigate(['/dashboard'])
  }

}
