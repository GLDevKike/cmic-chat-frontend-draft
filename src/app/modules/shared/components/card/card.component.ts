import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() header!: any;
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() hasFooter: boolean = false;
}
