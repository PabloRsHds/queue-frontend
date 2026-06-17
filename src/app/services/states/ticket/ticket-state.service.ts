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

  public deleteStatus = signal<'success' | 'error' | 'default'>('default');
  public deleteMessage = signal('');


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

  deleteTicket(request: string) {

    this.http.deleteTicket(request).subscribe({

      next: (response) => {

        this.deleteStatus.set('success');
        this.deleteMessage.set('Ticket deletado com sucesso!');
      },
      error: (error) => {
        this.deleteStatus.set('error');
        this.deleteMessage.set('Erro ao deletar ticket');
      }
    })
  }


  // RESETS
  resetStatus() {
    this.createStatus.set('default');
    this.deleteStatus.set('default');
  }
}
