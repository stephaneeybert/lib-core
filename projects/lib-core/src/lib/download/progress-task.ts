export class ProgressTask<T> {

  total: number;
  loaded: number;
  body: T | null;

  constructor(total: number, loaded: number, body?: T) {
    this.total = total;
    this.loaded = loaded;
    if (body) {
      this.body = body;
    }
  }

  public taskIsComplete(): boolean {
    return this.total > 0 && this.total === this.loaded;
  }

}
