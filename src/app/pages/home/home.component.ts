import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IChat,
  IChatResponse,
} from '../../modules/shared/interfaces/chat.interface';
import { HttpService } from '../../modules/shared/services/http.service';
import { ENVIRONMENT } from '../../../environments/environment.dev';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public form!: FormGroup;
  public question!: FormControl;
  public response: string | null = null;

  constructor(private readonly _httpService: HttpService) {}

  ngOnInit(): void {
    this.initForm();
  }

  protected async doSend() {
    this.response = null;

    try {
      const response = await this._httpService.post<IChat, IChatResponse>(
        ENVIRONMENT.AGENT_URL,
        {
          pregunta: this.form.value.question,
        }
      );

      console.log('🚀 ~ HomeComponent ~ doSend ~ response:', response);

      this.response = response.respuesta;
    } catch (error) {
      console.error('Error:', error);
      this.response = 'Lo siento. Ocurrió un error al procesar tu petición.';
    }
  }

  private initForm() {
    this.question = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(600),
    ]);

    this.form = new FormGroup({
      question: this.question,
    });
  }
}
