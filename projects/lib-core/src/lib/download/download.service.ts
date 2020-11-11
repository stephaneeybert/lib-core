import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http'
import { Observable, of, asyncScheduler } from 'rxjs';
import { scan, map, delay } from 'rxjs/operators';
import { Saver, SAVER } from './saver.provider';
import { Download } from './download';
import { isHttpProgressEvent, isHttpResponse } from './typeguard';
import { ProgressTask } from './progress-task';

export enum PROGRESS_BAR_STATE {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum PROGRESS_BAR_MODE {
  DETERMINATE = 'determinate',
  INDETERMINATE = 'indeterminate',
  BUFFER = 'buffer',
  QUERY = 'query'
}

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

  public downloadObservableDataAsBlobWithProgressAndSaveInFile(progressTask$: Observable<ProgressTask<Uint8Array>>, fileName: string, msDelay: number = 0): Observable<Download> {
    return progressTask$.pipe(
      delay(msDelay),
      this.rxjsBodyAsBlob(),
      this.rxjsDownload((blob: Blob) => {
        this.save(blob, fileName)
      })
    );
  }

  private rxjsBodyAsBlob(): (source: Observable<ProgressTask<Uint8Array>>) => Observable<ProgressTask<Blob>> {
    return function(source: Observable<ProgressTask<Uint8Array>>) {
      return source.pipe(
          map((progressTask: ProgressTask<Uint8Array>) => {
          if (!progressTask.taskIsComplete()) {
            const blobTaskProgress: ProgressTask<Blob> = new ProgressTask<Blob>(progressTask.total, progressTask.loaded, null);
            return blobTaskProgress;
          } else {
            const CONTENT_TYPE: string = 'application/octet-stream';
            const body: Blob = new Blob([progressTask.body], { type: CONTENT_TYPE });
            const blobTaskProgress: ProgressTask<Blob> = new ProgressTask<Blob>(progressTask.total, progressTask.loaded, body);
            return blobTaskProgress;
          }
        })
      )
    }
  }

  private rxjsDownload(saver?: (b: Blob) => void): (source: Observable<ProgressTask<Blob>>) => Observable<Download> {
    return function(source: Observable<ProgressTask<Blob>>) {
      return source.pipe(
        scan((previous: Download, progressTask: ProgressTask<Blob>): Download => {
          if (!progressTask.taskIsComplete()) {
            return {
              progress: progressTask.total ? Math.round((100 * progressTask.loaded) / progressTask.total) : previous.progress,
              state: PROGRESS_BAR_STATE.IN_PROGRESS,
              content: null
            }
          } else {
            if (saver && progressTask.body) {
              saver(progressTask.body)
            }
            return {
              progress: 100,
              state: PROGRESS_BAR_STATE.DONE,
              content: progressTask.body
            }
          }
        },
        {
          progress: 0,
          state: PROGRESS_BAR_STATE.PENDING,
          content: null
        }
        )
      )
    };
  }

  public statePending(state: string): boolean {
    return state == PROGRESS_BAR_STATE.PENDING ? true : false;
  }

  public stateInProgress(state: string): boolean {
    return state == PROGRESS_BAR_STATE.IN_PROGRESS ? true : false;
  }

  public stateDone(state: string): boolean {
    return state == PROGRESS_BAR_STATE.DONE ? true : false;
  }

  public createProgressTask<T>(total: number, loaded: number, body?: T): ProgressTask<T> {
    if (body) {
      return new ProgressTask<T>(total, loaded, body);
    } else {
      return new ProgressTask<T>(total, loaded);
    }
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
  // The operator also happen to take an optional parameter which is a function that is
  // then used to persist the downloaded content in to a file without coupling the operator to the persistance implementation
  private rxjsUrlDownload(saver?: (b: Blob) => void): (source: Observable<HttpEvent<Blob>>) => Observable<Download> {
    return function(source: Observable<HttpEvent<Blob>>) {
      return source.pipe(
        // The scan operator can accumulate state by receiving the previous returned value of the custom observable
        scan((previous: Download, event: HttpEvent<Blob>): Download => {
          if (isHttpProgressEvent(event)) {
            return {
              // Progress is the number of loaded bytes to the total number of bytes
              progress: event.total ? Math.round((100 * event.loaded) / event.total) : previous.progress,
              state: PROGRESS_BAR_STATE.IN_PROGRESS,
              content: null
            }
          }
          if (isHttpResponse(event)) {
            // If a saver function is passed in then call it to persist the downloaded content
            if (saver && event.content) {
              saver(event.content)
            }
            return {
              progress: 100,
              state: PROGRESS_BAR_STATE.DONE,
              content: event.content
            }
          }
          return previous;
        },
        // Seed the first call to scan with a previous object representing the initial state of the downloading
        {
          progress: 0,
          state: PROGRESS_BAR_STATE.PENDING,
          content: null
        }
        )
      )
    };
  }

}
