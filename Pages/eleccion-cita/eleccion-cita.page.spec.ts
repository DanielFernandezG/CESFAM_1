import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EleccionCitaPage } from './eleccion-cita.page';

describe('EleccionCitaPage', () => {
  let component: EleccionCitaPage;
  let fixture: ComponentFixture<EleccionCitaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EleccionCitaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
