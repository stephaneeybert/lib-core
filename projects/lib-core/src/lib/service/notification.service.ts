import { Injectable } from '@angular/core';
import { publish, refCount } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _notification: BehaviorSubject<string> = new BehaviorSubject('');
  readonly notification$: Observable<string> = this._notification.asObservable().pipe(publish(refCount()));

  constructor() { }

  notify(message: string) {
    this._notification.next(message);
    setTimeout(() => this._notification.next(''), 3000);
  }

}
