import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EngineeringPage } from './engineering.page';

describe('EngineeringPage', () => {
  let component: EngineeringPage;
  let fixture: ComponentFixture<EngineeringPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineeringPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
