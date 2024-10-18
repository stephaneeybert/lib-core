import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from './directive/click-outside.directive';
import { DownloadModule } from './download/download.module';
import { DownloadProgressMatStatePipe, DownloadProgressMatProgressPipe } from './download/download.pipe';

@NgModule({
  declarations: [
    ClickOutsideDirective
  ],
  imports: [
    DownloadModule
  ],
  exports: [
    ClickOutsideDirective,
    DownloadProgressMatStatePipe,
    DownloadProgressMatProgressPipe
  ],
})
export class LibCoreModule { }
