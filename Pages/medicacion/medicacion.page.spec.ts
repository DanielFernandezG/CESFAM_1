import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicacionPage } from './medicacion.page';

describe('MedicacionPage', () => {
  let component: MedicacionPage;
  let fixture: ComponentFixture<MedicacionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MedicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
