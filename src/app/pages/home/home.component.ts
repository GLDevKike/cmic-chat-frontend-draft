import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IChatRequest,
  IChatResponse,
} from '../../modules/shared/interfaces/chat.interface';
import { HttpService } from '../../modules/shared/services/http.service';
import { ENVIRONMENT } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public form!: FormGroup;
  public question!: FormControl;
  public response: string | unknown;
  protected isLoading: boolean = false;

  constructor(private readonly _httpService: HttpService) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
  }

  protected async doSend() {
    this.isLoading = true;

    try {
      const { response } = await this._httpService.post<
        IChatRequest,
        IChatResponse
      >(ENVIRONMENT.API_URL, {
        message: this.form.value.question,
      });

      console.log('🚀 ~ HomeComponent ~ doSend ~ response:', response);

      this.response = response;
    } catch (error) {
      console.error('Error:', error);
      this.response = 'Lo siento. Ocurrió un error al procesar tu petición.';
    } finally {
      this.isLoading = false;
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
