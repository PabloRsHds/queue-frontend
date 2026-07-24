import { Component, computed, effect, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { interval, Subscription } from 'rxjs';
import { TicketStateService } from '../../services/states/ticket/ticket-state.service';
import { ResponseTicketsForAttendanceDto } from '../../dtos/ticket/ResponseTicketsForAttendanceDto';
import { VoiceService } from '../../services/voice/voice.service';
import { AttendentStateService } from '../../services/states/attendent/attendent-state.service';

@Component({
  selector: 'app-queue-display',
  imports: [CommonModule],
  templateUrl: './queue-display.component.html',
  styleUrl: './queue-display.component.css'
})
export class QueueDisplayComponent {

  // Injections
  public userState = inject(UserStateService);
  public ticketState = inject(TicketStateService);
  public attendentState = inject(AttendentStateService);
  private sanitizer = inject(DomSanitizer);
  private voiceService = inject(VoiceService);

  // States
  public userLogged = this.userState.userLogged;
  public ticketForPanel = signal<ResponseTicketsForAttendanceDto | null>(null);
  public historyTickets = this.ticketState.historyTickets;

  private pollingSubscription?: Subscription;
  videoUrl!: SafeResourceUrl;

  ngOnInit(): void {
    this.loadVideo('https://www.youtube.com/watch?v=ofUOATVjKF0&list=RDofUOATVjKF0&start_radio=1');
    this.userState.getUserByToken();

    this.pollingSubscription = interval(5000).subscribe(() => {
      this.loadTicketFromStorage();
      this.ticketState.getHistoryTicketsByAttendant();
    });

    this.pollingSubscription = interval(10000).subscribe(() => {
      this.callCustomer();
    });
  }

  constructor() {};

  public finishedTickets = computed(() =>
    this.historyTickets().filter(ticket => ticket.status === 'FINISHED')
  );

  private loadTicketFromStorage() {

    const ticket = localStorage.getItem('ticketForPanel');
      if(ticket) {
        this.ticketForPanel.set(
          JSON.parse(ticket)
      );
    }
  }

  callCustomer() {

    if (localStorage.getItem('call-customer') === 'true') {
      this.voiceService.speak(this.ticketForPanel()?.customerName+' se dirije ao guiche '+this.userLogged()?.counterNumber);
      localStorage.removeItem('call-customer');
    }
  }

  loadVideo(url: string) {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      console.error('URL do YouTube inválida');
      return;
    }

    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}`
    );
  }

  private extractVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;

    const match = url.match(regex);

    return match ? match[1] : null;
  }
}
