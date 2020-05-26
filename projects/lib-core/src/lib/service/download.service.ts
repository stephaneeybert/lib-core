import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    private httpClient: HttpClient
  ) { }

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

  private getDataAsBlob(data: Uint8Array): Observable<Blob> {
    const CONTENT_TYPE: string = 'application/octet-stream';
    return of(new Blob([data], { type: CONTENT_TYPE }));
  }

  private getUrlAsBlob(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob'
    });
  }

  private createAndClickDownlowdLink(blob: Blob, fileName: string): void {
    const a: HTMLAnchorElement = document.createElement('a');
    const objectUrl: string = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

}
