import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/common-components/services/common.service';
import { environment } from 'src/environments/environment';
import { PaymentsServiceService } from '../../services/payments-service.service';

@Component({
  selector: 'app-template-guideline',
  templateUrl: './template-guideline.component.html',
  styleUrls: ['./template-guideline.component.scss'],
})
export class TemplateGuidelineComponent implements OnInit {
  fileDetails: any = [];
  currentColumn: any = 'FIELDNAME';
  sortOrder: any = 'desc';
  fromRow: any;
  toRow: any;
  isLoadingCompelete: boolean = true;
  templateGuidelineLoading: boolean = true;
  downloadSection: boolean = true;
  dataSource: any;
  subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'FIELDNAME',
    'MANDATORY/OPTIONAL',
    'Input Parameters',
    'Description',
  ];
  @Input() downloadTemplateData?: any = {};
  @Output() sortColumnEmit: any = new EventEmitter();
  @Input() sortOptions?: any = {};

  constructor(
    private commonService: CommonService,
    private paymentService: PaymentsServiceService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getTemplateGuideline();
  }

  getTemplateGuideline() {
    const params = {
      templateId: this.data.templateId,
      currentColumn: this.currentColumn,
      sortOrder: this.sortOrder,
    };
    this.templateGuidelineLoading = false;
    this.paymentService.getTemplateGuideline(params).subscribe(
      (res: any) => {
        if (res) {
          this.templateGuidelineLoading = true;
          this.fileDetails = [res.data.fileDetails];
          this.dataSource = res.data.fieldList;
        }
      },
      (error) => {
        this.templateGuidelineLoading = false;
      }
    );
  }

  // sortColumn(colName: any) {
  //   if (!this.currentColumn || !this.sortOrder) return;
  //   this.currentColumn = colName;
  //   this.sortOrder === 'desc'
  //     ? (this.sortOrder = 'asc')
  //     : (this.sortOrder = 'desc');
  //   const data = {
  //     sortColumn: this.currentColumn,
  //     sortOrder: this.sortOrder,
  //     fromRow: 0,
  //     toRow: this.toRow - this.fromRow + 1,
  //   };

  //   this.sortColumnEmit.emit(data);
  // }

  sortColumn(colName: any) {
    this.currentColumn = colName;
    if (this.sortOrder === 'desc') {
      this.sortOrder = 'asc';
    } else if (this.sortOrder === 'asc') {
      this.sortOrder = 'desc';
    }
    this.getTemplateGuideline();
  }

  downloadFieldDetail() {
    const moduleId = 'BENGUIDETMPDOWNLD';
    const exportType = 'csv';
    const subPdt = 'BENEUP';
    let url =
      `${environment.restDownloadAPI}` +
      '?moduleId=' +
      moduleId +
      '&export=Y&exportType=' +
      exportType;

    if (this.downloadTemplateData) {
      this.isLoadingCompelete = false;
      this.commonService.exportDocument(url).subscribe(
        (response) => {
          this.isLoadingCompelete = true;
          if (response.status == 200) {
            this.isLoadingCompelete = true;
            window.open(
              `${environment.restDownloadAPI}?moduleId=${moduleId}&subPdt=${subPdt}&templateId=${this.data.templateId}`,
              '_self'
            );
          }
        },
        (error) => {
          this.isLoadingCompelete = true;
          if (error.status == 200) {           
            window.open(
              `${environment.restDownloadAPI}?moduleId=${moduleId}&subPdt=${subPdt}&templateId=${this.data.templateId}`,
              '_self'
            );
          } else {
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
