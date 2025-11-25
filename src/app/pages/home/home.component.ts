import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IChatRequest,
  IChatResponse,
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
export class HomeComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  protected form!: FormGroup;
  protected question!: FormControl;
  protected history: IHistory[] = [];
  protected isLoading: boolean = false;
  protected streamingMessage: string = '';
  protected currentDashboardUrl: string | null = null;
  protected showDashboard: boolean = false;
  protected isDashboardLoading: boolean = false;
  private readonly MAX_HISTORY_ITEMS = 20;
  private shouldScrollToBottom = false;
  private dashboardLoadTimeout: any;

  constructor(
    private readonly _httpService: HttpService,
    private readonly _localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadHistory();
    window.addEventListener('beforeunload', this.unloadHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.unloadHandler);

    if (this.dashboardLoadTimeout) {
      clearTimeout(this.dashboardLoadTimeout);
      this.dashboardLoadTimeout = null;
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  protected async doSend() {
    if (this.form.invalid || this.isLoading) return;

    const question = this.form.value.question.trim();
    if (!question) return;

    this.isLoading = true;

    const userQuestion: IHistory = {
      role: 'user',
      content: question,
    };

    this.history.push(userQuestion);
    this.form.reset();
    this.shouldScrollToBottom = true;

    try {
      const historyToSend = this.history.slice(0, -1).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await this._httpService.post<
        IChatRequest,
        IChatResponse
      >(ENVIRONMENT.API_URL, {
        message: question,
        history: historyToSend.length > 0 ? historyToSend : undefined,
      });

      console.log('🚀 ~ HomeComponent ~ doSend ~ response:', response);

      let messageContent = '';
      let dashboardUrl: string | null = null;

      const filterStatus = response.data?.filter?.status;

      if (response.data?.board?.board_url) {
        dashboardUrl = response.data.board.board_url;
      }

      if (filterStatus === 'valid' && response.success) {
        messageContent =
          response.data.chatbot?.natural_language ||
          'Respuesta procesada correctamente.';
      } else if (filterStatus === 'invalid') {
        const filterMessage =
          response.data.filter?.message || 'La pregunta no es pertinente.';
        const filterSuggestion = response.data.filter?.suggestion || '';

        messageContent = filterMessage;
        if (filterSuggestion) {
          messageContent += `\n\n${filterSuggestion}`;
        }
      } else if (filterStatus === 'incomplete') {
        const filterMessage =
          response.data.filter?.message ||
          'La información proporcionada está incompleta.';
        const filterSuggestion = response.data.filter?.suggestion || '';

        messageContent = filterMessage;
        if (filterSuggestion) {
          messageContent += `\n\n${filterSuggestion}`;
        }
      } else {
        messageContent =
          response.data?.chatbot?.natural_language ||
          response.error ||
          'No se pudo procesar la respuesta';
      }

      const assistantResponse: IHistory = {
        role: 'assistant',
        content: messageContent,
        dashboardUrl: dashboardUrl || undefined,
      };

      this.history.push(assistantResponse);

      if (dashboardUrl) {
        this.isDashboardLoading = true;
        this.currentDashboardUrl = dashboardUrl;
        this.showDashboard = true;

        this.dashboardLoadTimeout = setTimeout(() => {
          this.isDashboardLoading = false;
        }, 4000);
      } else {
        this.showDashboard = false;
        this.currentDashboardUrl = null;
        this.isDashboardLoading = false;
      }

      const truncatedHistory = this.history.slice(-this.MAX_HISTORY_ITEMS);
      this._localStorageService.saveObject(
        LOCAL_STORAGE_KEY.HISTORY,
        truncatedHistory
      );

      this.history = truncatedHistory;
      this.shouldScrollToBottom = true;
    } catch (err) {
      console.error('Error:', err);
      this.history.push({
        role: 'assistant',
        content: 'Lo siento. Ocurrió un error al procesar tu petición.',
      });
      this.shouldScrollToBottom = true;
    } finally {
      this.isLoading = false;
    }
  }

  protected clearHistory() {
    this.history = [];
    this.streamingMessage = '';
    this.currentDashboardUrl = null;
    this.showDashboard = false;
    this.isDashboardLoading = false;

    if (this.dashboardLoadTimeout) {
      clearTimeout(this.dashboardLoadTimeout);
      this.dashboardLoadTimeout = null;
    }

    this._localStorageService.remove(LOCAL_STORAGE_KEY.HISTORY);
  }

  protected closeDashboard() {
    this.showDashboard = false;
    this.currentDashboardUrl = null;
    this.isDashboardLoading = false;

    if (this.dashboardLoadTimeout) {
      clearTimeout(this.dashboardLoadTimeout);
      this.dashboardLoadTimeout = null;
    }
  }

  protected reopenDashboard(url: string) {
    this.currentDashboardUrl = url;
    this.showDashboard = true;
    this.isDashboardLoading = true;

    this.dashboardLoadTimeout = setTimeout(() => {
      this.isDashboardLoading = false;
    }, 4000);
  }

  private loadHistory() {
    this.history =
      this._localStorageService.getObject<IHistory[]>(
        LOCAL_STORAGE_KEY.HISTORY
      ) || [];

    const lastAssistantMessage = [...this.history]
      .reverse()
      .find((msg) => msg.role === 'assistant');

    if (lastAssistantMessage?.dashboardUrl) {
      this.currentDashboardUrl = lastAssistantMessage.dashboardUrl;
      this.showDashboard = true;
    }

    this.shouldScrollToBottom = true;
  }

  private scrollToBottom(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }

  private unloadHandler = () => {
    this._localStorageService.remove(LOCAL_STORAGE_KEY.HISTORY);
  };

  private initForm() {
    this.question = new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(600),
    ]);

    this.form = new FormGroup({
      question: this.question,
    });
  }
}
