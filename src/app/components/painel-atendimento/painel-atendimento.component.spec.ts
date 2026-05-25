import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelAtendimentoComponent } from './painel-atendimento.component';

describe('PainelAtendimentoComponent', () => {
  let component: PainelAtendimentoComponent;
  let fixture: ComponentFixture<PainelAtendimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PainelAtendimentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelAtendimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
