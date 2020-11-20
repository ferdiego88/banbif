import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEtapasComponent } from './formulario-etapas.component';

describe('FormularioEtapasComponent', () => {
  let component: FormularioEtapasComponent;
  let fixture: ComponentFixture<FormularioEtapasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioEtapasComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEtapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
