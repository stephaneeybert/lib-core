export class ProgressTask<T> {

  body: T | null;
  loaded: number;
  total: number;

  constructor(total: number, loaded: number, body?: T) {
    this.loaded = loaded;
    this.total = total;
    if (body) {
      this.body = body;
    }
  }

  public taskIsComplete(): boolean {
    return this.total > 0 && this.total === this.loaded;
  }

}
