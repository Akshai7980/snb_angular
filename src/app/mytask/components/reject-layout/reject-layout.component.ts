import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reject-layout',
  templateUrl: './reject-layout.component.html',
  styleUrls: ['./reject-layout.component.scss']
})
export class RejectLayoutComponent implements OnInit {
  isRejectReason: any;
  submitData: any;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  
  onClickSubmit(){
    if(this.isRejectReason){
      //console.log(this.submitData)
      this.router.navigate(['/mytask/rejectReceipt'])
    }
  }
  getRejectReasonValidationFlag(data:any){
    this.isRejectReason = data;
  }
  getSubmitData(data:any){
    this.submitData = data;
  }

}
