import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mada-card-details-section',
  templateUrl: './mada-card-details-section.component.html',
  styleUrls: ['./mada-card-details-section.component.scss']
})
export class MadaCardDetailsSectionComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    
  }

  

  @Input() selectedTransfer : any;
  //selectedTransfer:any;
}
