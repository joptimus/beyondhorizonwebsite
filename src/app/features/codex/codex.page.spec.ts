import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodexPage } from './codex.page';

describe('CodexPage', () => {
  let component: CodexPage;
  let fixture: ComponentFixture<CodexPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CodexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
