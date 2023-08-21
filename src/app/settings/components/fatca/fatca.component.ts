import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { NumberValidation_Omit_Char } from 'src/app/utility/common-utility';
import { SettingsService } from '../../services/settings.service';
import { TranslateService } from '@ngx-translate/core';
import { downloadAsPdf } from 'src/app/utility/downloadAsPdf';
@Component({
  selector: 'app-fatca',
  templateUrl: './fatca.component.html',
  styleUrls: ['./fatca.component.scss'],
})
export class FatcaComponent implements OnInit {
  taxResidency = [
    { name: 'No' },
    { name: 'Yes' },
    { name: 'I refuse to disclose' },
  ];

  saveReceiptObject: any = {};
  selectedCif: any = {};
  receiptData: any = {};
  residency: any = {};
  country3: any = {};
  country1: any = {};
  country2: any = {};
  user: any = {};

  countries: any = [];
  cifLooUp: any = [];

  url: string = '';
  refNo: string = '';
  ChannelId: string = '';
  taxNumber: string = '';
  taxNumber2: string = '';
  taxNumber3: string = '';

  isLoadingCompelete: boolean = true;
  countryDiffError2: boolean = false;
  countryDiffError3: boolean = false;
  countryDiffError1: boolean = false;
  showUserDetails: boolean = false;
  taxNumberErr2: boolean = false;
  taxNumberErr3: boolean = false;
  countryError: boolean = false;
  taxNumberErr: boolean = false;
  showReceipt: boolean = false;
  showReview: boolean = false;
  taxError: boolean = false;

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private readonly settingService: SettingsService,
    private readonly translateService: TranslateService,
    private readonly downloadAsPdf: downloadAsPdf
  ) {}

  ngOnInit(): void {
    this.getCifLooUp();
    this.ChannelId = 'web';
  }

  getCifLooUp() {
    this.isLoadingCompelete = false;
    this.settingService.fetchCifLooUp().subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res && res.dataValue && res.dataValue.length > 0) {
          this.cifLooUp = res.dataValue;
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  fatcaDetails() {
    this.isLoadingCompelete = false;
    this.settingService.fatcaDetailsApi().subscribe(
      (response: any) => {
        this.isLoadingCompelete = true;
        if (response && response.data) {
          this.user = response.data;
          this.showUserDetails = true;
        }
      },
      (error: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  getCountriesList() {
    this.isLoadingCompelete = false;
    this.settingService.getCountriesList().subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (res && res.data && res.data.length > 0) {
          this.countries = res.data;
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }

  onBlurTaxNum(event: any, field: any) {
    if (field && field.countryISOcode === 'US') {
      if (event.target.value && event.target.value.length === 9) {
        this.taxNumberErr = false;
        return;
      }
    } else {
      if (event.target.value && event.target.value.length > 0) {
        this.taxNumberErr = false;
        return;
      }
    }
  }

  onClickCancel() {
    this.residency = {};
    this.country1 = {};
    this.country2 = {};
    this.country3 = {};

    this.taxNumber = '';
    this.taxNumber2 = '';
    this.taxNumber3 = '';
    this.selectedCif = '';

    this.taxError = false;
    this.showReview = false;
    this.showReceipt = false;
    this.taxNumberErr = false;
    this.countryError = false;
    this.taxNumberErr2 = false;
    this.taxNumberErr3 = false;
    this.showUserDetails = false;
    this.countryDiffError1 = false;
    this.countryDiffError2 = false;
    this.countryDiffError3 = false;
    this.isLoadingCompelete = true;
  }

  onClickProceed() {
    if (!this.residency?.name) {
      this.taxError = true;
      return;
    } else if (this.residency.name === 'Yes') {
      if (!this.country1?.countryName) {
        this.countryError = true;
        return;
      }

      if (
        this.country1 &&
        this.country1.countryISOcode === 'US' &&
        this.taxNumber?.length !== 9
      ) {
        this.taxNumberErr = true;
        return;
      }

      if (
        this.country1.countryName &&
        this.country1.countryISOcode !== 'US' &&
        !this.taxNumber
      ) {
        this.taxNumberErr = true;
        return;
      }

      if (
        this.country2 &&
        this.country2.countryISOcode === 'US' &&
        this.taxNumber2?.length !== 9
      ) {
        this.taxNumberErr2 = true;
        return;
      }

      if (
        this.country2.countryName &&
        this.country2.countryISOcode !== 'US' &&
        !this.taxNumber2
      ) {
        this.taxNumberErr2 = true;
        return;
      }

      if (
        this.country3 &&
        this.country3.countryISOcode === 'US' &&
        this.taxNumber3?.length !== 9
      ) {
        this.taxNumberErr3 = true;
        return;
      }

      if (
        this.country3.countryName &&
        this.country3.countryISOcode !== 'US' &&
        !this.taxNumber3
      ) {
        this.taxNumberErr3 = true;
        return;
      }
    }
    this.showReview = true;
  }

  onClickSubmit() {
    if (!this.taxError && !this.countryError) {
      this.isLoadingCompelete = false;
      const params = {
        INPUT_UNIT_ID: this.rootScopeData.userInfo?.UNIT_ID
          ? this.rootScopeData.userInfo.UNIT_ID
          : '',
        INPUT_CIF_NO: this.selectedCif?.cifNo ? this.selectedCif.cifNo : '',
        ESTABLISHMENT_NAME: this.selectedCif?.customerName
          ? this.selectedCif.customerName
          : '',
        OWNER_NAME: this.user?.ownerName ? this.user.ownerName : '',
        NATIONALITY: this.user?.nationality ? this.user.nationality : '',
        COUNTRY_OF_BIRTH: this.user?.country_of_Birth
          ? this.user.country_of_Birth
          : '',
        TAX_RESIDENCY: this.residency?.name ? this.residency.name : '',
        COUNTRY1: this.country1?.countryName ? this.country1.countryName : '',
        COUNTRY1_TAX_ID: this.taxNumber ? this.taxNumber : '',
        COUNTRY2: this.country2?.countryName ? this.country2.countryName : '',
        COUNTRY2_TAX_ID: this.taxNumber2 ? this.taxNumber2 : '',
        COUNTRY3: this.country3?.countryName ? this.country3.countryName : '',
        COUNTRY3_TAX_ID: this.taxNumber3 ? this.taxNumber3 : '',
        FATCACLASS:
          this.residency?.name === 'Yes' || this.residency?.name === 'No'
            ? '02'
            : '03', // if customer selected Yes and No then 02 else it's 03
      };
      this.settingService.fatcaSubmit(params).subscribe(
        (res: any) => {
          this.isLoadingCompelete = true;
          if (
            res &&
            res.dataValue &&
            res.dataValue?.OD_STATUS_DESC &&
            res.dataValue?.OD_STATUS_DESC === 'Success'
          ) {
            this.refNo =
              res.dataValue && res.dataValue.INPUT_REFERENCE_NO
                ? res.dataValue.INPUT_REFERENCE_NO
                : '';
            this.constructReceiptData(this.refNo);
            this.showReceipt = true;
          } else {
            this.isLoadingCompelete = true;
          }
        },
        (error: any) => {
          this.isLoadingCompelete = true;
        }
      );
    }
  }

  onSelectCif(event: any) {
    this.selectedCif = event.value;
    if (event && event.value) {
      this.fatcaDetails();
      this.getCountriesList();
    }
  }

  validate(event: any, type: string) {
    if (event) {
      this.taxError = false;
      this.countryError = false;
      this.taxNumberErr = false;
      this.taxNumberErr2 = false;
      this.taxNumberErr3 = false;
    }

    if (event.value.countryName && type === 'country1' && this.country1) {
      if (
        this.country1?.countryName === this.country2?.countryName ||
        this.country1?.countryName === this.country3?.countryName
      ) {
        this.countryDiffError1 = true;
      } else {
        this.countryDiffError1 = false;
      }
    } else if (
      event.value.countryName &&
      type === 'country2' &&
      this.country2
    ) {
      if (
        this.country2?.countryName === this.country1?.countryName ||
        this.country2?.countryName === this.country3?.countryName
      ) {
        this.countryDiffError2 = true;
      } else {
        this.countryDiffError2 = false;
      }
    } else if (
      event.value.countryName &&
      type === 'country3' &&
      this.country3
    ) {
      if (
        this.country3?.countryName === this.country2?.countryName ||
        this.country3?.countryName === this.country1?.countryName
      ) {
        this.countryDiffError3 = true;
      } else {
        this.countryDiffError3 = false;
      }
    }
  }

  taxvalid(event: any, field: any): boolean {
    if (field && field.name === 'UnitedStates') {
      if (this.taxNumber && this.taxNumber.length !== 9) {
        this.taxNumberErr = false;
      } else {
        this.taxNumberErr = true;
      }
      return NumberValidation_Omit_Char(event);
    } else return true;
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  constructReceiptData(refNo: any) {
    const SaudiResidency = {
      title: 'LBL_SAUDI_TAX_RESIDENCY_NOTE',
    };
    const RefuseTaxResidency = {
      title: 'LBL_REFUSER_SAUDI_TAX_RESIDENCY_NOTE',
    };
    const NonSaudiResidency1 = {
      title: '',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_COUNTRY_1',
          dataKey: (this.country1 && this.country1.countryName) ?? '--',
        },
        {
          dispKey: 'LBL_TAX_NUMBER_COUNTRY_1',
          dataKey: this.taxNumber ?? '--',
        },
        {
          dispKey: ' ',
          dataKey: ' ',
        },
      ],
    };

    const NonSaudiResidency2 = {
      title: '',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_COUNTRY_1',
          dataKey: (this.country1 && this.country1.countryName) ?? '--',
        },
        {
          dispKey: 'LBL_TAX_NUMBER_COUNTRY_1',
          dataKey: this.taxNumber ?? '--',
        },
        {
          dispKey: ' ',
          dataKey: ' ',
        },

        {
          dispKey: 'LBL_COUNTRY_2',
          dataKey: (this.country2 && this.country2.countryName) ?? '--',
        },
        {
          dispKey: 'LBL_TAX_NUMBER_COUNTRY_2',
          dataKey: this.taxNumber ?? '--',
        },
        {
          dispKey: ' ',
          dataKey: ' ',
        },
      ],
    };

    const NonSaudiResidency3 = {
      title: '',
      isTable: 'false',
      data: '',
      fieldDetails: [
        {
          dispKey: 'LBL_COUNTRY_1',
          dataKey: (this.country1 && this.country1.countryName) ?? '--',
        },
        {
          dispKey: 'LBL_TAX_NUMBER_COUNTRY_1',
          dataKey: this.taxNumber ?? '--',
        },
        {
          dispKey: ' ',
          dataKey: ' ',
        },

        {
          dispKey: 'LBL_COUNTRY_2',
          dataKey: (this.country2 && this.country2.countryName) ?? '--',
        },
        {
          dispKey: 'LBL_TAX_NUMBER_COUNTRY_2',
          dataKey: this.taxNumber2 ?? '--',
        },
        {
          dispKey: ' ',
          dataKey: ' ',
        },

        {
          dispKey: 'LBL_COUNTRY_3',
          dataKey: (this.country3 && this.country3.countryName) ?? '--',
        },
        {
          dispKey: 'LBL_TAX_NUMBER_COUNTRY_3',
          dataKey: this.taxNumber3 ?? '--',
        },
        {
          dispKey: ' ',
          dataKey: ' ',
        },
      ],
    };

    this.receiptData = {
      msg1: 'LBL_CONFIRMATION',
      msg2: 'LBL_FATCA_UPDATION_SCSS_MSG',
      referenceNumber: refNo,
      receiptDetails: [
        {
          title: 'LBL_USER_DETAILS',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_CIF',
              dataKey: this.selectedCif?.cifNo ? this.selectedCif.cifNo : '--',
            },
          ],
        },
        {
          title: ' ',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_ESTABLISHMENT_NAME',
              dataKey: this.selectedCif?.customerName
                ? this.selectedCif.customerName
                : '--',
            },
            {
              dispKey: 'LBL_OWNER_NAME',
              dataKey: this.user?.ownerName ? this.user.ownerName : '--',
            },
            {
              dispKey: 'LBL_NATIONALITY',
              dataKey: this.user?.nationality ? this.user.nationality : '--',
            },
            {
              dispKey: 'LBL_COUNTRY_OF_BIRTH',
              dataKey: this.user?.country_of_Birth
                ? this.user.country_of_Birth
                : '--',
            },
          ],
        },
        {
          title: '',
          isTable: 'false',
          data: '',
          fieldDetails: [
            {
              dispKey: 'LBL_TAX_RESIDENCY',
              dataKey: this.residency?.name ? this.residency.name : '--',
            },
          ],
        },
      ],
      printButton: {
        buttonLabel: 'LBL_PRINT_RECEIPT',
        buttonIcon: './assets/images/PrinterIcon.png',
      },
      saveButton: {
        buttonLabel: 'LBL_SAVE_RECEIPT',
        buttonIcon: './assets/images/saveReceipt.svg',
      },
      finishButton: {
        buttonLabel: 'LBL_FINISH',
        buttonPath: '/dashboard',
      },
    };

    if (this.residency.name === 'No') {
      this.receiptData.receiptDetails.push(SaudiResidency);
    } else if (this.residency.name === 'Yes') {
      if (
        this.country1?.countryName &&
        !this.country2?.countryName &&
        !this.country3?.countryName
      ) {
        this.receiptData.receiptDetails.push(NonSaudiResidency1);
      } else if (
        this.country1?.countryName &&
        this.country2?.countryName &&
        !this.country3?.countryName
      ) {
        this.receiptData.receiptDetails.push(NonSaudiResidency2);
      } else if (
        this.country1?.countryName &&
        this.country2?.countryName &&
        this.country3?.countryName
      ) {
        this.receiptData.receiptDetails.push(NonSaudiResidency3);
      }
    } else {
      this.receiptData.receiptDetails.push(RefuseTaxResidency);
    }

    this.saveReceiptObject = {
      pageheading: this.translateService.instant('LBL_CONFIRMATION'),
      subHeading: this.translateService.instant('LBL_TRANSACTION_DETAILS'),
      Description: this.translateService.instant('LBL_FATCA_UPDATION_SCSS_MSG'),
      keyValues: [
        {
          subHead: this.translateService.instant('LBL_CIF'),
          subValue: this.selectedCif?.cifNo ? this.selectedCif.cifNo : '--',
        },
        {
          subHead: this.translateService.instant('LBL_ESTABLISHMENT_NAME'),
          subValue: this.selectedCif?.customerName
            ? this.selectedCif.customerName
            : '--',
        },
        {
          subHead: this.translateService.instant('LBL_OWNER_NAME'),
          subValue: this.user?.ownerName ? this.user.ownerName : '--',
        },
        {
          subHead: this.translateService.instant('LBL_NATIONALITY'),
          subValue: this.user?.nationality ? this.user.nationality : '--',
        },
        {
          subHead: this.translateService.instant('LBL_COUNTRY_OF_BIRTH'),
          subValue: this.user?.country_of_Birth
            ? this.user.country_of_Birth
            : '--',
        },
        {
          subHead: this.translateService.instant('LBL_TAX_RESIDENCY'),
          subValue: this.residency?.name ? this.residency.name : '--',
        },
        {
          subHead: this.translateService.instant('LBL_COUNTRY_1'),
          subValue: (this.country1 && this.country1.countryName) ?? '--',
        },
        {
          subHead: this.translateService.instant('LBL_TAX_NUMBER_COUNTRY_1'),
          subValue: this.taxNumber ?? '--',
        },
        {
          subHead: this.translateService.instant('LBL_COUNTRY_2'),
          subValue: (this.country1 && this.country1.countryName) ?? '--',
        },
        {
          subHead: this.translateService.instant('LBL_TAX_NUMBER_COUNTRY_2'),
          subValue: this.taxNumber ?? '--',
        },
        {
          subHead: this.translateService.instant('LBL_COUNTRY_3'),
          subValue: (this.country2 && this.country2.countryName) ?? '--',
        },
        {
          subHead: this.translateService.instant('LBL_TAX_NUMBER_COUNTRY_3'),
          subValue: this.taxNumber ?? '--',
        },
      ],
      pagecall: 'fatca',
      refNo: refNo,
    };
  }

  downloadPdf(values: any) {
    const pdfData: any = [
      { type: 'setFontSize', size: 11 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'title',
        value:
          this.translateService.instant('LBL_FATCA') +
          this.translateService.instant('LBL_RECEIPT'),
        x: 90,
        y: 35,
      },
      { type: 'setFontSize', size: 10 },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      { type: 'setFontSize', size: 10 },
      { type: 'setFillColor', val1: 128, val2: 128, val3: 128 },
      { type: 'drawRect', x: 15, y: 51, w: 90, h: 6, s: 'F' },
      { type: 'setTextColor', val1: 255, val2: 255, val3: 255 },
      { type: 'setFontSize', size: 10 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_USER_DETAILS'),
        y: 55,
      },
      { type: 'setFontSize', size: 9 },
      { type: 'setTextColor', val1: 0, val2: 0, val3: 0 },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_ESTABLISHMENT_NAME'),
        y: 75,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_OWNER_NAME'),
        y: 85,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_NATIONALITY'),
        y: 95,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_COUNTRY_OF_BIRTH'),
        y: 105,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TAX_RESIDENCY'),
        y: 115,
      },
      { type: 'setFont', fontName: 'helvetica', fontStyle: 'bold' },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_COUNTRY_1'),
        y: 135,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TAX_NUMBER_COUNTRY_1'),
        y: 145,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_COUNTRY_2'),
        y: 155,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TAX_NUMBER_COUNTRY_2'),
        y: 165,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_COUNTRY_3'),
        y: 175,
      },
      {
        type: 'heading',
        value: this.translateService.instant('LBL_TAX_NUMBER_COUNTRY_3'),
        y: 185,
      },
      {
        type: 'text',
        value: this.selectedCif?.customerName
          ? this.selectedCif.customerName
          : '--',
        y: 75,
      },
      {
        type: 'text',
        value: this.user?.ownerName ? this.user.ownerName : '--',
        y: 85,
      },
      {
        type: 'text',
        value: this.user?.nationality ? this.user.nationality : '--',
        y: 95,
      },
      {
        type: 'text',
        value: this.user?.country_of_Birth ? this.user.country_of_Birth : '--',
        y: 105,
      },
      {
        type: 'text',
        value: this.residency?.name ? this.residency.name : '--',
        y: 125,
      },
    ];

    if (this.residency.name === 'No') {
      pdfData.push(
        {
          type: 'heading',
          value: this.translateService.instant('LBL_SAUDI_TAX_RESIDENCY_NOTE'),
          y: 130,
        },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_REF_NUMBER'),
          y: 150,
        },
        { type: 'text', value: this.refNo ? this.refNo : ' ', y: 150 }
      );
    } else if (this.residency.name === 'I refuse to disclose') {
      pdfData.push(
        {
          type: 'heading',
          value: this.translateService.instant(
            'LBL_REFUSER_SAUDI_TAX_RESIDENCY_NOTE'
          ),
          y: 130,
        },
        {
          type: 'heading',
          value: this.translateService.instant('LBL_REF_NUMBER'),
          y: 150,
        },
        { type: 'text', value: this.refNo ? this.refNo : ' ', y: 150 }
      );
    }

    if (values === 'save') {
      pdfData.push({
        type: 'save',
        value: this.translateService.instant('LBL_FATCA') + '.pdf',
      });
    } else if (values === 'print') {
      pdfData.push({
        type: 'print',
        value: this.translateService.instant('LBL_FATCA') + '.pdf',
      });
    }

    this.downloadAsPdf.downloadpdf(pdfData);
  }
}
