import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPruebaPage } from './datos-prueba.page';

describe('DatosPruebaPage', () => {
  let component: DatosPruebaPage;
  let fixture: ComponentFixture<DatosPruebaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosPruebaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
