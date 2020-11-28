import { Injectable } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public is(value: any): boolean {
    return coerceBooleanProperty(value);
  }

  public isSet(value: any): boolean {
    return value != undefined && value != null && (Array.isArray(value) || !isNaN(value));
  }

  public isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  public normalizeName(name: string): string {
    return name ? name.replace(/\s/g, '') : '';
  }

  public getRandomIntegerBetweenAndExcept(min: number, max: number, except: Array<number>): number {
    let random: number;
    do {
      random = this.getRandomIntegerBetween(min, max);
    } while (except.includes(random));
    return random;
  }

  public getRandomIntegerBetween(min: number, max: number): number {
    return Math.floor(Math.random() * max) + min;
  }

  public getRandomString(length: number): string {
    const start: number = 2;
    return Math.random().toString(36).substring(start, start + length);
  }

  public sleep(milliseconds: number): void {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

}
