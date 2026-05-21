import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';

@Component({
  selector: 'app-table-services',
  imports: [ CommonModule ],
  templateUrl: './table-services.component.html',
  styleUrl: './table-services.component.css'
})
export class TableServicesComponent {

  // ===== Injections ====
  private globalState = inject(GlobalStatesService);
  private serviceState = inject(ServiceManagementService);
  // =====================

  // ===== States ====
  public openTableServices = this.globalState.openTableServices
  public services = this.serviceState.services;
  public page = this.serviceState.page;
  public totalPages = this.serviceState.totalPages;
  public totalElements = this.serviceState.totalElements;
  public search = this.serviceState.search;

  openTableDeparments = this.globalState.openTableDeparments;
  // =====================

  ngOnInit(){
    this.serviceState.loadServices();
  }

  // ===================== SEARCH =====================
  onSearch(event: any) {
    this.serviceState.setSearch(event.target.value);
  }

  // ===================== PAGINATION =====================

  itemsPerPage = 4;

  nextPage() {
    this.serviceState.nextPage();
  }

  previousPage() {
    this.serviceState.previousPage();
  }

  goToPage(page: number) {
    this.serviceState.goToPage(page);
  }

  getStartIndex(): number {
    return this.page() * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(
      (this.page() + 1) * this.itemsPerPage,
      this.totalElements()
    );
  }

  getPagesArray(): number[] {
    return Array.from(
      { length: this.totalPages() },
      (_, i) => i
    );
  }

}
