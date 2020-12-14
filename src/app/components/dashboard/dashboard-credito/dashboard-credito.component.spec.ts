import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCreditoComponent } from './dashboard-credito.component';

describe('DashboardCreditoComponent', () => {
  let component: DashboardCreditoComponent;
  let fixture: ComponentFixture<DashboardCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
