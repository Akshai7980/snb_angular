import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reject-receipt',
  templateUrl: './reject-receipt.component.html',
  styleUrls: ['./reject-receipt.component.scss']
})
export class RejectReceiptComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  onClickFinish(){
    this.router.navigate(['/dashboard'])
  }

}
