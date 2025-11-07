import { Component, Input } from '@angular/core';
import { TextAreaVariant } from '../../types/text-area.type';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss',
})
export class TextAreaComponent {
  @Input() rows: number = 3;
  @Input() cols: number = 30;
  @Input() autoResize: boolean = true;
  @Input() placeholder: string = 'Type your text here!';
  @Input() variant: TextAreaVariant = 'outlined';
  @Input() control!: FormControl;
}
