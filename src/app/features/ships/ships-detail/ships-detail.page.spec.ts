import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShipsDetailPage } from './ships-detail.page';

describe('ShipsDetailPage', () => {
  let component: ShipsDetailPage;
  let fixture: ComponentFixture<ShipsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
