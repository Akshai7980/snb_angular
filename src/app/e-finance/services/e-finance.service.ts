import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EFinanceService {
  constructor(private http: HttpClient) {}

  getFundedFacilityList(params: any) {
    let reqData = {
      headerValue: {
        moduleId: 'FACILITYDETAILS',
        simulate: `${environment.isSimulate}`,
        sortColumn: params.sortColumn,
        sortOrder: params.sortOrder,
      },
      dataValue: {
        fromRowNo: params.fromRowNo,
        toRowNo: params.toRowNo,
        filterList: [
          {
            filterField: params.filterField,
            filterConstraint: params.filterConstraint,
            facilityLimitFrom: params.facilityLimitFrom,
            facilityLimitTo: params.facilityLimitTo,
            availableAmountFrom: params.availableAmountFrom,
            availableAmountTo: params.availableAmountTo,
            facilityId: params.facilityId,
          },
        ],
        unitId: params.unitId,
        groupBy: '',
        filterFlag: params.filterFlag,
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/eFinanceFundedFacilityList.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }

  getPoSFinanceInquiryCiflkp() {
    let reqData = {
      headerValue: {
        moduleId: 'EFINCIFLKP',
        simulate: `${environment.isSimulate}`,
      },
      dataValue: {
        productName: 'CORESVS',
        subProductName: 'EFININQ',
        functionCode: 'EFINFNC',
      },
      footerValue: {},
    };

    if (environment.localURL) {
      return this.http.get(
        'assets/simulateAPI/eFinanceFundedFacilityCiflkp.json'
      );
    } else {
      return this.http.post(`${environment.restAPI}`, reqData);
    }
  }
}
