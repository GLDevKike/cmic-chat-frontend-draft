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
export class HomeComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  protected form!: FormGroup;
  protected question!: FormControl;
  protected history: IHistory[] = [];
  protected isLoading: boolean = false;
  protected streamingMessage: string = '';
  protected currentDashboardUrl: string | null = null;
  protected showDashboard: boolean = false;
  protected isDashboardLoading: boolean = false;
  private readonly TEST_DASHBOARD_URL =
    'https://dataviz-dot-mintic-indicadores-calidad-prd.ue.r.appspot.com/CD-historico/?Operador=Movistar&Indicador=Ping&Fecha=2024-01&Tecnolog%C3%ADa=4G&%C3%81mbito=Rural&Departamento=BOL%C3%8DVAR&Municipio=CARTAGENA%20DE%20INDIAS&Localidad=';
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

    this.streamingMessage = '';
    this.isLoading = true;

    const userQuestion: IHistory = {
      role: 'user',
      content: question,
    };

    this.history.push(userQuestion);
    this.form.reset();
    this.shouldScrollToBottom = true;

    try {
      const response = await this._httpService.post<
        IChatRequest,
        IChatResponse
      >(ENVIRONMENT.API_URL, {
        message: question,
      });
      console.log('🚀 ~ HomeComponent ~ doSend ~ response:', response);

      let messageContent = '';
      let dashboardUrl: string | null = null;

      if (response.success && response.data) {
        messageContent =
          response.data['message'] ||
          response.data['titulo'] ||
          JSON.stringify(response.data);

        dashboardUrl =
          response.data['url_filtrada'] ||
          response.data['embed'] ||
          this.TEST_DASHBOARD_URL;
      } else {
        messageContent = response.error || 'No se pudo procesar la respuesta';
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

  private initForm() {
    this.question = new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(600),
    ]);

    this.form = new FormGroup({
      question: this.question,
    });
  }
}
