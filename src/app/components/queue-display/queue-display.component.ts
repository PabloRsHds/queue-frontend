import { Component, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { interval, Subscription } from 'rxjs';
import { TicketStateService } from '../../services/states/ticket/ticket-state.service';
import { ResponseTicketsForAttendanceDto } from '../../dtos/ticket/ResponseTicketsForAttendanceDto';
import { VoiceService } from '../../services/voice/voice.service';
import { AttendentStateService } from '../../services/states/attendent/attendent-state.service';

@Component({
  selector: 'app-queue-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './queue-display.component.html',
  styleUrl: './queue-display.component.css'
})
export class QueueDisplayComponent {

  // ==================== INJEÇÕES DE DEPENDÊNCIA ====================

  /** Service para gerenciar estado do usuário */
  public userState = inject(UserStateService);

  /** Service para gerenciar estado do ticket */
  public ticketState = inject(TicketStateService);

  /** Service para gerenciar estado do atendente */
  public attendentState = inject(AttendentStateService);

  /** Service para sanitizar URLs e permitir embed seguro */
  private sanitizer = inject(DomSanitizer);

  /** Service para sintetização de voz */
  private voiceService = inject(VoiceService);

  // ==================== PROPRIEDADES DE CONTROLE ====================

  /** Controla visibilidade do campo de inserção de link */
  insertLink = false;

  /** URL inserida pelo usuário para o vídeo */
  urlInput: string = '';

  // ==================== ESTADOS REATIVOS ====================

  /** Usuário atualmente logado */
  public userLogged = this.userState.userLogged;

  /** Ticket atual exibido no painel (signal) */
  public ticketForPanel = signal<ResponseTicketsForAttendanceDto | null>(null);

  /** Histórico de tickets do atendente */
  public historyTickets = this.ticketState.historyTickets;

  // ==================== PROPRIEDADES PRIVADAS ====================

  /** Subscription para polling de atualizações */
  private pollingSubscription?: Subscription;

  /** URL do vídeo sanitizada para embed seguro */
  videoUrl!: SafeResourceUrl;

  /**
   * Inicializa o componente
   * - Carrega vídeo padrão do YouTube
   * - Busca dados do usuário pelo token
   * - Inicia polling para carregar tickets e chamar clientes
   */
  ngOnInit(): void {
    // Carrega vídeo padrão (playlist de música)
    this.loadVideo('https://www.youtube.com/watch?v=ofUOATVjKF0&list=RDofUOATVjKF0&start_radio=1');

    // Busca dados atualizados do usuário autenticado
    this.userState.getUserByToken();

    // Polling a cada 5 segundos para carregar ticket do painel e histórico
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.loadTicketFromStorage();
      this.ticketState.getHistoryTicketsByAttendant();
    });

    // Polling a cada 10 segundos para verificar se deve chamar cliente
    this.pollingSubscription = interval(10000).subscribe(() => {
      this.callCustomer();
    });
  }

  constructor() {};

  // ==================== COMPUTED PROPERTIES ====================

  /**
   * Calcula tickets finalizados do histórico
   * Filtra apenas tickets com status 'FINISHED'
   */
  public finishedTickets = computed(() =>
    this.historyTickets().filter(ticket => ticket.status === 'FINISHED')
  );

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Carrega o ticket do painel a partir do localStorage
   * O ticket é armazenado pela aplicação para persistência entre recargas
   */
  private loadTicketFromStorage() {

    const ticket = localStorage.getItem('ticketForPanel');
      if(ticket) {
        this.ticketForPanel.set(
          JSON.parse(ticket)
      );
    }
  }

  /**
   * Verifica se há flag para chamar o cliente e executa chamada por voz
   * A flag 'call-customer' é definida por outros componentes quando um cliente deve ser chamado
   */
  callCustomer() {

    if (localStorage.getItem('call-customer') === 'true') {
      // Sintetiza voz chamando o cliente para o guichê do atendente
      this.voiceService.speak(this.ticketForPanel()?.customerName+' se dirije ao guiche '+this.userLogged()?.counterNumber);
      // Remove a flag após a chamada
      localStorage.removeItem('call-customer');
    }
  }

  // ==================== MÉTODOS PÚBLICOS ====================

  /**
   * Carrega um vídeo do YouTube a partir da URL fornecida
   * Extrai o ID do vídeo e constrói URL segura para embed
   * @param url - URL completa do vídeo do YouTube
   */
  loadVideo(url: string) {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      console.error('URL do YouTube inválida');
      return;
    }

    // Bypass sanitização para permitir embed do YouTube
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }

  /**
   * Confirma e carrega o link inserido pelo usuário
   * Valida se o campo não está vazio antes de carregar
   */
  confirmLink() {
    if (this.urlInput && this.urlInput.trim() !== '') {
      this.loadVideo(this.urlInput.trim());
    } else {
      // Se o input estiver vazio, apenas fecha o campo
      this.insertLink = false;
    }
  }

  /**
   * Extrai o ID do vídeo de uma URL do YouTube
   * Suporta formatos: youtube.com/watch?v=, youtu.be/, youtube.com/embed/
   * @param url - URL do YouTube
   * @returns ID do vídeo ou null se não encontrado
   */
  private extractVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;

    const match = url.match(regex);

    return match ? match[1] : null;
  }

  /**
   * Fecha o campo de inserção de link quando perde o foco
   * Utiliza setTimeout para evitar conflitos com cliques no botão de confirmação
   */
  onInputBlur() {
    setTimeout(() => {
      this.insertLink = false;
    }, 150);
  }
}
