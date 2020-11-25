import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid-loader',
  templateUrl: './grid-loader.component.html',
  styleUrls: ['./grid-loader.component.scss']
})
export class GridLoaderComponent implements OnInit {

  cargando: boolean = true;

  @Input() set isCargando(value: boolean) {
    this.cargando = value;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
