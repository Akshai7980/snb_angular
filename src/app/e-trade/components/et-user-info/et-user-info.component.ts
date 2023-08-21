import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-et-user-info',
  templateUrl: './et-user-info.component.html',
  styleUrls: ['./et-user-info.component.scss'],
})
export class EtUserInfoComponent implements OnInit {
  @Input() userInformation: any;
  constructor() {}

  ngOnInit(): void {}
}
