import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerPage } from './ver.page';

describe('VerPage', () => {
  let component: VerPage;
  let fixture: ComponentFixture<VerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
