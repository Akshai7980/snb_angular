import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RootScopeData } from '../../../rootscope-data';
import { RootScopeDeclare } from '../../../rootscope-declare';
import { CommonInjectServiceService } from '../../../accounts/services/common-inject-service.service';

@Component({
  selector: 'app-pos-service-request',
  templateUrl: './pos-service-request.component.html',
  styleUrls: ['./pos-service-request.component.scss'],
})
export class PosServiceRequestComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  printSection: any;
  propertyValue: string = '';
  enablePropertty: boolean = true;
  logo = 'assets/images/snb-logo-print.png';
  constructor(private service: CommonInjectServiceService) {}

  ngOnInit(): void {
    this.printSection = 'serviceRequestsPrintSection';
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.service.data$.subscribe((n) => (this.propertyValue = n));
      if (this.propertyValue === 'false') {
        this.enablePropertty = false;
      } else {
        this.enablePropertty = true;
      }
    }, 100);
  }
}
