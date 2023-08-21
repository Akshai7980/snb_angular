import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SadadPaymentService } from '../../services/sadad-payment.service';
@Component({
  selector: 'app-biller-details',
  templateUrl: './biller-details.component.html',
  styleUrls: ['./biller-details.component.scss'],
})

export class BillerDetailsComponent implements OnInit {

  @Input() billerListDataSource: any = {};
  @Input() proceedStatus: any;
  @Output() selectedBillerObj = new EventEmitter();
  @Output() selectedServiceTypeObj = new EventEmitter();
  isLoadingCompelete = false;
  billerControl = new FormControl('', [Validators.required]);
  billerName: any;
  billerId: any;
  billerCode: any;
  selectedBiller: any;
  selectedServiceType: any;
  serviceTypeListDataSource: any = {};

  constructor(private sadadService: SadadPaymentService,) {}

  ngOnInit(): void {}
  
  onBillerSelect(data: any) {
    this.selectedBillerObj.emit(data);
    this.billerName = data.billerName;
    if (this.billerName) {
        this.billerId = data.billerId;
         this.billerCode = data.billerCode;
      this.getAllServiceType();
    }
  }

  getAllServiceType() {
    this.isLoadingCompelete = false;
    this.sadadService.getSadadMoiService(this.billerName, this.billerCode, this.billerId,"BULK").subscribe((serviceData: any) => {
    this.isLoadingCompelete = true;
    this.serviceTypeListDataSource = serviceData.data;
    }, error => {
    this.isLoadingCompelete = true;
    })
  }

  onServiceTypeSelect(data: any) {
    this.selectedServiceTypeObj.emit(data);
   }

}
