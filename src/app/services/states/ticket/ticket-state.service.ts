import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { CreateTicketDto } from '../../../dtos/ticket/CreateTicketDto';
import { ResponseTicketDto } from '../../../dtos/ticket/ResponseTicketDto';

@Injectable({
  providedIn: 'root'
})
export class TicketStateService {

  // INJECTIONS
  private http = inject(HttpService);

  // STATES
  public ticketInfo = signal<ResponseTicketDto | null>(null);

  public createStatus = signal<'success' | 'error' | 'default'>('default');
  public createMessage = signal('');


  createTicket(request: CreateTicketDto) {

    this.http.createTicket(request).subscribe({

      next: (response) => {
        this.createStatus.set('success');
        this.createMessage.set('Ticket criado com sucesso!');
        this.ticketInfo.set(response);
      },
      error: (error) => {
        this.createStatus.set('error');
        this.createMessage.set('Erro ao criar ticket');
      }
    })
  }


  // RESETS
  resetStatus() {
    this.createStatus.set('default');
  }
}
