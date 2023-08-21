import {  AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
})
export class AuthorizationComponent implements OnInit, AfterViewChecked {
  data: any = {
    selectedAprover: {
      OD_LEVEL: "",
        OD_GCIF: "",
        OD_USER_NO: "",
        AUTH_NAME: "Any",
        OD_ROLE_DESC: "",
        PARSED_RULE_ID: ""
    },
    aproveNote: '',
  };

  @Output() authEmit = new EventEmitter<string>();
  @Input() authListDataSource: any = [];
  @Input() authError: any;
  stopFlag: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    if (this.authListDataSource && this.authListDataSource[0]?.AUTH_NAME !== "Any") {
      this.authListDataSource.unshift( {
        "OD_LEVEL": "",
        "OD_GCIF": "",
        "OD_USER_NO": "",
        "AUTH_NAME": "Any",
        "OD_ROLE_DESC": "",
        "PARSED_RULE_ID": ""
      })
      if (!this.stopFlag) {
        this.emitAuthorizationData();
        this.stopFlag = true;
      }
    }
  }

  /**
   * @description set approver data and error
   * @param selectedApprover selected approver for authorization
   */
  authorizationEmit(selectedApprover: any): void {
    if (selectedApprover) {
      this.authError = '';
    }
    this.data.selectedAprover = selectedApprover;
    this.emitAuthorizationData();
  }

  /**
   * @description emit authorization data to parent component
   */
  emitAuthorizationData(): void {
    this.authEmit.emit(this.data);
  }
}