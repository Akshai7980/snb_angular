import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonInjectServiceService {
  private data = new BehaviorSubject('true');
  data$ = this.data.asObservable();
  constructor() { }


  changeData(data: string) {
    this.data.next(data)
  }
}
