import { Injectable } from '@angular/core';
import { MaestroMaterialDocs } from '../models/fisics/MaestroMaterialDocs';
import { Variables } from '../variables';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';
import { Item, IItemAddResult, IItemUpdateResult } from '@pnp/sp/items';
import { Funciones } from '../funciones';

@Injectable({
  providedIn: 'root'
})
export class MaestroMaterialDocsService {

  constructor() { }
  
  async getMaestroMaterialDocs( maestroMaterialId: number ): Promise<MaestroMaterialDocs[]> {
    
    const expandFields = MaestroMaterialDocs.getColumnasExpand();
    const selectFields = MaestroMaterialDocs.getColumnasSelectSingle();
    
    const items = await sp.web.lists.getByTitle( Variables.lists.MaestroMaterialDocs ).items
    .expand(...expandFields).select(...selectFields).filter(`MaestroMaterialId eq ${ maestroMaterialId.toString() } and Oculto eq false`)
    .get();
    
    console.log({adjuntosService: items});
  
    const docs = MaestroMaterialDocs.parseArray( items );

    return docs;
  }

  async guardar(maestroMaterialId: number, maestroMaterialDocs: MaestroMaterialDocs[], grupos: any[], usuarios: any[]): Promise<void> {
    
    maestroMaterialDocs.forEach(
      doc => {
        
        const nameUnique = `${Funciones.generateRandomUniqueName()}.${Funciones.getExtensionOfFileName(doc.Nombre.name)}`;
        
        if (doc.Id === 0) {
          this.agregar( maestroMaterialId, doc.Nombre, nameUnique, grupos, usuarios, doc );
        } else {
          this.actualizar( doc );
        }
      }
    );

  }
  
  async agregar(
    maestroMaterialId: number, file: File, nameUnique: string, grupos: any[], usuarios: any[], doc: MaestroMaterialDocs
  ): Promise<void> {
    const fileAdd = await sp.web.getFolderByServerRelativeUrl(Variables.lists.MaestroMaterialDocs).files.add(nameUnique, file, true);
    const item = await fileAdd.file.getItem();
    await item.update(
      {
        MaestroMaterialId: maestroMaterialId,
        InternalName: file.name,
        IdTipoDocumentoAdjunto: doc.IdTipoDocumentoAdjunto
      }
    );
    // console.log({fileAdd});
    console.log(item['Id']);
    await sp.web.lists.getByTitle(Variables.lists.MasterObjetosPermiso).items.add(
      {
        Title: `${Variables.lists.MaestroMaterialDocs}-${item['Id']}`,
        Lista: Variables.lists.MaestroMaterialDocs,
        TipoObjeto: Variables.constantes.Biblioteca,
        IdElemento: item['Id'],
        UsuariosId: {results: usuarios},
        GruposId: {results: grupos},
        Rol: Variables.columns.RolMaterialesSolicitantes,
        AplicoPermiso: false
      }
    );
  }

  async actualizar( doc: MaestroMaterialDocs): Promise<void> {
    await sp.web.lists.getByTitle(Variables.lists.MaestroMaterialDocs).items.getById( doc.Id ).update(
      {
        Oculto: doc.Oculto,
        IdTipoDocumentoAdjunto: doc.IdTipoDocumentoAdjunto
      }
    );    
  }

}
