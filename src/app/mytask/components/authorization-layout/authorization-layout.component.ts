import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization-layout',
  templateUrl: './authorization-layout.component.html',
  styleUrls: ['./authorization-layout.component.scss']
})
export class AuthorizationLayoutComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  
  onClickSubmit(){
    this.router.navigate(['/mytask/successReceipt'])
  }
}
