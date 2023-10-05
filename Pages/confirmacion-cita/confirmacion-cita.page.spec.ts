import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacionCitaPage } from './confirmacion-cita.page';

describe('ConfirmacionCitaPage', () => {
  let component: ConfirmacionCitaPage;
  let fixture: ComponentFixture<ConfirmacionCitaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfirmacionCitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
