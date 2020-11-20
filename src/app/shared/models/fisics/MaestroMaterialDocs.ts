import { ListItem } from './base/ListItem';
import { Variables } from '../../variables';
import { environment } from '../../../../environments/environment';

export class MaestroMaterialDocs extends ListItem {
    
    constructor(
        public Nombre = new File([], ''),
        public Oculto = false,
        public InternalName = '',
        public indexFile = -1,
        public urlDownload = '',
        public urlView = '',
        public IdTipoDocumentoAdjunto = -1
    ) {
        super();
    }

    public static getColumnasSelectSingle(): string[] {
        return [
            Variables.columns.File,
            `${Variables.columns.CreadoPor}/${Variables.columns.Title}`,
            `${Variables.columns.CreadoPor}/${Variables.columns.Id}`,
            '*'
        ];
    }

    public static getColumnasExpand(): string[] {
        return [
            Variables.columns.CreadoPor,
            Variables.columns.File
        ];
    }

    public static parse( element: any ): MaestroMaterialDocs {        
        
        const maestroMaterialDoc = new MaestroMaterialDocs( 
            new File([], element.File.Name), element.Oculto, element.InternalName, 0, 
            environment.urlForDownloadTest + element.File.ServerRelativeUrl, element.File.LinkingUrl, element.IdTipoDocumentoAdjunto
        );

        maestroMaterialDoc.Id = element.Id;
        maestroMaterialDoc.Author.Id = element.Author.Id;
        maestroMaterialDoc.Author.Name = element.Author.Title;
        maestroMaterialDoc.Author.Title = element.Author.Title;

        return maestroMaterialDoc;
    }

    public static parseArray( elements: any ): MaestroMaterialDocs[] {
        
        const maestroMaterialDocs: MaestroMaterialDocs[] = elements.map(
            element => this.parse(element)
        );

        return maestroMaterialDocs;
    }
}
