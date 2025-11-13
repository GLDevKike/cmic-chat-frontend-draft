import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  saveObject<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): string | null {
    const item = localStorage.getItem(key);

    if (!item) return null;

    return item;
  }

  getObject<T>(key: string): T | null {
    const item = localStorage.getItem(key);

    if (!item) return null;

    return JSON.parse(item) as T;
  }

  remove(key: string): void {
    return localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
