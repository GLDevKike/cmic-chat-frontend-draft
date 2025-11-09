import { Component, Input } from '@angular/core';
import {
  ButtonSeverity,
  ButtonSize,
  ButtonType,
  IconPosition,
} from '../../types/button.type';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label: string = 'Submit';
  @Input() type: ButtonType = 'button';
  @Input() severity!: ButtonSeverity;
  @Input() raised: boolean = false;
  @Input() size!: ButtonSize;
  @Input() icon!: string;
  @Input() iconPosition: IconPosition = 'right';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
}
