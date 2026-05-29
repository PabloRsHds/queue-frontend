import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-table-users',
  imports: [CommonModule, ɵInternalFormsSharedModule],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css'
})
export class TableUsersComponent implements OnInit {

  ngOnInit(){
    this.userState.loadingAllUsers();
  }
  // Injections
  private userState = inject(UserStateService);

  // States
  public users = this.userState.users;
  public userInfo = this.userState.userInfo;

  public page = this.userState.page;
  public totalPages = this.userState.totalPages;
  public totalElements = this.userState.totalElements;

  // Modals
  public modalRegister: boolean = false;
  public modalUpdate: boolean = false;
  public modalDelete: boolean = false;
  public modalView: boolean = false;

  // Variables
  public dropDown:number | null = null;
  public itemsPerPage = 4;

  // DropDown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    // verifica se clicou dentro do menu
    const clickedInsideDropdown = target.closest('.button-menu-table')
      || target.closest('.drop-down-delete');

    if (!clickedInsideDropdown) {
      this.closeDropDown();
    }
  }
  openDropDown(index: number) {

    if (this.dropDown === index) {
      this.dropDown = null;
      return;
    }

    this.dropDown = index;
  }

  closeDropDown() {
    this.dropDown = null;
  }

  // ====== Modals ========
  openModalRegister() {
  }

  closeModalRegister() {
  }

  openModalUpdate(serviceManagementId: string) {
  }

  closeModalUpdate() {
  }

  openModalDelete(serviceManagementId: string) {
  }

  closeModalDelete() {
  }

  openModalView(serviceManagementId: string) {

  }

  closeModalView() {
  }

  // ===================== SEARCH =====================
  onSearch(event: any) {
    this.userState.setSearch(event.target.value);
  }

  // ===================== PAGINATION =====================
  nextPage() {
    this.userState.nextPage();
  }

  previousPage() {
    this.userState.previousPage();
  }

  goToPage(page: number) {
    this.userState.goToPage(page);
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
    const total = this.totalPages();
    const current = this.page();

    const maxVisible = 4;

    let start = current - Math.floor(maxVisible / 2);
    let end = current + Math.floor(maxVisible / 2) + 1;

    // Ajusta início
    if (start < 0) {
      start = 0;
      end = Math.min(maxVisible, total);
    }

    // Ajusta final
    if (end > total) {
      end = total;
      start = Math.max(0, total - maxVisible);
    }

    return Array.from(
      { length: end - start },
      (_, i) => start + i
    );
  }
}
