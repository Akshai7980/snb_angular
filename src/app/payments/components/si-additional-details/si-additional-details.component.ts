import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-si-additional-details',
  templateUrl: './si-additional-details.component.html',
  styleUrls: ['./si-additional-details.component.scss'],
})
export class SiAdditionalDetailsComponent implements OnInit {
  @Output() additionalDetailsEmit = new EventEmitter<string>();
  @Input() additionalDetailsErrorObj: any = {};
  @Input() showAddDetInitiateScreen = true;
  @Input() relationshipArrayDataSource: any = {};
  @Input() purposeOfTransferArrayDataSource: any = {};
  @Output() purposeCode = new EventEmitter();
  @Output() relationshipCode = new EventEmitter();

  additionalDetailsObj: any = {
    purpose: '',
    relationship: '',
    valueDate: '',
    narration: '',
    purposeCode: '',
    relationShipCode: '',
  };

  constructor() {}

  ngOnInit(): void {}

  purposeChanged(event: any) {
    if (
      this.additionalDetailsObj.purpose != undefined &&
      this.additionalDetailsObj.purpose != '' &&
      this.additionalDetailsObj.purpose != null
    ) {
      this.additionalDetailsErrorObj.purposeError = '';
    }
    if (this.additionalDetailsObj.purpose) {
      for (let i = 0; i < this.purposeOfTransferArrayDataSource.length; i++) {
        if (
          this.additionalDetailsObj.purpose ===
          this.purposeOfTransferArrayDataSource[i].purposeCodeDesc
        ) {
          this.additionalDetailsObj.purposeCode =
            this.purposeOfTransferArrayDataSource[i].purposeCode;
        }
      }
    }
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
    this.purposeCode.emit(this.additionalDetailsObj.purposeCode);
  }

  relationshipChanged(event: any) {
    if (
      this.additionalDetailsObj.relationship != undefined &&
      this.additionalDetailsObj.relationship != '' &&
      this.additionalDetailsObj.relationship != null
    ) {
      this.additionalDetailsErrorObj.relationshipError = '';
    }
    if (this.additionalDetailsObj.relationship) {
      for (let i = 0; i < this.relationshipArrayDataSource.length; i++) {
        if (
          this.additionalDetailsObj.relationship ===
          this.relationshipArrayDataSource[i].REL_CODE_DESC
        ) {
          this.additionalDetailsObj.relationShipCode =
            this.relationshipArrayDataSource[i].REL_CODE;
        }
      }
    }
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
    this.relationshipCode.emit(this.additionalDetailsObj.relationShipCode);
  }

  narrationOnBlur(event: any) {
    let narration = event.target.value;
    this.additionalDetailsObj.narration = narration;
    this.additionalDetailsEmit.emit(this.additionalDetailsObj);
  }
}
