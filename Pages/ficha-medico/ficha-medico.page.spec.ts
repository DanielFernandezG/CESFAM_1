import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FichaMedicoPage } from './ficha-medico.page';

describe('FichaMedicoPage', () => {
  let component: FichaMedicoPage;
  let fixture: ComponentFixture<FichaMedicoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FichaMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
