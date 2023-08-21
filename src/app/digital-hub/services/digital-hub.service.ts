import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DigitalHubService {
  constructor(private readonly httpClient: HttpClient) {}

  getBanners(): Observable<any> {
    const reqData = {
      headerValue: {
        moduleId: 'GETDIGITALHUBDATA',
      },
      dataValue: {},
      footerValue: {},
    };

    if (environment.localURL) {
      return this.httpClient.get('assets/simulateAPI/digitalHubBanners.json');
    } else {
      return this.httpClient.post(`${environment.logoutAPIPath}`, reqData);
    }
  }
}
