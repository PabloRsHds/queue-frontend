import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDepartmentComponent } from './card-department.component';

describe('CardDepartmentComponent', () => {
  let component: CardDepartmentComponent;
  let fixture: ComponentFixture<CardDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
