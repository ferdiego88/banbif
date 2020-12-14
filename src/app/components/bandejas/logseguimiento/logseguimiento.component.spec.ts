import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogseguimientoComponent } from './logseguimiento.component';

describe('LogseguimientoComponent', () => {
  let component: LogseguimientoComponent;
  let fixture: ComponentFixture<LogseguimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogseguimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogseguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
