import { Pipe, PipeTransform } from '@angular/core';
import { Download } from './download';

@Pipe({name: 'libCoreDownloadProgressMatState'})
export class DownloadProgressMatStatePipe implements PipeTransform {
  transform(download: Download): string {
    return download.state == 'PENDING' ? 'buffer' : 'determinate';
  }
}

@Pipe({name: 'libCoreDownloadProgressMatProgress'})
export class DownloadProgressMatProgressPipe implements PipeTransform {
  transform(download: Download): number {
    return download.progress;
  }
}
