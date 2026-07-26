import { computed, inject, Injectable, signal } from '@angular/core';
import { ResponseUnitDto } from '../../../dtos/unit/ResponseUnitDto';
import { CreateUnitDto } from '../../../dtos/unit/CreateUnitDto';
import { UpdateUnitDto } from '../../../dtos/unit/UpdateUnitDto';
import { HttpService } from '../../backend/http.service';

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

  // COMPUTED
  public totalUnits = computed(() => this.units().length);
  public activeUnits = computed(() => this.units().filter(u => u.active).length);
  public inactiveUnits = computed(() => this.units().filter(u => !u.active).length);

  // ============================================================
  // GET ALL UNITS
  // ============================================================

  getAllUnits() {
    this.http.getAllUnits().subscribe({
      next: (response) => {
        this.units.set(response);
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
  // CREATE UNIT
  // ============================================================

  createUnit(request: CreateUnitDto) {
    this.http.createUnit(request).subscribe({
      next: (response) => {
        this.createStatus.set('success');
        this.createMessage.set('Unidade criada com sucesso!');
        this.units.update(units => [...units, response]);
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
        this.units.update(units =>
          units.map(unit =>
            unit.unitId === response.unitId ? response : unit
          )
        );
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
        this.units.update(units =>
          units.filter(unit => unit.unitId !== unitId)
        );
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
    }
  }

  clearSelectedUnit() {
    this.selectedUnit.set(null);
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
