import { Component, OnInit, Input, HostListener } from '@angular/core';

import { FormularioSolicitudComponent } from '../formulario-solicitud.component';

@Component({
  selector: 'app-botonera',
  templateUrl: './botonera.component.html',
  styleUrls: ['./botonera.component.scss']
})
export class BotoneraComponent implements OnInit {
  
  // scrHeight: any;
  screenWidth: any;

  @Input() formularioSolicitudComponent: FormularioSolicitudComponent;
  
  constructor() { 
    this.getScreenSize();
  }
  
  ngOnInit(): void {
    console.log(this.formularioSolicitudComponent);
  }
  
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?): void {
        // this.scrHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        // console.log(this.scrHeight, this.scrWidth);
  }  
}
