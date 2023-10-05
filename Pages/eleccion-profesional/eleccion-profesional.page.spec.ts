import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EleccionProfesionalPage } from './eleccion-profesional.page';

describe('EleccionProfesionalPage', () => {
  let component: EleccionProfesionalPage;
  let fixture: ComponentFixture<EleccionProfesionalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EleccionProfesionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
