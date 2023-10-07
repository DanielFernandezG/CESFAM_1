import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDoctorPage } from './home-doctor.page';

describe('HomeDoctorPage', () => {
  let component: HomeDoctorPage;
  let fixture: ComponentFixture<HomeDoctorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeDoctorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
