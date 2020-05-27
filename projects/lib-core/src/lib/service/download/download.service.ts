import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse, HttpProgressEvent } from '@angular/common/http'
import { Observable, of, asyncScheduler } from 'rxjs';
import { scan, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Saver, SAVER } from './saver.provider';
import { Download } from './download';
import { isHttpProgressEvent, isHttpResponse } from './typeguard';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private httpClient: HttpClient,
    @Inject(SAVER) private save: Saver
  ) { }

  public downloadUrl(url: string, fileName: string): void {
    this.getUrlAsBlob(url)
      .subscribe((blob: Blob) => {
        this.createAndClickDownlowdLink(blob, fileName);
      },
        (error: Error) => {
          console.error(error);
          throw new Error('The file ' + fileName + ' with the url ' + url + ' could not be downloaded.');
        }
      )
  }

  private createAndClickDownlowdLink(blob: Blob, fileName: string): void {
    const a: HTMLAnchorElement = document.createElement('a');
    const objectUrl: string = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  public downloadData(data: Uint8Array, fileName: string): void {
    this.getDataAsBlob(data)
      .subscribe((blob: Blob) => {
        this.createAndClickDownlowdLink(blob, fileName);
      },
        (error: Error) => {
          console.error(error);
          throw new Error('The file ' + fileName + ' could not be downloaded.');
        }
      )
  }

  private getDataAsBlob(data: Uint8Array): Observable<Blob> {
    const CONTENT_TYPE: string = 'application/octet-stream';
    return of(new Blob([data], { type: CONTENT_TYPE }), asyncScheduler);
  }

  private getUrlAsBlob(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob'
    });
  }

  public downloadUrlAsBlobWithProgressAndSaveInFile(url: string, fileName: string): Observable<Download> {
    return this.httpClient.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }).pipe(
      this.rxjsUrlDownload((blob: Blob) => {
        this.save(blob, fileName)
      })
    );
  }

  // The RxJS custom operator returns a function that takes an observable as parameter and that returns another observable
  // The operator also happen to take an optional parameter which is a function that is then used to persist the downloaded content in to a file without coupling the operator to the persistance implementation
  private rxjsUrlDownload(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
    return function(source: Observable<HttpEvent<Blob>>) {
      return source.pipe(
        // The scan operator can accumulate state by receiving the previous returned value of the custom observable
        scan((previous: Download, event: HttpEvent<Blob>): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              // Progress is the number of loaded bytes to the total number of bytes
              progress: event.total ? Math.round((100 * event.loaded) / event.total) : previous.progress,
              state: 'IN_PROGRESS',
              content: null
            }
          }
          if (isHttpResponse(event)) {
            // If a saver function is passed in then call it to persist the downloaded content
            if (saver && event.body) {
              saver(event.body)
            }
            return {
              progress: 100,
              state: 'DONE',
              content: event.body
            }
          }
          return previous
        },
        // Seed the first call to scan with a previous object representing the initial state of the downloading
        { state: 'PENDING', progress: 0, content: null }
        )
      )
    };
  }

}
