import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { getPdf } from 'src/app/utility/common-utility';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CardsService } from '../../services/cards.service';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-mada-card-details',
  templateUrl: './mada-card-details.component.html',
  styleUrls: ['./mada-card-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('false', style({ height: '0px', minHeight: '0' })),
      state('true', style({ height: '*' })),
      transition('false <=> true', animate('.3s cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class MadaCardDetailsComponent implements OnInit {

  printSection:string="";
  isLoadingCompelete=true;
  showMadaDetails:string="false";
  rootScopeData: RootScopeDeclare = RootScopeData;
  debitDataObj: any;
  clearFlag=false;
  searchShownFlag = true;
  selectedDebitObj: any;
  selectedTransfer:any;
  selectedMadaCardData:any;
  madaCardImg:any;
  dataSourceToPassLinkAccount:any;
  noRecordFlag:boolean=false;
  displayedColumns: string[] = ['accountId', 'nickname', 'type', 'status'];
  noRecordFoundInfoObj:any;
  constructor(private translateService:TranslateService, private location:Location, private cardsService:CardsService, private domSanitizer: DomSanitizer) { 
    this.rootScopeData.changeHeading = "Review";
  }

  ngOnInit(): void {
    this.printSection="madaCardDetailPagePrint";
    // this.getDebitData();    
    this.rootScopeData.changeHeading = "Review";

    this.noRecordFoundInfoObj = {
      msg: 'LBL_NO_RECORDS_FOUND',
      btnLabel: 'Apply Now',
      btnLink: '/dashboard',
      showBtn: 'true',
      showMsg: 'true',
      showIcon: 'true',
    };
    
    if (this.rootScopeData.selectedMada) {
      this.selectedTransfer = this.rootScopeData.selectedMada;
      this.getMadacardDetail();
    this.getMadaCardImage();
      // console.log(this.rootScopeData.selectedMada,"TEST:::::")
      this.selectedMadaCardData= {
          cardNum: this.rootScopeData.selectedMada?.maskedCardNo,
          nickName: this.rootScopeData.selectedMada?.name,
          status: this.rootScopeData.selectedMada?.status,
          expiryDate: this.rootScopeData.selectedMada?.expiryDate
        }
      // console.log(this.selectedMadaCardData,"LLL::TESTLL::::")
    }
    
  }
  getMadaCardImage(){
    const params={      
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID
      ? this.rootScopeData.userInfo.UNIT_ID
      : '',      
      "productName": "CORESVS",
      "subProdName": "MADASVS",
      "functionCode": "CDINQFNC",
      "cardNumber": this.selectedTransfer?.cardNumber ? this.selectedTransfer?.cardNumber : ""
    };
    this.cardsService.getMadaCardImage(params).subscribe(
      (res: any) => {
        //console.log('res', res);
        this.isLoadingCompelete = true;
        if (
          res 
        ) {
          this.madaCardImg=this.domSanitizer.bypassSecurityTrustUrl("data:image/png;base64, "+res[0].IMAGE_FRONT_CONTENT);
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );    
  }
  getMadacardDetail(){
    this.isLoadingCompelete=false;
    // console.log(this.selectedTransfer,"TESTT:::LLL")
    const params={      
      "unitId": this.rootScopeData?.userInfo?.UNIT_ID
      ? this.rootScopeData.userInfo.UNIT_ID
      : '',      
      "productName": "CORESVS",
      "subProdName": "MADASVS",
      "functionCode": "CDINQFNC",
      "cardNumber": this.selectedTransfer?.pan ? this.selectedTransfer?.pan : ""
    };
    this.cardsService.getMadaCardDetail(params).subscribe(
      (res: any) => {
        //console.log('res', res);
        this.isLoadingCompelete = true;
        if (
          res &&
          res.dataValue 
        ) {
          // console.log(res.dataValue,"TEST:::")
          this.selectedTransfer = res?.dataValue
          this.getLinkedDebitData(this.selectedTransfer)
          // console.log(this.selectedTransfer,"TEST:::LL::KKLL:::")
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }
  toPdf(id:any) {
    getPdf(id,this.translateService,'Mada.pdf')
  }
  onBackArrowClick(){
    this.location.back();
  }
  showhideDetail(){
    this.showMadaDetails = this.showMadaDetails === "true" ? "false" : "true";
    //this.showMadaDetails= !this.showMadaDetails
  }

  getLinkedDebitData(resp:any) {
    // this.isLoadingCompelete=false;
    let res=[];
    res=resp?.linkAccounts?.ownerAccount;
    res.map((test:any, index:number) => {
      (index === 0) ? test.type ="Primary" : test.type ="Linked"
    })

    this.dataSourceToPassLinkAccount=resp?.linkAccounts?.ownerAccount;
    // console.log(testv,"TESTLL:::")

    // this.debitDataObj = {
    //   title: 'LBL_CARDS_LINKED_ACC',
    //   data: resp?.linkAccounts?.ownerAccount,
    //   fieldDetails: [
    //     {
    //       dispKey: 'LBL_ACC_NUMBER',
    //       dataKey: 'accountId',
    //     },
    //     {
    //       dispKey: 'LBL_NICKNAME',
    //       dataKey: 'type',
    //     },              
    //     {
    //       dispKey: 'LBL_ACCOUNT_TYPE',
    //       dataKey: 'type',
    //     },
    //     {
    //       dispKey: 'LBL_ACCOUNT_STATUS',
    //       dataKey: 'status',
    //     }
    //   ],
    // };    
    
    // this.cardsService.getMadaCardLinkedAccountApiCall().subscribe(
    //   (debData: any) => {
    //     if (debData) {
    //       this.isLoadingCompelete = true;
    //       let debitData = debData.DATA.ALL_RECORDS;
    //       this.debitDataObj = {
    //         title: 'LBL_CARDS_LINKED_ACC',
    //         data: debitData,
    //         fieldDetails: [
    //           {
    //             dispKey: 'LBL_ACC_NUMBER',
    //             dataKey: 'OD_ACC_NO',
    //           },
    //           {
    //             dispKey: 'LBL_NICKNAME',
    //             dataKey: 'ALIAS_NAME',
    //           },              
    //           {
    //             dispKey: 'LBL_ACCOUNT_TYPE',
    //             dataKey: 'OD_ACC_TYPE',
    //           },
    //           {
    //             dispKey: 'LBL_ACCOUNT_STATUS',
    //             dataKey: 'STATUS',
    //           }
    //         ],
    //       };
    //     }
    //   },
    //   (_error: any) => {
    //     this.isLoadingCompelete = true;
    //   }
    // );
  }

}
