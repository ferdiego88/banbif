import { ListItemMaster } from './base/ListItemMaster';
import { Variables } from '../../variables';
import { MailTemplate } from './MailTemplate';
import { Configuration } from './Configuration';
import { IdGroup } from './IdGroup';
import { RolType } from './RolType';
import { Lookup } from './base/Lookup';

import { ProjectType } from './ProjectType';
import { EmailFormat } from './EmailFormat';

export class MasterData extends ListItemMaster {
  configuration: Configuration;
  emailFormat: EmailFormat;

  listIdGroups: IdGroup[];

  listMailTemplates: MailTemplate[];
  listProjectTypes: Lookup[];
  listRols: RolType[];
  listStatusProject: Lookup[];

  constructor() {
    super();

    this.emailFormat = new EmailFormat();
    this.configuration = new Configuration();
    this.listIdGroups = [];
    this.listMailTemplates = [];
    this.listProjectTypes = [];
    this.listRols = [];
    this.listStatusProject = [];
  }

  public static getColumnasSelect(): string[] {
    const campos = [
      Variables.columns.ID,
      Variables.columns.ContentType + '/Name',

      ...Configuration.getColumnasSelect(),

      ...EmailFormat.getColumnasSelect(),

      ...IdGroup.getColumnasSelect(),

      ...MailTemplate.getColumnasSelect(),
      ...ProjectType.getColumnasSelect(),
      ...RolType.getColumnasSelect(),
    ];

    const uniques = [...new Set(campos)];
    return uniques;
  }

  public static getColumnasExpand(): string[] {
    const campos = [
      Variables.columns.ContentType,
      ...Configuration.getColumnasExpand(),
      ...IdGroup.getColumnasExpand(),
    ];
    const uniques = [...new Set(campos)];
    return uniques;
  }
}
