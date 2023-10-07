import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeSecretariaPage } from './home-secretaria.page';

describe('HomeSecretariaPage', () => {
  let component: HomeSecretariaPage;
  let fixture: ComponentFixture<HomeSecretariaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeSecretariaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
