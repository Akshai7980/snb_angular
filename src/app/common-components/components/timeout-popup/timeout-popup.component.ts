import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-timeout-popup',
  templateUrl: './timeout-popup.component.html',
  styleUrls: ['./timeout-popup.component.scss']
})
export class TimeoutPopupComponent implements OnInit {

  timeLeft: number = 60;
  interval:any;
  @Output() ontimeoutInterval = new EventEmitter()
  
  constructor() { }

  ngOnInit(): void {
    this.startTimer();
  }



startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);  
         this.ontimeoutInterval.emit('Y');  

      }
    },1000)
  }

  close_click(){
    clearInterval(this.interval); 
    this.ontimeoutInterval.emit('N');  
  }


}
