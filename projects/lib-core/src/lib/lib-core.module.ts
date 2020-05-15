import { NgModule } from '@angular/core';
import { EnvironmenterModule } from 'ng-environmenter';
import { ClickOutsideDirective } from './directive/click-outside.directive';

@NgModule({
  declarations: [
    ClickOutsideDirective
  ],
  imports: [
    EnvironmenterModule
  ],
  exports: [
    ClickOutsideDirective
  ],
})
export class LibCoreModule { }
