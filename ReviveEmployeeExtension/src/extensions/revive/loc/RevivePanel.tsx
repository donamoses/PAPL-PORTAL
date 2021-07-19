import * as React from 'react';
import { TextField, DefaultButton, PrimaryButton, DialogFooter, Panel, PanelType, Spinner, SpinnerType, DatePicker, DayOfWeek, IDatePickerStrings, mergeStyleSets, Label } from "office-ui-fabric-react";
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';

export interface ICustomPanelProps {

    onClose: () => void;
    isOpen: boolean;
    listId: string;
    dismissPanel: () => void;
   EmpName:string;
    ID: any;
    Status:string;
    // status: any[];
    // listitemId: any;
    // workflowdata: any[];
    // planneddetails: any[];
    // //paneltype:PanelType;

}
export interface ICustomPanelState {
    Joiningdate:any;
   
}
 
export default class CustomPanel extends React.Component<ICustomPanelProps, ICustomPanelState> {
    private editedTitle: string = null;
    constructor(props: ICustomPanelProps) {
        super(props);      
        this.state={
            Joiningdate:null,
       };

    }
    public render(): React.ReactElement<ICustomPanelProps> {
        const emojiIcon: IIconProps = { iconName: 'Cancel' };
        let Status=this.props.Status;
        
        let { isOpen } = this.props;
        return (
            <Panel isOpen={isOpen}
                type={PanelType.medium}
                customWidth={'1000px'}
                onDismiss={this._onCancel}
                closeButtonAriaLabel="Close"
            >  <span>           
        <h1>{this.props.EmpName}</h1>
        <h2 style={{display:(Status == 'No' ? 'none':'block')}}>Unable to revive an active employee</h2>
        <DatePicker
 style={{display:(Status == 'No' ? 'block':'none')}}
 value={this.state.Joiningdate}
 
onSelectDate={ this._onjoinDatePickerChange } 
placeholder="Select Joining date..."
isRequired={true}
ariaLabel="Select Joining date"
/>

</span>  
                <DialogFooter >
                    <table style={{alignContent:"Right"}}  >
                        <tr>
                            <td>
                            <PrimaryButton style={{display:(Status == 'No' ? 'block':'none')}} id="b1" text="Revive" onClick={this._OnSave} />
                            </td>
                            <td>
                            <PrimaryButton style={{ marginLeft: "10px" }} id="b2" text="CANCEL" onClick={this._onCancel} />

                            </td>
                        </tr>
                    </table>

                 
                </DialogFooter>
            </Panel>

        );
    }
    public _OnSave = async () => {
      
       if(this.state.Joiningdate==null||this.state.Joiningdate==""||this.state.Joiningdate==undefined)
        {
            alert("Please enter joining date");
        }
       else
       {
       
        this.props.onClose();
        await sp.web.lists.getByTitle("Employees").items.getById(this.props.ID).update({
            ActiveEmployee:'Yes',
            CopyLastDay:null,
            LastDay:'',
            DateOfJoining:this.state.Joiningdate
        });
        let joindate = moment(this.state.Joiningdate, 'DD/MM/YYYY').format("DD MMM YYYY");
        console.log(joindate);
        alert("Revived Employee Successfully");
       
        window.location.href = "https://mrbutlers.sharepoint.com/sites/MyPeople/Lists/Employees/AllItems.aspx";
    }
    }
    public _onCancel = async () => {
        this.props.onClose();
    }
    private _onjoinDatePickerChange = (date?: Date): void => {
        console.log(date);
        this.setState({ Joiningdate: date });
        console.log(this.state.Joiningdate);
        
        }
   
}