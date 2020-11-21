import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissolicitudespendientesComponent } from './missolicitudespendientes.component';

describe('MissolicitudespendientesComponent', () => {
  let component: MissolicitudespendientesComponent;
  let fixture: ComponentFixture<MissolicitudespendientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissolicitudespendientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissolicitudespendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
