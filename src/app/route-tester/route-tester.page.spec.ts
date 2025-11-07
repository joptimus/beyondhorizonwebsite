import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteTesterPage } from './route-tester.page';

describe('RouteTesterPage', () => {
  let component: RouteTesterPage;
  let fixture: ComponentFixture<RouteTesterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteTesterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
