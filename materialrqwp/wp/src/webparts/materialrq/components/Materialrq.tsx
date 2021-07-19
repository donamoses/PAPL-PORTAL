import * as React from 'react';
import { IMaterialrqProps } from './IMaterialrqProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, PrimaryButton, ITextFieldProps, Label, ChoiceGroup } from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { IItemAddResult, ItemVersions } from "@pnp/sp/items";
import * as moment from 'moment';
import { ICamlQuery } from "@pnp/sp/lists";
import "@pnp/sp/folders";
import "@pnp/sp/fields";
import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/files";
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

export interface ImaterialreqState {
  reqdate: any;
  materials: any[];
  material: any[];
  selectedmaterial: any;
  requser: any;
  requserid: any;
  lblUserDisplayName: any;
  lblUserId: any;
  error: boolean;
  helperText: string;
  requiredfielderror: boolean;
  reqhelperText: string;
  checknum: boolean;
}
export default class Materialrq extends React.Component<IMaterialrqProps, ImaterialreqState, any> {
  constructor(props: IMaterialrqProps) {
    super(props);
    this.state = {
      reqdate: "",
      materials: [],
      selectedmaterial: "",
      requser: "",
      requserid: "",
      lblUserDisplayName: "",
      lblUserId: "",
      material: [],
      error: false,
      helperText: "",
      requiredfielderror: true,
      reqhelperText: "",
      checknum: false


    };
    this.change = this.change.bind(this);

  }
  public async componentDidMount() {
    let reqddate = new Date();
    this.setState({ reqdate: this.formatDate(reqddate) });
    this.getCurrentUserName();


    const allItems: any[] = await sp.web.lists.getByTitle("Materials").items.select("Title").getAll();
    console.log(allItems);

    let optionsArray = [];
    let opt = [];

    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].Title != null) {

        opt.push({ "title": allItems[i].Title });

        let data = {
          key: i,
          text: allItems[i].Title
        };

        optionsArray.push(data);
      }
    }

    this.setState({
      materials: optionsArray, material: opt
    });
    console.log(this.state.material);

  }

  public getCurrentUserName(): void {
    sp.web.currentUser.get().then((r) => {
      this.setState({ lblUserDisplayName: r["Title"], lblUserId: r["Id"] });
      //alert(this.state.lblUserDisplayName);

    });
  }
  public save = async () => {

    let flag = 0;
    let comment = ((document.getElementById("comment") as HTMLInputElement).value);
    let number = ((document.getElementById("number") as HTMLInputElement).value);
    let addedmaterial = ((document.getElementById("free-solo-2-demo") as HTMLInputElement).value);
    console.log(addedmaterial);
    if (number == "" || comment == "" || addedmaterial == "" || this.state.checknum == false || number == "" && comment == "" && addedmaterial == "") {
      this.setState({ requiredfielderror: false });
    }
    else {


      let rdate = moment(this.state.reqdate, 'DD/MM/YYYY').format("DD MMM YYYY");

      console.log(rdate);

      //const bindddedmaterial
      // }) items: any[] = await sp.web.lists.getByTitle("Materials").items.filter("Title eq " + addedmaterial).get();
      //console.log(binditems);
      const allItemss: any[] = await sp.web.lists.getByTitle("Materials").items.select("Title").getAll();
      console.log(allItemss);
      for (let i = 0; i < allItemss.length; i++) {
        if (allItemss[i].Title == addedmaterial) {
          flag = 1;

          break;
        }
      }
      if (flag == 0) {
        sp.web.lists.getByTitle("Materials").items.add({
          Title: addedmaterial

        })
      }


      sp.web.lists.getByTitle("MaterialRequest").items.add({

        RequestDate: rdate,
        Comment: comment,
        Title: addedmaterial,
        Count: number,
        RequesterUserId: this.state.lblUserId,
        Status: "Under Approval"
      }).then(i => {


        console.log(i);


      });
      alert("Data saved successfully");
      setTimeout(() => {
        window.location.href = 'https://mrbutlers.sharepoint.com/sites/EmployeePortal';
      }, 3000);
    }
  }

  public change(option: { text: any; }) {
    //console.log(option.key);
    this.setState({ selectedmaterial: option.text });
  }
  public formatDate(date) {

    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('/');
  }
  public async cancel(): Promise<void> {
    if (!window.confirm("Are you sure you want to cancel?")) {
      return;
    }
    window.location.href = "https://mrbutlers.sharepoint.com/sites/EmployeePortal";
  }
  public onChange = (event) => {
    let numregex = /^[0-9]+$/;
    if (event.target.value.match(numregex)) {
      this.setState({ helperText: '', error: false, checknum: true });
    } else {
      this.setState({ helperText: 'Please enter a valid number', error: true, checknum: false });
    }
  }


  public render(): React.ReactElement<IMaterialrqProps> {
    const top100Films = [
      { title: 'The Shawshank Redemption', year: 1994 },
      { title: 'The Godfather', year: 1972 },
      { title: 'The Godfather: Part II', year: 1974 },];
    const filterOptions = createFilterOptions({
      matchFrom: 'start'

    });

    return (
      <div style={{ border: "1px solid black", borderRadius: "20px", boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1)" }}>
        <div ><h3 style={{ color: "black", textAlign: "center" }}> MATERIAL REQUEST FORM</h3></div>
        <table>
          <tr>
            <td><Label style={{ marginLeft: "20px" }}>Request Date: </Label></td>
            <td><Label id="reqdate" style={{ marginLeft: "100px" }}>{this.state.reqdate}</Label></td>
          </tr>

          <tr>
            <td><Label style={{ marginLeft: "20px" }} >Materials Required:</Label></td>
            <td><Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              options={this.state.material.map((option) => option.title)}
              filterOptions={filterOptions}
              //id="combo-box-demo"

              //options={this.state.material}
              //getOptionLabel={(option) => option.title}

              //style={{ height: 100, width: 300 }}
              renderInput={(params) => <div style={{ marginLeft: "100px" }} ><TextField  {...params} label="Materials required" variant="outlined" size="small" InputProps={{ ...params.InputProps, type: 'search' }} /></div>}
            />
            </td>
          </tr>
          <tr>
            <td><Label required={true} style={{ marginLeft: "20px" }}>Number: </Label></td>
            <td><div style={{ marginLeft: "100px" }}><TextField onChange={this.onChange.bind(this)} error={this.state.error} helperText={this.state.helperText} style={{ width: "200px" }} variant="outlined" id="number" size="small" required ></TextField></div></td>
          </tr>
          <tr>
            <td><Label required={true} style={{ marginLeft: "20px" }}>Comment: </Label></td>
            <td><div style={{ marginLeft: "100px", width: "300px" }}> <TextField variant="outlined" size="small" style={{ width: "200px" }} multiline id="comment" required  ></TextField></div></td>
          </tr>
        </table>

        <div><PrimaryButton style={{ marginLeft: "245px", marginTop: "10px" }} id="b3" text="SAVE" onClick={this.save} /></div>

        <div><PrimaryButton style={{ marginLeft: "350px", marginTop: "-31px" }} id="b3" text="CANCEL" onClick={this.cancel} /></div>
        <div hidden={this.state.requiredfielderror} style={{ color: "red", marginLeft: "245px", marginBottom: "10px" }}>Please enter all mandatory fields</div>

      </div>

    );
  }
}
