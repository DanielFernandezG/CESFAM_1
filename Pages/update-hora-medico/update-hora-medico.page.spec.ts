import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateHoraMedicoPage } from './update-hora-medico.page';

describe('UpdateHoraMedicoPage', () => {
  let component: UpdateHoraMedicoPage;
  let fixture: ComponentFixture<UpdateHoraMedicoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UpdateHoraMedicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
