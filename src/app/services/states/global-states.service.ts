import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStatesService {

  public openCardDepartment = signal<boolean>(false);
  public currentSection = signal<'departamento' | 'servico' | 'config'>('departamento');

  public openRegisterDepartment = signal<boolean>(false);
  public openTableDeparments = signal<boolean>(false);

  public openRegisterService = signal<boolean>(false);
  public openTableServices = signal<boolean>(false);

  constructor() { }
}
