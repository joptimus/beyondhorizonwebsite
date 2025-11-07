import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarMapPage } from './star-map.page';

describe('StarMapPage', () => {
  let component: StarMapPage;
  let fixture: ComponentFixture<StarMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StarMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
