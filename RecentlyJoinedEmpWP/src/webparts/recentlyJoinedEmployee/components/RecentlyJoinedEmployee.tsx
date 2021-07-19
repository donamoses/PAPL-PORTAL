import * as React from 'react';
import styles from './RecentlyJoinedEmployee.module.scss';
import { IRecentlyJoinedEmployeeProps } from './IRecentlyJoinedEmployeeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp, IList, Web } from "@pnp/sp/presets/all";
import pnp, { Item, ItemAddResult, ItemUpdateResult,EmailProperties } from "sp-pnp-js";
import {
  css,
  Persona,
  PersonaSize,
  PersonaPresence,
  Spinner
} from 'office-ui-fabric-react';

export interface IActivity {
  name: string;
  date: string;
  actorId: number;
  actorName?: string;
  actorPhotoUrl?: string;
}

export interface IPerson {
  FullName: string;
  ImageUrl: string;
  EmailId: string;
  jobTitle: string;
/*  department: string;
  photoUrl: string;
  profileUrl: string;*/
  DateOfJoining:string;
  Address:string;
  Location:string;
}
var peopleArr:IPerson[]=[];
export interface IWorkingWithState {
  people: IPerson[];
  loading: boolean;
  error: string;
}

export default class RecentlyJoinedEmployee extends React.Component<IRecentlyJoinedEmployeeProps, IWorkingWithState> {
  public constructor(props: IRecentlyJoinedEmployeeProps, state:IWorkingWithState ){

    super(props);
    this.state = {
      people: [],
      loading: true,
      error: null
    };

  }
  public async componentDidMount() {
   // this.loadPeople(this.props.siteUrl, this.props.numberOfPeople);
  await this.LoadList();
  }

  public componentDidUpdate(prevProps: IRecentlyJoinedEmployeeProps, prevState: IWorkingWithState, prevContext: any): void {
  /*
    if (this.props.numberOfPeople !== prevProps.numberOfPeople ||
      this.props.siteUrl !== prevProps.siteUrl && (
        this.props.numberOfPeople && this.props.siteUrl
      )) {
    //  this.loadPeople(this.props.siteUrl, this.props.numberOfPeople);
    }*/
   // this.LoadList();
  }
  public render(): React.ReactElement<IRecentlyJoinedEmployeeProps> {
    const loading: JSX.Element = this.state.loading ? <div style={{ margin: '0 auto' }}><Spinner label={'Loading...'} /></div> : <div/>;
    const error: JSX.Element = this.state.error ? <div><strong> </strong> {this.state.error}</div> : <div/>;
    const people: JSX.Element[] = this.state.people.map((person: IPerson, i: number) => {
      return (
       <Persona
          primaryText={person.FullName}
          secondaryText={person.jobTitle}
        //  tertiaryText={person.EmailId}
        tertiaryText={person.Location}
          imageUrl={person.ImageUrl}
          size={PersonaSize.large}
          presence={PersonaPresence.none}
          key={person.EmailId} />

      );
    });
    return (
      <div className={styles.recentlyJoinedEmployee}>
       <div className={styles.joined} >Recently Joined Employees</div>
       {loading}
        {error}
        {people}
      </div>
    );
  } private navigateTo(url: string): void {
    window.open(url, '_blank');
  }
  private async LoadList()
 {
  let designation="";
  let imageURL=this.props.DefaultImageUrl;//"https://i.stack.imgur.com/l60Hf.png";
  let Location="";
  var reacthandler=this;

  let urll=this.props.siteUrl + '/Lists/' + this.props.ListName;
  let reqWeb = Web(this.props.siteUrl);
  var myDate = new Date();
  myDate.setDate(myDate.getDate() - this.props.PastDays);
  console.log(sp.web);
  reqWeb.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
    for(var k in data){
      if(data[k].DateOfJoining!=null)
      {
      var doj = new Date(data[k].DateOfJoining);
      if( doj>=myDate)
      {
        if(data[k].DesignationId!=null)
        {
            const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Designation/Title", "Designation/ID").expand("Designation").get();
 designation=item.Designation.Title;
        }
        if(data[k].ImageURL!=null)
        {
          imageURL=data[k].ImageURL.Url;
        }
        else
        {
          imageURL = data[k].ImageURL;
        }
        if(data[k].LocationId!=null)
        {
            const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title",  "Location/Title", "Location/ID").expand("Location").get();
        Location=item.Location.Title;

        }
       peopleArr.push({FullName:data[k].FullName,DateOfJoining:data[k].DateOfJoining,EmailId:data[k].EmailId,jobTitle:designation,Address:data[k].Address,ImageUrl:imageURL,Location:Location});
      }
     }
  }
    if(peopleArr.length==0)
    {

      this.setState({
        loading: false,
        people: [],
        error:"No Employee joined in last week"});
    }
    else
    {
      this.setState({
        loading: false,
        error: null,
        people: peopleArr
      });
    }
  reacthandler.setState({people: peopleArr});
  //reacthandler.setState({SaveData});
  console.log(peopleArr);
  return peopleArr;
  });
 }
}
