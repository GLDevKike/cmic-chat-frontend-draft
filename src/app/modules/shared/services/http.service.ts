import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private readonly _httpClient: HttpClient) {}

  public async post<T, K>(url: string, body: T): Promise<K> {
    return lastValueFrom(this._httpClient.post(url, body)) as K;
  }

  public postStream<T>(url: string, body: T): Observable<string> {
    return new Observable((observer) => {
      const controller = new AbortController();

      (async () => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
          });

          if (!response.ok || !response.body) {
            observer.error(`HTTP error ${response.status}`);
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
              if (part.startsWith('data:')) {
                const text = part.replace(/^data:\s*/, '').trim();
                if (text === '[DONE]') {
                  observer.complete();
                  return;
                }
                observer.next(text);
              }
            }
          }

          observer.complete();
        } catch (err) {
          if ((err as any)?.name === 'AbortError') {
            observer.complete();
          } else {
            observer.error(err);
          }
        }
      })();

      return () => {
        controller.abort();
      };
    });
  }
}
