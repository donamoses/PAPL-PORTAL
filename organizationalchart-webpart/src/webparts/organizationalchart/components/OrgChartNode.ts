export interface IDataNode {
    id: number;
    parent_id: number;
    name: string;
    FullName:string;
    ReportingOfficer:string;
    ReportingOfficer_id:number;
    children: Array<IDataNode>;
}
export class OrgChartNode implements IDataNode {
   public id: number;
   public parent_id: number;
   public name: string;
   public FullName:string;
   public ReportingOfficer:string;
   public ReportingOfficer_id:number;
   public children: Array<IDataNode>;

    constructor(id: number, name: string, children?: Array<IDataNode>) {
        this.id = id;
        this.parent_id = id;
        this.name = name;
        this.children = children || [];
        //this.ReportingOfficer_id=id;

    }

    // // public addNode(node: IDataNode): void {
    //     this.children.push(node);
    // }
}

