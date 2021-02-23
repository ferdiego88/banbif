import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejatrabajoriesgosComponent } from './bandejatrabajoriesgos.component';

describe('BandejatrabajoriesgosComponent', () => {
  let component: BandejatrabajoriesgosComponent;
  let fixture: ComponentFixture<BandejatrabajoriesgosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejatrabajoriesgosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejatrabajoriesgosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
