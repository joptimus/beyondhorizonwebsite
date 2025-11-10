import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalPage } from './medical.page';

describe('MedicalPage', () => {
  let component: MedicalPage;
  let fixture: ComponentFixture<MedicalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
