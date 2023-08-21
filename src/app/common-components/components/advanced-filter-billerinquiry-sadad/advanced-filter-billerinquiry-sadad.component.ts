import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { SadadPaymentService } from 'src/app/sadad/services/sadad-payment.service';

@Component({
  selector: 'app-advanced-filter-billerinquiry-sadad',
  templateUrl: './advanced-filter-billerinquiry-sadad.component.html',
  styleUrls: ['./advanced-filter-billerinquiry-sadad.component.scss']
})
export class AdvancedFilterBillerinquirySadadComponent implements OnInit {

  searchwithin="all";
  @Input() showAdvancedSearchPopup:any;
  isLoadingCompelete: boolean = true;
  billergroupsfromApi: any;
  billerNamefromApi: any;
  billerGroupName: any;
  billerCompanyName: any;
  @Output() advancedSearchParams =new EventEmitter();
  @ViewChild('matRef')
  matRef!: MatSelect;
  @ViewChild('matRefNew')
  matRefNew!: MatSelect;
  englishName=''
  billerName=''
  
  constructor(private sadadService: SadadPaymentService) { }

  ngOnInit(): void {
    this.getBillergroup();
  }

  getBillergroup() {
    this.isLoadingCompelete = false;
    this.sadadService.getSadadBillerGroupsApiCall().subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billergroupsfromApi = data.data;

      }, error => {
        this.isLoadingCompelete = true;
      }

    )
  }

  groupOption(value: any) {
    //  this.isGroupValid = this.groupoption ? true : false;
    this.billerGroupName = value.englishName;
    this.englishName=value.englishName
    this.getBillerName(value.billerGroupCode, value.billergroupId);
  }

  getBillerName(grpcode: any, grpId: any) {

    this.isLoadingCompelete = false;
    this.sadadService.getSadadBillerNamesApiCall(grpcode, grpId).subscribe(
      data => {
        this.isLoadingCompelete = true;
        this.billerNamefromApi = data.data;

      }, error => {
        this.isLoadingCompelete = true;
      }

    )
  }

  BillerNameOption(billervalue: any) {
    this.billerCompanyName = billervalue.billerName;
    this.billerName = billervalue.billerName;
  }

  stopAdvancedSearchClose(event:any){
    event.stopImmediatePropagation();
  }

  onClickClear(){
    this.searchwithin="all";
    this.billerGroupName = '';
    this.billerCompanyName = '';
    this.matRef.options.forEach((data: MatOption) => data.deselect());
    this.matRefNew.options.forEach((data: MatOption) => data.deselect());
  }

  onClickApply(){
    if(this.billerGroupName && this.billerCompanyName){
      let params = {
        billerGroupName: this.billerGroupName,
        billerCompanyName : this.billerCompanyName
      }
      this.advancedSearchParams.emit(params);
      this.showAdvancedSearchPopup = false;
    }

  }
  closeFilter(event:any){
    this.showAdvancedSearchPopup = false; 
  }
}
