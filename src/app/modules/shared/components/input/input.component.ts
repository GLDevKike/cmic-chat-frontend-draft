import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  @Input() control!: FormControl;
  @Input() placeholder: string = '';
  @Input() variant: 'outlined' | 'filled' = 'outlined';
  @Output() enterPressed = new EventEmitter<void>();

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enterPressed.emit();
    }
  }
}
