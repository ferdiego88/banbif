import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHipotecarioComponent } from './dashboard-hipotecario.component';

describe('DashboardHipotecarioComponent', () => {
  let component: DashboardHipotecarioComponent;
  let fixture: ComponentFixture<DashboardHipotecarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardHipotecarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHipotecarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
