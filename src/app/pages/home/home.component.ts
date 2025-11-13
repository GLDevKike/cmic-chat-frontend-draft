import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IChatRequest,
  IHistory,
} from '../../modules/shared/interfaces/chat.interface';
import { HttpService } from '../../modules/shared/services/http.service';
import { ENVIRONMENT } from '../../../environments/environment';
import { LocalStorageService } from '../../modules/shared/services/local-storage.service';
import { LOCAL_STORAGE_KEY } from '../../modules/shared/constants/local-storage-key.constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  protected form!: FormGroup;
  protected question!: FormControl;
  protected messages: string[] = [];
  protected isLoading: boolean = false;
  protected history: IHistory[] = [];
  private readonly MAX_HISTORY_ITEMS = 10;

  constructor(
    private readonly _httpService: HttpService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.history =
      this._localStorageService.getObject<IHistory[]>(
        LOCAL_STORAGE_KEY.HISTORY
      ) || [];
  }

  protected doSend() {
    this.messages = [];
    this.isLoading = true;

    const question = this.form.value.question;

    const userQuestion: IHistory = {
      role: 'user',
      content: question,
    };

    const prevHistory =
      this._localStorageService.getObject<IHistory[]>(
        LOCAL_STORAGE_KEY.HISTORY
      ) || [];

    const requestHistory = [...prevHistory, userQuestion].slice(
      -this.MAX_HISTORY_ITEMS
    );

    this._httpService
      .postStream<IChatRequest>(ENVIRONMENT.API_URL, {
        message: question,
        history: requestHistory,
      })
      .subscribe({
        next: (chunk) => {
          this.messages.push(chunk);
        },
        complete: () => {
          const assistantResponse: IHistory = {
            role: 'assistant',
            content: this.messages.join(''),
          };

          const updatedHistory = [
            ...prevHistory,
            userQuestion,
            assistantResponse,
          ].slice(-this.MAX_HISTORY_ITEMS);

          this._localStorageService.saveObject(
            LOCAL_STORAGE_KEY.HISTORY,
            updatedHistory
          );

          this.history = updatedHistory;
          this.isLoading = false;
          this.form.reset();
        },
        error: (err) => {
          console.error('Error:', err);
          this.messages = [
            'Lo siento. Ocurrió un error al procesar tu petición.',
          ];
          this.isLoading = false;
        },
      });
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
