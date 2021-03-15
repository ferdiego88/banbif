import { Lookup } from "./base/Lookup";

export class EFiltroSeguimientoSolicitud {
  SolicitudHipotecario: string;
  NombreTitular: string;
  NumeroDocumento: string;
  Estado: Lookup[];
  EstadoLegal: Lookup[];
  EstadoMiVivienda: Lookup[];

  constructor() {
    this.SolicitudHipotecario = "";
    this.NombreTitular = "";
    this.NumeroDocumento = "";
    this.Estado = [];
    this.EstadoLegal = [];
    this.EstadoMiVivienda = [];
  }
}
