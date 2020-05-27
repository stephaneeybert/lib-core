import { NgModule } from '@angular/core';
import { EnvironmenterModule } from 'ng-environmenter';
import { ClickOutsideDirective } from './directive/click-outside.directive';
import { DownloadModule } from './service/download/download.module';
import { DownloadProgressMatStatePipe, DownloadProgressMatProgressPipe } from './service/download/download.pipe';

@NgModule({
  declarations: [
    ClickOutsideDirective
  ],
  imports: [
    EnvironmenterModule,
    DownloadModule
  ],
  exports: [
    ClickOutsideDirective,
    DownloadProgressMatStatePipe,
    DownloadProgressMatProgressPipe
  ],
})
export class LibCoreModule { }
