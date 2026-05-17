import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStatesService {

  public modalDepartment = signal<boolean>(false);

  constructor() { }
}
