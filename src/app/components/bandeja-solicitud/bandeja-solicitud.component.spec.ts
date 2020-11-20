import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaSolicitudComponent } from './bandeja-solicitud.component';

describe('BandejaSolicitudComponent', () => {
  let component: BandejaSolicitudComponent;
  let fixture: ComponentFixture<BandejaSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BandejaSolicitudComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
