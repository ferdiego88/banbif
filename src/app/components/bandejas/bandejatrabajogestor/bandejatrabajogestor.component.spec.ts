import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejatrabajogestorComponent } from './bandejatrabajogestor.component';

describe('BandejatrabajogestorComponent', () => {
  let component: BandejatrabajogestorComponent;
  let fixture: ComponentFixture<BandejatrabajogestorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejatrabajogestorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejatrabajogestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
