import * as React from 'react';
import styles from './Organizationalchart.module.scss';
import { IOrganizationalchartProps } from './IOrganizationalchartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import OrgChart from 'react-orgchart';
import { IDataNode, OrgChartNode } from './OrgChartNode';
import {IOrgChartItem, ChartItem,DepartmentItem} from './IOrgChartItem';
import {IOrganizationalchartState} from './IOrganizationalChartState';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { Dropdown ,IDropdownOption} from "office-ui-fabric-react/lib/Dropdown";
import { Image} from "office-ui-fabric-react/lib/Image";
import { sp, IList, Web, Lists } from "@pnp/sp/presets/all";
import {
  css,
  Persona,
  PersonaSize,
  PersonaPresence,
  Spinner
} from 'office-ui-fabric-react';


export default class Organizationalchart extends React.Component<IOrganizationalchartProps,IOrganizationalchartState, {}> {
  constructor(props: IOrganizationalchartProps, state: IOrganizationalchartState){
    super(props);
    this.state={
      orgChartItems:[],
      DeptID:'',
      DepartmentArray:[],UserId:''
    };
    this.BindDepartments();
    this.GetDepartmentID();
   // this.processOrgChartItems();

  }
  public render(): React.ReactElement<IOrganizationalchartProps> {
    return (
      <div>
        <div>
         <Dropdown
              placeHolder="Select Department"
              required={true}
              onChanged={this._ChangDepartment}
              options={this.state.DepartmentArray}

          />
          </div>
      <div className={ styles.organizationalchart } style={{display:(this.state.orgChartItems.length == 0 ? 'none':'block'), border: '1px',borderStyle: "solid",marginTop:"10px", borderColor:"black",borderWidth:"1px",borderRadius:"8px",padding:"20px"}}>


             <OrgChart className={styles.orgtree} tree={this.state.orgChartItems}  NodeComponent={this.MyNodeComponent}/>


           </div>


           </div>
    );
  }
  private _ChangDepartment = (item:IDropdownOption): void => {

    this.setState({DeptID:item.key+'',orgChartItems:[]})
    this.processOrgChartItems(item.key);
    }
  private MyNodeComponent=({node})=>{
   let profileimage:any;
   let Designation:any;
   let iscurrentuser:boolean=false;
   
   if(node.url!=null)
   {
     profileimage=node.url.Url;
   }
   else{
     profileimage=node.url;
     
   }
   if(node.Designation!=null)
   {
    Designation=node.Designation.Title;
   }
   if(node.UserName==this.state.UserId)
   {
    iscurrentuser=true;
   
    // node.setXPosition(100.0);
    // node.setYPosition(100.0);
   
   }
      return (
       // //style={{backgroundColor:(iscurrentuser ? '#C0C0C0':'')}}
       <div className="initechNode"  style={{backgroundColor:(iscurrentuser ? '#C0C0C0':'')}}>
         <Persona id="PersonaID"
        primaryText={node.FullName}
        secondaryText={Designation}
        imageUrl={profileimage}
        size={PersonaSize.small}
        presence={PersonaPresence.none}
         /></div>
      );
    }
    private BindDepartments()
    {
      var DeptArray:IDropdownOption[]=[];
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('Department')/items?$select=Title,Id`,
SPHttpClient.configurations.v1,
{
  headers: {
    'Accept': 'application/json;odata=nometadata',
    'odata-version': ''
  }
})
.then((response1: SPHttpClientResponse): Promise<{ value: DepartmentItem[] }> => {
  return response1.json();
})
.then((response1: { value: DepartmentItem[] }): void => {
 // resolve(response.value);
  console.log("response.value"+response1.value);
  for(var k in response1.value)
  {
    DeptArray.push({
      key: ''+response1.value[k].Id,
      text: ''+response1.value[k].Title
    });

  }
  this.setState({
    DepartmentArray: DeptArray
  });
}, (error: any): void => {
 // reject(error);
});
    }
private async GetDepartmentID()
{


  let userId=0;
  let deptID=0;
 const user=await sp.web.currentUser.get()
    userId=user.Id;
    console.log(user);
  //  return user;

this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=FullName,Id,ImageURL,ReportingOfficer/Id,ReportingOfficer/FullName,Department/Id,Department/Title,UserName/Id,UserName/Title&$expand=ReportingOfficer/Id,UserName/Id,Department,UserName,Department/Title&$filter=UserName/Id eq `+userId,
SPHttpClient.configurations.v1,
{
  headers: {
    'Accept': 'application/json;odata=nometadata',
    'odata-version': ''
  }
})
.then((response1: SPHttpClientResponse): Promise<{ value: IOrgChartItem[] }> => {
  return response1.json();
})
.then((response1: { value: IOrgChartItem[] }): void => {
 // resolve(response.value);
 // console.log("response.value"+response1.value);
  deptID=response1.value[0].Department.Id;
 // console.log("deptID"+deptID);
  this.setState({
    DeptID: deptID+'',
    UserId:userId+''
  });
  this.processOrgChartItems(deptID);
}, (error: any): void => {
 // reject(error);
});
}
  private async readOrgChartItems(deptID): Promise<IOrgChartItem[]> {


    return new Promise<IOrgChartItem[]>((resolve: (itemId: IOrgChartItem[]) => void, reject: (error: any) => void): void => {
     // this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=FullName,Id,ImageURL,UserName/Id,UserName/Email,UserName/Title,ReportingOfficer/Id,ReportingOfficer/FullName&$expand=ReportingOfficer/Id,UserName/Id&$orderby=ReportingOfficer/Id asc`,
     this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=FullName,Id,ImageURL,ReportingOfficer/Id,ReportingOfficer/FullName,Department/Id,Department/Title,Designation/Id,Designation/Title,UserName/Id,UserName/Title&$expand=ReportingOfficer/Id,Department,Department/Title,Designation,Designation/Title,UserName/Id,UserName/Title&$orderby=ReportingOfficer/Id asc&$filter=Department/Id eq `+deptID,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse): Promise<{ value: IOrgChartItem[] }> => {
        return response.json();
      })
      .then((response: { value: IOrgChartItem[] }): void => {
        resolve(response.value);
        console.log("response.value"+response.value);
      }, (error: any): void => {
        reject(error);
      });
    });
  }
  private async processOrgChartItems(deptID) {

    this.readOrgChartItems(deptID)
      .then((orgChartItems: IOrgChartItem[]): void => {

        let orgChartNodes: Array<ChartItem> = [];
        var count: number;
        for (count = 0; count < orgChartItems.length; count++)
        {
         // orgChartNodes.push(new ChartItem())
         orgChartNodes.push(new ChartItem(orgChartItems[count].Id, orgChartItems[count].FullName, orgChartItems[count].ReportingOfficer ? orgChartItems[count].ReportingOfficer.Id : undefined, orgChartItems[count].ImageURL,orgChartItems[count].Designation,orgChartItems[count].UserName.Id));
        }

        let arrayToTree: any = require('array-to-tree');
        let orgChartHierarchyNodes: any = arrayToTree(orgChartNodes);
       let output: any = JSON.stringify(orgChartHierarchyNodes[0]);

        this.setState({
          orgChartItems: JSON.parse(output)
        });
      });
  }
}
