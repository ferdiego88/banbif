import { Lookup } from "./base/Lookup";

export class EFiltroBandejaSolicitud {
  Id: string
  Title: string;
  Author: number;
  Created: Date;
  NombreTitular: string;
  TipoDocumento: number;
  NumeroDocumento: string;
  TipoProducto: number;
  Estado: Lookup[];
  Moneda: number;
  ModalidadPago: number;
  Financiamiento: string;
  Zona: number;
  Oficina: number;
  SustentoIngreso: number;
  FechaEstadoDesde: Date;
  FechaEstadoHasta: Date;
  AnalistaRiesgos: number;

  constructor() {
    this.Id = "";
    this.Title = "";
    this.Author = 0;
    this.Created = null;
    this.NombreTitular = "";
    this.TipoDocumento = 0;
    this.NumeroDocumento = "";
    this.TipoProducto = 0;
    this.Estado = [];
    this.Moneda = 0;
    this.ModalidadPago = 0;
    this.Financiamiento = "";
    this.Zona = 0;
    this.Oficina = 0;
    this.SustentoIngreso = 0;
    this.FechaEstadoDesde = null;
    this.FechaEstadoHasta = null;
    this.AnalistaRiesgos = 0;
  }
}
