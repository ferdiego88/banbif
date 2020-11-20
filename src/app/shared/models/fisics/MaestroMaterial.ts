import { User } from './base/User';
import { ListItem } from './base/ListItem';
import { Variables, SPParse } from '../../variables';
import { Lookup } from './base/Lookup';
import { RestFiltros } from '../../RestFiltros';
import { ProductProposalStatus } from './State';
import { ProjectType } from './ProjectType';
import * as moment from "moment"; 
export class MaestroMaterial extends ListItem {

    constructor(
        public Id = 0,
        public Title = '',
        public CodigoSAPQS = 0,
        public TextoBreveMaterial = '',
        public MaestroFLujoEtapaId = 0,
        public AuthorId = 0,
        public CodigoArticuloProveedor = '',
        public CodigoOp = '',
        public CodigoSunat = 0,
        public DuracionTotalConservacion = 0,
        public FechaInicioRegistroSanitario = new Date(),
        public FechaVencimientoRegistroSanitari = new Date(),
        public IdFormaFarmaceutica = -1,
        public IdGrupoArticulo = -1,
        public IdCT1 = -1,
        public IdCT2 = -1,
        public IdCT3 = -1,
        public IdCT4 = -1,
        public IdCategoriaMaterial = -1,
        public IdClaseEtiqueta = -1,
        public IdClasificacionArticulo = -1,
        public IdClasificacionMaterial = -1,
        public IdCondicionAlmacenaje = -1,
        public IdCondicionTemperatura = -1,
        public IdConsignado = -1,
        public IdFormaEtiqueta = -1,
        public IdGrupoCompras = -1,
        public IdIGV = -1,
        public IdIncoterm = -1,
        public IdIndicadorPeriodoPFECaducidad = -1,
        public IdJerarquiProducto1 = -1,
        public IdJerarquiProducto2 = -1,
        public IdJerarquiProducto3 = -1,
        public IdJerarquiProducto4 = -1,
        public IdJerarquiProducto5 = -1,
        public IdMPDIM = -1,
        public IdMPUmPeso = -1,
        public IdMPUmi = -1,
        public IdMarcaRXOTC = -1,
        public IdMarcaRecuperacionDctoR = -1,
        public IdMonedaCompraQs = -1,
        public IdMonedaVenta = -1,
        public IdRefrigerado = -1,
        public IdSector = -1,
        public IdSujetoLote = -1,
        public IdTipoCertificado = -1,
        public IdTipoMaterial = -1,
        public IdUVDIM = -1,
        public IdUVUmPeso = -1,
        public IdUVUmi = -1,
        public IdInventarioCiclico = -1,
        public MPAltura = 0,
        public MPAncho = 0,
        public MPCantidad = 0,
        public MPEAN14 = '0',
        public MPLargo = 0,
        public MPPesoBruto = 0,
        public MPPesoNeto = 0,
        public Marca = '',
        public MargenTeorico = 0,
        public MedidaConcentracion = '',
        public NombreGenerico = '',
        public IdPaisOrigen = -1,
        public PartidaArancelaria = '',
        public PlazoEntregaPrevisto = 0,
        public IdProveedorSAP = -1,
        public RegistroSanitario = '',
        public Sociedad = 0,
        public TiempoCaducidadEnAlmacen = 0,
        public TiempoHastaCaducidad = 0,
        public UVAltura = 0,
        public UVAncho = 0,
        public UVCantidad = 1,
        public UVEanUpc = '0',
        public UVLargo = 0,
        public UVPesoBruto = 0,
        public UVPesoNeto = 0,
        public ValorCompraQS = 0,
        public ValorConcentracion = '',
        public ValorVentaQS = 0,
        public VolumenContenido2 = '',
        public IdGrupoImputacionMaterial = -1,
        public IdPaisCreacion = -1,
        public CentroBeneficio = '',
        public IdReqEspeTecnica = -1,
        public EnBorrador = false,
        public OrgCompra = 0,
        public IdMaestroRutaFlujo = 0,
        public OrgVenta = 0,
        public IdCanalDistribucion = '',
        public CentroSuministrador = 0,
        public IdGrupoTransporte = -1,
        public IdGrupoTipoPosicionGeneral = -1,
        public IdSusceptibleBonEsp = -1,
        public MarcaListaPrecio = false,
        public IdMarcaMostrarPalmWeb = -1,
        public IdMostrarStocks = -1,
        public IdMostrarClientes = -1,
        public IdVerificacionDisponibilidad = -1,
        public IdSusceptibleBonificacion = -1,
        public EjecutivoComercialObj: any[] = [],
        public ResponsableDTObj: any[] = [],
        public ResponsableLaboratorioObj: any[] = [],
        public ResponsableRDMObj: any[] = []
    ) {
      super();
      this.Title = '';
    //   this.TextoBreveMaterial = '';
    //   this.MaestroFlujoEtapaId = 0;
    }
    
