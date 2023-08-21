import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationLoaderService implements TranslateLoader {

  constructor(private http: HttpClient) { }
  getTranslation(lang: string): Observable<any> {
    if(lang==="en"){
      // return this.http.get('/assets/simulateAPI/english.json');
      return this.http.get('/assets/i18n/en.json');
    }else{
      // return this.http.get('/assets/simulateAPI/arabic.json');
      return this.http.get('/assets/i18n/ar.json');
    }
  }

}
