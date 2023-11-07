import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreacionUsuariosPage } from './creacion-usuarios.page';

describe('CreacionUsuariosPage', () => {
  let component: CreacionUsuariosPage;
  let fixture: ComponentFixture<CreacionUsuariosPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(CreacionUsuariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
