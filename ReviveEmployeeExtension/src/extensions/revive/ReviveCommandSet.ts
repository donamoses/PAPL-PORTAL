import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import { assign } from '@uifabric/utilities';
import "@pnp/sp/site-groups";
import { sp } from "@pnp/sp";
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters,
  RowAccessor
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';
import * as strings from 'ReviveCommandSetStrings';
import CustomPanel, { ICustomPanelProps } from "./loc/RevivePanel";
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IReviveCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
  pagerelativeUrl:string;
  sourcerelativeUrl:string;
}
export interface IWorkflowData {
  EmpId: any;
 Status:any;
}
const LOG_SOURCE: string = 'ReviveCommandSet';

export default class ReviveCommandSet extends BaseListViewCommandSet<IReviveCommandSetProperties> {
  private panelPlaceHolder: HTMLDivElement = null;
  @override
  public onInit(): Promise<void> {
   // this.properties.pagerelativeUrl = "/sites/MyPeople/SitePages/Ex-Employees.aspx";
    this.properties.sourcerelativeUrl="/sites/MyPeople/Lists/Employees/ExEmployees.aspx";
    
    this.panelPlaceHolder = document.body.appendChild(document.createElement("div"));
    Log.info(LOG_SOURCE, 'Initialized ReviveCommandSet');
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    let Listurl = this.context.pageContext.list.title;
    let Pageurl = this.context.pageContext.site.serverRequestPath;
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    const comparetwoCommand: Command = this.tryGetCommand('COMMAND_2');
    comparetwoCommand.visible=false;
    if (compareOneCommand) {
      this.properties.sourcerelativeUrl="/sites/MyPeople/Lists/Employees/ExEmployees.aspx";
      var Libraryurl = this.context.pageContext.list.serverRelativeUrl+"/ExEmployees.aspx";
      console.log(Libraryurl);
      let Listurl = this.context.pageContext.list.title;
      let Pageurl = this.context.pageContext.site.serverRequestPath;
    
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = (event.selectedRows.length === 1 &&this.userGlobal==1 && (Libraryurl == this.properties.sourcerelativeUrl));
      compareOneCommand.visible = event.selectedRows.length === 1;
    }
  }
  public _showPanel() {
    this._renderPanelComponent({
      isOpen: true,
      listItemId: this.listitemId,
      onClose: this._dismissPanel,     
      ID: this.ID,    
      EmpName:this.EmployeeName,
      Status:this.Status
    });

  }
  private _dismissPanel = () => {
    this._renderPanelComponent({ isOpen: false });
  }
private  userGlobal;
  public update = async () => {
    // console.log("Submit");
    let LoginUser;
    let docid;
    
    sp.web.currentUser.get().then((r) => {
    LoginUser = r["Title"];
    console.log(r["Title"]);
    
    docid = r["Id"];
    });
    
    
    const users = await sp.web.siteGroups.getByName("HR Manager").users();
    console.log(users);
    
    for (let i = 0; i < users.length; i++) {
    if(users[i].Title==LoginUser)
    {
    console.log("In group");
    this.userGlobal=0;
    break;
    
    
    }
    else{
    console.log("Not in group");
    this.userGlobal=1;
    
    }
    
    }
    
    
    
    }
  public _renderPanelComponent(props: any) {

    const element: React.ReactElement<ICustomPanelProps> = React.createElement(CustomPanel,assign({

      onClose: null,

      isOpen: false,

      listItemId: null,
   
      ID: null,
      EmpName:null,
      Status:null

    }, props));

    ReactDom.render(element, this.panelPlaceHolder);

  }
  //@override
  private defaultvaluearray: IWorkflowData[] = [];
  private listitemId;
  private Status;
  private ID;
  private EmployeeName;

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_1':
       // Dialog.alert(`${this.properties.sampleTextOne}`);
       event.selectedRows.forEach(async (row: RowAccessor, index: number) => {

        let selectedItem = event.selectedRows[0];

        this.Status = selectedItem.getValueByName("Status");
         this.ID = selectedItem.getValueByName("ID");
         this.EmployeeName=selectedItem.getValueByName("FullName");
        
        
         if(selectedItem.getValueByName("ActiveEmployee")=="1")
         {
          this.Status='Yes';
         }
         else if(selectedItem.getValueByName("ActiveEmployee")=="0")
         {
          this.Status='No';
         }
         else
         {
          this.Status=selectedItem.getValueByName("ActiveEmployee");
         }
        this._showPanel();
       });
        break;
      case 'COMMAND_2':
       // Dialog.alert(`${this.properties.sampleTextTwo}`);
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
