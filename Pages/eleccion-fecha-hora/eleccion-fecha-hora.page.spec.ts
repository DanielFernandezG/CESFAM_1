import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EleccionFechaHoraPage } from './eleccion-fecha-hora.page';

describe('EleccionFechaHoraPage', () => {
  let component: EleccionFechaHoraPage;
  let fixture: ComponentFixture<EleccionFechaHoraPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EleccionFechaHoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