    public static getColumnasSelect(): string[] {
        return [
            Variables.columns.ID,
            Variables.columns.Title,
            Variables.columns.TextoBreveMaterial,
            Variables.columns.MaestroFLujoEtapa + "/" + Variables.columns.Title,
            Variables.columns.MaestroFLujoEtapa + "/" + Variables.columns.Abreviatura,
            Variables.columns.MaestroFLujoEtapa + "/" + Variables.columns.Id,
            Variables.columns.ResponsableLaboratorio  + "/" + Variables.columns.Title,
            Variables.columns.EjecutivoComercial + "/" + Variables.columns.Title,
            Variables.columns.ResponsableDT + "/" + Variables.columns.Title,
            Variables.columns.ResponsableRDM + "/" + Variables.columns.Title,
            Variables.columns.Creado,
            Variables.columns.CreadoPor + "/" + Variables.columns.Title,
            Variables.columns.CreadoPor + "/" + Variables.columns.Id,
            Variables.columns.EnBorrador,
            Variables.columns.Modified,
        ]
    }

    public static getColumnasSelectSingle(): string[] {
        return [
            Variables.columns.ID,
            Variables.columns.Title,
            Variables.columns.TextoBreveMaterial,

            `${Variables.columns.MaestroFLujoEtapa}/${Variables.columns.Title}`,
            `${Variables.columns.MaestroFLujoEtapa}/${Variables.columns.Id}`,

            `${Variables.columns.ResponsableLaboratorio}/${Variables.columns.Title}`,
            `${Variables.columns.ResponsableLaboratorio}/${Variables.columns.Id}`,

            `${Variables.columns.EjecutivoComercial}/${Variables.columns.Title}`,
            `${Variables.columns.EjecutivoComercial}/${Variables.columns.Id}`,

            `${Variables.columns.ResponsableDT}/${Variables.columns.Title}`,
            `${Variables.columns.ResponsableDT}/${Variables.columns.Id}`,

            `${Variables.columns.ResponsableRDM}/${Variables.columns.Title}`,
            `${Variables.columns.ResponsableRDM}/${Variables.columns.Id}`,

            Variables.columns.Creado,
            Variables.columns.CreadoPor + "/" + Variables.columns.Title,
            Variables.columns.CreadoPor + "/" + Variables.columns.Id,
            Variables.columns.EnBorrador,
            '*',
            // 'NoExiste'
        ];
    }

    public static getColumnasExpand(): string[] {
        return [

            Variables.columns.MaestroFLujoEtapa,
            Variables.columns.ResponsableLaboratorio,
            Variables.columns.EjecutivoComercial,
            Variables.columns.ResponsableDT,
            Variables.columns.ResponsableRDM,
            Variables.columns.CreadoPor

        ];
    }

    public static parseJson(element: any): MaestroMaterial {
       /* const objeto = new MaestroMaterial();
        objeto.Id = SPParse.getNumber(element[Variables.columns.ID]);
        objeto.Title = SPParse.getString(element[Variables.columns.Title]);
        objeto.TextoBreveMaterial = SPParse.getString(element[Variables.columns.TextoBreveMaterial]);
      */
      //  debugger;
     element.Created = moment(element.Created).format('DD-MM-YYYY');

     if (element.ResponsableDT !== undefined && element.ResponsableDT.length > 0){
        element.ResponsableDT = this.formatearUsuarios(element.ResponsableDT);
     }

     if (element.EjecutivoComercial !== undefined && element.EjecutivoComercial.length > 0){
        element.EjecutivoComercial = this.formatearUsuarios(element.EjecutivoComercial);
     }

     if (element.ResponsableLaboratorio !== undefined && element.ResponsableLaboratorio.length > 0){
        element.ResponsableLaboratorio = this.formatearUsuarios(element.ResponsableLaboratorio);
     }

     if (element.ResponsableRDM !== undefined && element.ResponsableRDM.length > 0){
        element.ResponsableRDM = this.formatearUsuarios(element.ResponsableRDM);
     }

    
        // console.log(element);
        return element;
    }

