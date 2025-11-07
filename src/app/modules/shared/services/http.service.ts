import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private readonly _httpClient: HttpClient) {}

  public async post<T, K>(url: string, body: T): Promise<K> {
    return lastValueFrom(this._httpClient.post(url, body)) as K;
  }
}
