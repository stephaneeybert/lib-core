import { NgModule } from '@angular/core';
import { SAVER, getSaver } from './saver.provider'
import { DownloadProgressMatStatePipe, DownloadProgressMatProgressPipe } from './download.pipe';

@NgModule({
  declarations: [
    DownloadProgressMatStatePipe,
    DownloadProgressMatProgressPipe
  ],
  exports: [
    DownloadProgressMatStatePipe,
    DownloadProgressMatProgressPipe
  ],
  providers: [
    {
      provide: SAVER,
      useFactory: getSaver
    }
  ]
})
export class DownloadModule { }
