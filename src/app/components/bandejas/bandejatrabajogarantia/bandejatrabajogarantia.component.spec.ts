import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejatrabajoComponent } from './bandejatrabajo.component';

describe('BandejatrabajoComponent', () => {
  let component: BandejatrabajoComponent;
  let fixture: ComponentFixture<BandejatrabajoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejatrabajoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejatrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
