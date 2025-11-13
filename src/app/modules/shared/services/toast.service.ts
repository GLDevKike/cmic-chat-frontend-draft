import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastSeverity } from '../types/toast.type';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private readonly _messageService: MessageService) {}

  show(severity: ToastSeverity): void {
    this._messageService.add({ severity });
  }
}
