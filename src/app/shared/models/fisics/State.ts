export enum State {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ProductProposalStatus {
  Borrador = 0,
  Iniciado = 2,
  Aprobado = 3,
  Cancelado = 4,
}

export enum StateEvaluationSheetApprover {
  NoIniciado = 'No iniciado',
  Iniciado = 'Iniciado',
  Terminado = 'Terminado',
}

export enum ContentTypeMasterData {
  Approver = 'Approver',
  Categoria = 'Categoria',
  Characteristic = 'Characteristic',
  CharacteristicTemplate = 'CharacteristicTemplate',
  CharacteristicEvaluation = 'CharacteristicEvaluation',
  CharacteristicEvaluationTemplate = 'CharacteristicEvaluationTemplate',
  Configuration = 'Configuration',
  Currency = 'Currency',
  EmailFormat = 'EmailFormat',
  EvaluationScale = 'EvaluationScale',
  GroupingCharacteristic = 'GroupingCharacteristic',
  IdGroup = 'IdGroup',
  MailTemplate = 'MailTemplate',
  ProjectType = 'ProjectType',
  Rol = 'Rol',
}

export enum EvaluationStatus {
  Pendiente = 'Pendiente',
  EnProceso = 'En proceso',
  Aprobado = 'Aprobado',
  Rechazado = 'Rechazado',
  Cancelado = 'Cancelado',
}

export enum EvaluationSheetEstadoAsignacionPermisosFolderPdf {
  Pendiente = 'Pendiente',
  EnProceso = 'En proceso',
  Terminado = 'Terminado',
}

export enum ProjectStatusFolder {
  Pendiente = 'Pendiente',
  EnProceso = 'En proceso',
  Terminado = 'Terminado',
}
export enum EvaluationSheetStatus {
  Aprobada = 'Aprobada',
  Cancelado = 'Cancelado',
  EnBorrador = 'Borrador',
  Enviado = 'Enviado',
  EnviadoAprobacionG1 = 'Enviado a Aprobación G1',
  EnviadoAprobacionG2 = 'Enviado a Aprobación G2',
  Rechazada = 'Rechazada',
}

export enum EvaluationStateFieldDevolucion {
  Devuelto = 'Devuelto',
  Ninguno = 'Ninguno',
  SolicitarDevolucion = 'Solicitar devolución',
}

export enum TypeEvaluationSheetHistorical {
  EnviadoRevision = 'Enviador a evision',
  SolicitarDevolucion = 'Solicitar devolución',
  Devuelto = 'Devuelto',
}

export enum MailTemplateType {
  EvaluacionCompletado = 'Evaluación - Completado',
  EvaluacionEnProceso = 'Evaluación - En proceso',
  ProyectoCreacion = 'Proyecto - Creación',
  HojaEvaluacionEvaluaronAprobadores = 'Hoja de evaluación - Evaluaron aprobadores',
  HojaEvaluacionEvaluaronAprobadoresCompletado = 'Hoja de evaluación - Evaluaron aprobadores completado',
  HojaEvaluacionEnviarProduct = 'Hoja de evaluación - Enviado a Product',
  HojaEvaluacionSolicitarDevolucion = 'Hoja de evaluación - Solicitar devolución',
  HojaEvaluacionDevuelto = 'Hoja de evaluación - Devuelto',
  HojaEvaluacionResultado = 'Hoja de evaluación - Resultado',
}

export enum ModalType {
  Confirm = 'confirm',
  Error = 'error',
  Warning = 'warning',
  WarningWithActions = 'warningWithActions',
  Success = 'success',
}

export enum NotificationGroupType {
  Grupo1 = 'Nivel 1',
  Grupo2 = 'Nivel 2',
}
