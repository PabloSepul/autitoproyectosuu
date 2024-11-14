import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogradoPage } from './logrado.page';

describe('LogradoPage', () => {
  let component: LogradoPage;
  let fixture: ComponentFixture<LogradoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogradoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
