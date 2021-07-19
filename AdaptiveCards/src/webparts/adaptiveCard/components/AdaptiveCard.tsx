import * as React from 'react';
import styles from './AdaptiveCard.module.scss';
import { IAdaptiveCardProps } from './IAdaptiveCardProps';
import { IPresence } from "../../../model/IPresence";
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/sites";
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";
import { sp, IList, Web } from "@pnp/sp/presets/all";
import "@pnp/sp/site-groups";
import { Button } from 'office-ui-fabric-react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import {
  css,
  Persona,
  PersonaSize,
  PersonaPresence,
  Spinner
} from 'office-ui-fabric-react';
import { SearchBox, ISearchBoxStyles } from 'office-ui-fabric-react/lib/SearchBox';
import GraphService from '../../../services/GraphService';
export interface IPeople {
  people: any[];
  Presence: any[];
}
export interface IWorkingWithState {
  people: any[];
  loading: boolean;
  error: string;
  field: any[];
  selectlist: any[];
  result: any[];
  filterlist: any[];
  userUPN?: string;
  userId?: string;
  presence?: IPresence;
  Peoplepresence: any[];
}
export default class AdaptiveCard extends React.Component<IAdaptiveCardProps, IWorkingWithState, any> {
  public constructor(props) {
    super(props);
    this.state = {
      people: [],
      loading: false,
      error: null,
      field: [],
      selectlist: [],
      result: [],
      filterlist: [],
      Peoplepresence: []

    };
    this.handleChange = this.handleChange.bind(this);

    this._graphService = new GraphService(this.props.context);
  }
  private _graphService: GraphService;
  public async componentDidMount() {
    await this.LoadList();
  }
  private async LoadList() {
    let finalFields = "";
    let reqWeb = Web(this.props.siteUrl);
    let selectfields = "Title,ImageURL,FirstName,FullName,AlternativeEmail";
    let expandfields = "Department,Designation";
    // let fielddata= "select"
    let fields = this.props.fieldDetails.split(',');
    for (let i = 0; i < fields.length; i++) {
      selectfields = selectfields + "," + fields[i];

      // expandfields= expandfields+ lookupfields[j]+",";

    }

    let lookupfields = this.props.lookupDetails.split(',');
    for (let j = 0; j < lookupfields.length; j++) {
      selectfields = selectfields + "," + lookupfields[j] + "/Title" + "," + lookupfields[j] + "/ID";

      // expandfields= expandfields+ lookupfields[j]+",";

    }
    if (this.props.lookupDetails != undefined) {
      finalFields = this.props.fieldDetails + "," + this.props.lookupDetails;
      fields = finalFields.split(',');


    } else if (this.props.fieldDetails != undefined) {

      fields = this.props.fieldDetails.split(',');

    }
    this.setState({
      field: fields
    });
    // const items = await reqWeb.lists.getByTitle(this.props.listName).items.get();
    const items = await reqWeb.lists.getByTitle(this.props.listName).items.select(selectfields).expand(expandfields).get();

    console.log(items);
    this.setState({
      selectlist: items
    });
    //console.log(this.state.selectlist);
  }
  public presenceavailability = [];

