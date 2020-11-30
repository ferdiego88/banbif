import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesfinalizadasComponent } from './solicitudesfinalizadas.component';

describe('SolicitudesfinalizadasComponent', () => {
  let component: SolicitudesfinalizadasComponent;
  let fixture: ComponentFixture<SolicitudesfinalizadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesfinalizadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesfinalizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