    public static formatearUsuarios(element: any):string{
        let usuarios: string;
        const listaUsuarios = [];
        element.forEach(obj => {
            // console.log(obj);
            listaUsuarios.push(obj.Title);
        });
        usuarios = listaUsuarios.join(' - ');
        // console.log(usuarios);
        return usuarios
    }

    static getJsonElementoActualizarCampos(){
        const datos = {};
        return datos;
    }

    public setValoresPrueba() {
        this.Title = 'prueba';
        this.CodigoSAPQS = 12;
        this.TextoBreveMaterial = 'prueba';
        // this.MaestroFlujoEtapaId = 0;
        // this.AuthorId = 0;
        this.CodigoArticuloProveedor = 'prueba';
        this.CodigoOp = 'prueba';
        this.CodigoSunat = 21;
        this.DuracionTotalConservacion = 21;
        this.FechaInicioRegistroSanitario = new Date();
        this.FechaVencimientoRegistroSanitari = new Date();
        this.IdFormaFarmaceutica = -1;
        this.IdGrupoArticulo = 830;
        this.IdCT1 = 4981;
        this.IdCT2 = 4997;
        this.IdCT3 = 5090;
        this.IdCT4 = 5358;
        this.IdCategoriaMaterial = 817;
        this.IdClaseEtiqueta = 890;
        this.IdClasificacionArticulo = 772;
        this.IdClasificacionMaterial = 527;
        this.IdCondicionAlmacenaje = 504;
        this.IdCondicionTemperatura = 543;
        this.IdConsignado = 855;
        this.IdFormaEtiqueta = 897;
        this.IdGrupoCompras = 868;
        this.IdIGV = 763;
        this.IdIncoterm = 482;
        this.IdIndicadorPeriodoPFECaducidad = 899;
        this.IdJerarquiProducto1 = 3017;
        this.IdJerarquiProducto2 = 3023;
        this.IdJerarquiProducto3 = 3039;
        this.IdJerarquiProducto4 = 3107;
        this.IdJerarquiProducto5 = 3354;
        this.IdMPDIM = 585;
        this.IdMPUmPeso = 588;
        this.IdMPUmi = 580;
        this.IdMarcaRXOTC = 819;
        this.IdMarcaRecuperacionDctoR = 901;
        this.IdMonedaCompraQs = 910;
        this.IdMonedaVenta = 5769;
        this.IdRefrigerado = 782;
        this.IdSector = 822;
        this.IdSujetoLote = 889;
        this.IdTipoCertificado = 567;
        this.IdTipoMaterial = 793;
        this.IdUVDIM = 585;
        this.IdUVUmPeso = 588;
        this.IdUVUmi = 580;
        this.IdInventarioCiclico = 867;
        this.MPAltura = 12;
        this.MPAncho = 12;
        this.MPCantidad = 12;
        this.MPEAN14 = '12';
        this.MPLargo = 12;
        this.MPPesoBruto = 12;
        this.MPPesoNeto = 12;
        this.Marca = 'prueba';
        this.MargenTeorico = 12;
        this.MedidaConcentracion = 'prueba';
        this.NombreGenerico = 'prueba';
        this.IdPaisOrigen = -1;
        this.PartidaArancelaria = 'prueba';
        this.PlazoEntregaPrevisto = 12;
        this.IdProveedorSAP = 1;
        this.RegistroSanitario = 'prueba';
        this.Sociedad = 12;
        this.TiempoCaducidadEnAlmacen = 12;
        this.TiempoHastaCaducidad = 12;
        this.UVAltura = 12;
        this.UVAncho = 12;
        this.UVCantidad = 12;
        this.UVEanUpc = '12';
        this.UVLargo = 12;
        this.UVPesoBruto = 12;
        this.UVPesoNeto = 12;
        this.ValorCompraQS = 12;
        this.ValorConcentracion = 'prueba';
        this.ValorVentaQS = 12;
        this.VolumenContenido2 = 'prueba';
        this.IdGrupoImputacionMaterial = -1;
        this.IdPaisCreacion = -1;
        this.CentroBeneficio = 'prueba';
        this.IdReqEspeTecnica = 5772;
        this.EnBorrador = false;
        this.OrgCompra = 12;
        this.IdMaestroRutaFlujo = 0;
    }

    public getJsonElemento(): any {
        const datos = {};
        datos[Variables.columns.Title] = this.Title;
        datos[Variables.columns.TextoBreveMaterial] = this.TextoBreveMaterial;
          
        return datos;
    }    
    
}
