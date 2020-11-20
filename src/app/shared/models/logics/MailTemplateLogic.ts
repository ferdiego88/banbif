import { Variables } from '../../variables';
import { environment } from 'src/environments/environment';

export class MailTemplateLogic {
  static readonly etiquetas = {
    Codigo: '[Código]',
    Comentarios: '[Comentarios]',
    Cuerpo: '[Cuerpo]',
    EstadoAprobacion: '[EstadoAprobacion]',
    EvaluacionCaracteristicas: '[EvaluacionCaracteristicas]',
    FechaCompletoEvaluacion: '[FechaCompletoEvaluacion]',
    FechaInicio: '[FechaInicio]',
    FechaVencimiento: '[FechaVencimiento]',
    Motivo: '[Motivo]',
    NombreEvaluador: '[NombreEvaluador]',
    NombreHojaEvaluacion: '[NombreHojaEvaluacion]',
    NombreSolicitante: '[NombreSolicitante]',
    Tabla: '[Tabla]',
    Titulo: '[Título]',
    UrlA: '#UrlA',
    UrlB: '#UrlB',
  };
}
