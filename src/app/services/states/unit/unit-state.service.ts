import { computed, inject, Injectable, signal } from '@angular/core';
import { ResponseUnitDto } from '../../../dtos/unit/ResponseUnitDto';
import { CreateUnitDto } from '../../../dtos/unit/CreateUnitDto';
import { UpdateUnitDto } from '../../../dtos/unit/UpdateUnitDto';
import { HttpService } from '../../backend/http.service';
import { PageResponse } from '../../../dtos/page/PageResponse';

@Injectable({
  providedIn: 'root'
})
export class UnitStateService {

  // INJECTIONS
  private http = inject(HttpService);

  // STATES
  public units = signal<ResponseUnitDto[]>([]);
  public selectedUnit = signal<ResponseUnitDto | null>(null);

  public createStatus = signal<'success' | 'error' | 'default'>('default');
  public createMessage = signal('');

  public updateStatus = signal<'success' | 'error' | 'default'>('default');
  public updateMessage = signal('');

  public deleteStatus = signal<'success' | 'error' | 'default'>('default');
  public deleteMessage = signal('');

  public loadStatus = signal<'loading' | 'success' | 'error' | 'default'>('default');
  public loadMessage = signal('');

  // PAGINATION
  public page = signal<number>(0);
  public size = signal<number>(4);
  public search = signal<string>('');
  public totalElements = signal<number>(0);
  public totalPages = signal<number>(0);

  // COMPUTED
  public totalUnits = computed(() => this.units().length);
  public activeUnits = computed(() => this.units().filter(u => u.active).length);
  public inactiveUnits = computed(() => this.units().filter(u => !u.active).length);

  // ============================================================
  // GET ALL UNITS
  // ============================================================

  getAllUnits() {
    this.loadStatus.set('loading');
    this.loadMessage.set('Carregando unidades...');

    this.http.getAllUnits(this.page(), this.size(), this.search()).subscribe({
      next: (response: PageResponse<ResponseUnitDto>) => {
        this.units.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loadStatus.set('success');
        this.loadMessage.set('Unidades carregadas com sucesso!');
      },
      error: (error) => {
        this.loadStatus.set('error');
        this.loadMessage.set('Erro ao carregar unidades');
        console.error('Erro ao carregar unidades:', error);
      }
    });
  }

  // ============================================================
  // GET ALL UNITS FOR LOGIN (com size grande)
  // ============================================================

  getAllUnitsForLogin() {
    this.loadStatus.set('loading');
    this.loadMessage.set('Carregando unidades...');

    this.http.getAllUnits(0, 999).subscribe({
      next: (response: PageResponse<ResponseUnitDto>) => {
        this.units.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.loadStatus.set('success');
        this.loadMessage.set('Unidades carregadas com sucesso!');
      },
      error: (error) => {
        this.loadStatus.set('error');
        this.loadMessage.set('Erro ao carregar unidades');
        console.error('Erro ao carregar unidades:', error);
      }
    });
  }

  // ============================================================
  // GET UNIT BY ID
  // ============================================================

  getUnitById(unitId: string) {
    this.loadStatus.set('loading');
    this.loadMessage.set('Carregando unidade...');

    this.http.getUnitById(unitId).subscribe({
      next: (response) => {
        this.selectedUnit.set(response);
        this.loadStatus.set('success');
        this.loadMessage.set('Unidade carregada com sucesso!');
      },
      error: (error) => {
        this.loadStatus.set('error');
        this.loadMessage.set(error.error?.error || 'Erro ao carregar unidade');
        console.error('Erro ao carregar unidade:', error);
      }
    });
  }

  // ============================================================
  // CREATE UNIT
  // ============================================================

  createUnit(request: CreateUnitDto) {
    this.http.createUnit(request).subscribe({
      next: (response) => {
        this.createStatus.set('success');
        this.createMessage.set('Unidade criada com sucesso!');
        this.getAllUnits();
      },
      error: (error) => {
        this.createStatus.set('error');
        this.createMessage.set(error.error?.error || 'Erro ao criar unidade');
        console.error('Erro ao criar unidade:', error);
      }
    });
  }

  // ============================================================
  // UPDATE UNIT
  // ============================================================

  updateUnit(request: UpdateUnitDto) {
    this.http.updateUnit(request).subscribe({
      next: (response) => {
        this.updateStatus.set('success');
        this.updateMessage.set('Unidade atualizada com sucesso!');
        this.getAllUnits();
        if (this.selectedUnit()?.unitId === response.unitId) {
          this.selectedUnit.set(response);
        }
      },
      error: (error) => {
        this.updateStatus.set('error');
        this.updateMessage.set(error.error?.error || 'Erro ao atualizar unidade');
        console.error('Erro ao atualizar unidade:', error);
      }
    });
  }

  // ============================================================
  // DELETE UNIT
  // ============================================================

  deleteUnit(unitId: string) {
    this.http.deleteUnit(unitId).subscribe({
      next: () => {
        this.deleteStatus.set('success');
        this.deleteMessage.set('Unidade excluída com sucesso!');
        this.getAllUnits();
        if (this.selectedUnit()?.unitId === unitId) {
          this.selectedUnit.set(null);
        }
      },
      error: (error) => {
        this.deleteStatus.set('error');
        this.deleteMessage.set(error.error?.error || 'Erro ao excluir unidade');
        console.error('Erro ao excluir unidade:', error);
      }
    });
  }

  // ============================================================
  // SELECT UNIT
  // ============================================================

  selectUnit(unitId: string) {
    const unit = this.units().find(u => u.unitId === unitId);
    if (unit) {
      this.selectedUnit.set(unit);
    } else {
      this.getUnitById(unitId);
    }
  }

  clearSelectedUnit() {
    this.selectedUnit.set(null);
  }

  // ============================================================
  // PAGINATION
  // ============================================================

  setPage(page: number) {
    this.page.set(page);
    this.getAllUnits();
  }

  setSize(size: number) {
    this.size.set(size);
    this.page.set(0);
    this.getAllUnits();
  }

  setSearch(search: string) {
    this.search.set(search);
    this.page.set(0);
    this.getAllUnits();
  }

  nextPage() {
    if (this.page() + 1 < this.totalPages()) {
      this.page.update(p => p + 1);
      this.getAllUnits();
    }
  }

  previousPage() {
    if (this.page() > 0) {
      this.page.update(p => p - 1);
      this.getAllUnits();
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.page.set(page);
      this.getAllUnits();
    }
  }

  // ============================================================
  // RESETS
  // ============================================================

  resetCreateStatus() {
    this.createStatus.set('default');
    this.createMessage.set('');
  }

  resetUpdateStatus() {
    this.updateStatus.set('default');
    this.updateMessage.set('');
  }

  resetDeleteStatus() {
    this.deleteStatus.set('default');
    this.deleteMessage.set('');
  }

  resetLoadStatus() {
    this.loadStatus.set('default');
    this.loadMessage.set('');
  }

  resetAllStatus() {
    this.resetCreateStatus();
    this.resetUpdateStatus();
    this.resetDeleteStatus();
    this.resetLoadStatus();
  }

  // ============================================================
  // REFRESH UNITS
  // ============================================================

  refreshUnits() {
    this.getAllUnits();
  }
}
