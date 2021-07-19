export interface IOrgChartItem {
  //Title: string;
  Id: number;
  parent_id: number;
 ImageURL?: string;
 Designation:any;
 // Parent: any;
  FullName:string;
 ReportingOfficer:any;
 Department:any;
 UserName:any;
 // ReportingOfficer_id:number;
}
export class DepartmentItem
{
 Id: number;
 Title:string
}
export class  ChartItem {
 id: number;
 // title: string;    
 url?: string;
  parent_id?: number;
  FullName:string;
  Designation?:string;
  UserName?:string;
 // ReportingOfficer:string;
 // ReportingOfficer_id?:number;

  constructor(id: number, FullName: string, parent_id?: number, url?:string, Designation?:string,UserName?:string) {
      this.id = id;
      this.FullName = FullName;
      this.parent_id = parent_id;
      this.url= url;
      this.Designation=Designation;
      this.UserName=UserName
     // this.url = url;
  }
}