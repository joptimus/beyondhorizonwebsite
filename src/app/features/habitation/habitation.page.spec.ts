import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitationPage } from './habitation.page';

describe('HabitationPage', () => {
  let component: HabitationPage;
  let fixture: ComponentFixture<HabitationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
