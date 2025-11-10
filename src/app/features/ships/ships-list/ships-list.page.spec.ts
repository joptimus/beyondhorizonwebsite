import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipsListPage } from './ships-list.page';

describe('ShipsListPage', () => {
  let component: ShipsListPage;
  let fixture: ComponentFixture<ShipsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
