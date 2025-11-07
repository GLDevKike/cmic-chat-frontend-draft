import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { TextareaModule } from 'primeng/textarea';
import { ButtonComponent } from './components/button/button.component';
import { ButtonModule } from 'primeng/button';
import { CardComponent } from './components/card/card.component';
import { CardModule } from 'primeng/card';
import { AppRoutingModule } from "../../app-routing.module";

@NgModule({
  declarations: [TextAreaComponent, ButtonComponent, CardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    ButtonModule,
    CardModule,
    AppRoutingModule
],
  exports: [TextAreaComponent, ButtonComponent, CardComponent],
})
export class SharedModule {}
