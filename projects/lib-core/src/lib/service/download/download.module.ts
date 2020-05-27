import { NgModule } from '@angular/core';
import { SAVER, getSaver } from './saver.provider'

@NgModule({
  providers: [
    { provide: SAVER, useFactory: getSaver }
  ]
})
export class DownloadModule { }
