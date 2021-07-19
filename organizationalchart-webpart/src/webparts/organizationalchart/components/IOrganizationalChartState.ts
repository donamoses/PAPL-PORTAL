import { IDataNode } from './OrgChartNode';
import { Dropdown ,IDropdownOption} from "office-ui-fabric-react/lib/Dropdown";
export interface IOrganizationalchartState{
    orgChartItems:any;
    DeptID:string;
    DepartmentArray:IDropdownOption[];
    UserId:string;
  }