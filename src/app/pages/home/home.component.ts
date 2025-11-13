import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
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
export class HomeComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  protected form!: FormGroup;
  protected question!: FormControl;
  protected history: IHistory[] = [];
  protected isLoading: boolean = false;
  protected streamingMessage: string = '';
  private readonly MAX_HISTORY_ITEMS = 20;
  private shouldScrollToBottom = false;

  constructor(
    private readonly _httpService: HttpService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadHistory();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  protected doSend() {
    if (this.form.invalid || this.isLoading) return;

    const question = this.form.value.question.trim();
    if (!question) return;

    this.streamingMessage = '';
    this.isLoading = true;

    const userQuestion: IHistory = {
      role: 'user',
      content: question,
    };

    this.history.push(userQuestion);
    this.form.reset();
    this.shouldScrollToBottom = true;

    const prevHistory = this.history.slice(0, -1);
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
          this.streamingMessage += chunk;
          this.shouldScrollToBottom = true;
        },
        complete: () => {
          const assistantResponse: IHistory = {
            role: 'assistant',
            content: this.streamingMessage,
          };

          this.history.push(assistantResponse);
          this.streamingMessage = '';

          const truncatedHistory = this.history.slice(-this.MAX_HISTORY_ITEMS);
          this._localStorageService.saveObject(
            LOCAL_STORAGE_KEY.HISTORY,
            truncatedHistory
          );

          this.history = truncatedHistory;
          this.isLoading = false;
          this.shouldScrollToBottom = true;
        },
        error: (err) => {
          console.error('Error:', err);
          this.history.push({
            role: 'assistant',
            content: 'Lo siento. Ocurrió un error al procesar tu petición.',
          });
          this.streamingMessage = '';
          this.isLoading = false;
          this.shouldScrollToBottom = true;
        },
      });
  }

  protected clearHistory() {
    this.history = [];
    this.streamingMessage = '';
    this._localStorageService.remove(LOCAL_STORAGE_KEY.HISTORY);
  }

  private loadHistory() {
    this.history =
      this._localStorageService.getObject<IHistory[]>(
        LOCAL_STORAGE_KEY.HISTORY
      ) || [];
    this.shouldScrollToBottom = true;
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private initForm() {
    this.question = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(600),
    ]);

    this.form = new FormGroup({
      question: this.question,
    });
  }
}
