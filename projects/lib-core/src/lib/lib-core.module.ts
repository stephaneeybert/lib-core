import { NgModule } from '@angular/core';
import { EnvironmenterModule } from 'ng-environmenter';
import { ClickOutsideDirective } from './directive/click-outside.directive';
import { DownloadModule } from './service/download/download.module';

@NgModule({
  declarations: [
    ClickOutsideDirective
  ],
  imports: [
    EnvironmenterModule,
    DownloadModule
  ],
  exports: [
    ClickOutsideDirective
  ],
})
export class LibCoreModule { }
