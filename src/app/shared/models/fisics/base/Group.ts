import { Variables } from 'src/app/shared/variables';

export class Group {
  AllowMembersEditMembership: boolean;
  AllowRequestToJoinLeave: boolean;
  AutoAcceptRequestToJoinLeave: boolean;
  Description: string;
  Id: number;
  IsHiddenInUI: boolean;
  LoginName: string;
  OnlyAllowMembersViewMembership: boolean;
  OwnerTitle: string;
  PrincipalType: number;
  RequestToJoinLeaveEmailSetting: string;
  Title: string;

  constructor() {
    this.AllowMembersEditMembership = false;
    this.AllowRequestToJoinLeave = false;
    this.AutoAcceptRequestToJoinLeave = false;
    this.Description = '';
    this.Id = 0;
    this.IsHiddenInUI = false;
    this.LoginName = '';
    this.OnlyAllowMembersViewMembership = false;
    this.OwnerTitle = '';
    this.PrincipalType = 0;
    this.RequestToJoinLeaveEmailSetting = '';
    this.Title = '';
  }

  public static parseJson(element: any): Group {
    const objeto = new Group();
    if (element) {
      objeto.Id = element[Variables.columns.ID];
      objeto.Title = element[Variables.columns.Title];
    }

    return objeto;
  }
}
