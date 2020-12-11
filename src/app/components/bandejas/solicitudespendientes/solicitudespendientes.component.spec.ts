import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudespendientesComponent } from './solicitudespendientes.component';

describe('SolicitudespendientesComponent', () => {
  let component: SolicitudespendientesComponent;
  let fixture: ComponentFixture<SolicitudespendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudespendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudespendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