  public async handleChange(empName) {
    this.presenceavailability = [];


    // let reqWeb = Web(this.props.siteUrl);
    // let search = this.state.selectlist.filter(item => item["FirstName"].toLowerCase().startsWith(empName.toLowerCase()) );
    // for(let i = 0; i < search.length; i++) {
    //   const items = await reqWeb.lists.getByTitle(this.props.listName).items.getById(parseInt(search[i].ID.toString())).get();
    //   console.log(items);
    //     this.setState({
    //       filterlist: items
    //       });
    //       console.log(this.state.filterlist);
    // }
    let result = this.state.selectlist.filter(item => item["FirstName"].toLowerCase().startsWith(empName.toLowerCase()));

    if (empName == '') {
      this.setState({
        loading: false,
        people: [],
        error: null
      });
    }
    else if (result.length == 0) {
      this.setState({
        loading: false,
        people: [],
        error: "No Employees Found"
      });
    }
    else {
      this.setState({
        loading: false,
        error: null,
        people: result
      });
      for (let i = 0; i < result.length; i++) {
        let userid = await this._graphService.getUserId(result[i].AlternativeEmail, result[i].FirstName);
        let FirstName = result[i].FirstName;
        //  alert(userId);
        let presence = await this._graphService.getPresence(userid, FirstName);
        this.presenceavailability.push(presence);
      }

      // console.log(this.testpeople);
      this.setState({ Peoplepresence: this.presenceavailability });

    }
  }
  private _get(items: any[]): void {

    // Break if number of users does not equal 1
    if (items.length != 1) {
      return;
    }

    // Update User UPN
    this.setState({
      userUPN: items[0].secondaryText
    });
  }
  public id: string;
  public Mypresence: string;
  public render(): React.ReactElement<IAdaptiveCardProps> {
    console.log(this.state.Peoplepresence);

    let profileImage;
    let Presenceofuser: PersonaPresence;

    const loading: JSX.Element = this.state.selectlist ? <div style={{ margin: '0 auto' }}><Spinner label={'Loading...'} /></div> : <div />;
    const error: JSX.Element = this.state.error ? <div><strong> </strong> {this.state.error}</div> : <div />;
    const people: JSX.Element[] = this.state.people.map((person) => {
      console.log(person);
      for (let i = 0; i < this.state.Peoplepresence.length; i++) {
        if (person.FirstName == this.state.Peoplepresence[i].FirstName) {
          switch (this.state.Peoplepresence[i].Availability) {
            case "Available":
              Presenceofuser = PersonaPresence.online;
              break;
            case "AvailableIdle":
              Presenceofuser = PersonaPresence.online;
              break;
            case "Away":
              Presenceofuser = PersonaPresence.away;
              break;
            case "BeRightBack":
              Presenceofuser = PersonaPresence.away;
              break;
            case "Busy":
              Presenceofuser = PersonaPresence.busy;
              break;
            case "BusyIdle":
              Presenceofuser = PersonaPresence.busy;
              break;
            case "DoNotDisturb":
              Presenceofuser = PersonaPresence.dnd;
              break;
            case "Offline":
              Presenceofuser = PersonaPresence.offline;
              break;
            default:
              Presenceofuser = PersonaPresence.none;
              break;
          }
        }
      }




      if (person.ImageURL != null) {
        profileImage = person.ImageURL.Url;
      } else {
        profileImage = person.ImageURL;
      }

      let fieldName = this.state.field;
      let details = [];
      let secondaryText: "";
      // let Presenceofuser:PersonaPresence;
      let tertiarytext: "";
      let data;

      let dd = this.props.lookupDetails.split(',');
      if (fieldName.length) {
        for (let i = 0; i < fieldName.length; i++) {

          if (person.hasOwnProperty(fieldName[i])) {
            let newText = fieldName[i].replace(/([A-Z])/g, ' $1').trim();
            if (i == 0) {
              secondaryText = person[fieldName[i]];
            }
            else if (typeof person[fieldName[i]] != "object") {
              data = details.push(<p id="fields">{newText}: {person[fieldName[i]]}<br /></p>);
            }
            else {
              data = details.push(<p id="fields">{newText}: {person[fieldName[i]].Title}<br /></p>);
            }
          }

        }
      }
      return (
        <div>
          <br />
          <div className={styles.personaDetails}>
            <div className={styles.persona}>
              <Persona id="PersonaID"
                primaryText={person.FullName}
                secondaryText={secondaryText}
                imageUrl={profileImage}
                size={PersonaSize.small}
                presence={Presenceofuser}
                key={person.email} />
            </div>
            <div className={styles.details} id="d1">
              {details}
            </div>
          </div>

        </div>
      );
    });
    return (
      <div className={styles.adaptiveCard}>
        <div className={styles.container} style={{ maxHeight: this.props.Height }}>
          <SearchBox
            className={styles.searchBox}
            style={{ borderRadius: '25px' }}
            placeholder="Search Colleague"
            onChange={newValue => this.handleChange(newValue)}
          />
          {/* {loading} */}
          {error}
          {people}
        </div>

      </div>
    );
  }
}