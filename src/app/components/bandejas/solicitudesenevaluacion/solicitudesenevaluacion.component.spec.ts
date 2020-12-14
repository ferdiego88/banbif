import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesenevaluacionComponent } from './solicitudesenevaluacion.component';

describe('SolicitudesenevaluacionComponent', () => {
  let component: SolicitudesenevaluacionComponent;
  let fixture: ComponentFixture<SolicitudesenevaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesenevaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesenevaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
