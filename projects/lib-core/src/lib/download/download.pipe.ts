import { Pipe, PipeTransform } from '@angular/core';
import { Download } from './download';
import { DownloadService, PROGRESS_BAR_MODE } from './download.service';

@Pipe({name: 'libCoreDownloadProgressMatState'})
export class DownloadProgressMatStatePipe implements PipeTransform {

  constructor(
    private downloadService: DownloadService
  ) { }

  transform(download: Download): string {
    if (download) {
      return this.downloadService.statePending(download.state) ? PROGRESS_BAR_MODE.BUFFER : PROGRESS_BAR_MODE.DETERMINATE;
    } else {
      return PROGRESS_BAR_MODE.INDETERMINATE;
    }
  }
}

@Pipe({name: 'libCoreDownloadProgressMatProgress'})
export class DownloadProgressMatProgressPipe implements PipeTransform {
  transform(download: Download): number {
    if (download) {
      return download.progress;
    } else {
      return 0;
    }
  }
}
