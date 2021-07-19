import * as React from 'react';
import styles from './Birthday.module.scss';
import { IBirthdayProps } from './IBirthdayProps';
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
  DateOfBirth:string;
  Address:string;
  Location:string;
}
var peopleArr:IPerson[]=[];
export interface IWorkingWithState {
  title: string;
  people: IPerson[];
  loading: boolean;
  error: string;
}
export default class Birthday extends React.Component<IBirthdayProps,IWorkingWithState, {}> {
  public constructor(props:  IBirthdayProps, state:IWorkingWithState ){ 
  
    super(props); 
    this.state = { 
      title: null,
      people: [],
      loading: true,
      error: null
    };
  
  }
  public async componentDidMount() {
    // this.loadPeople(this.props.siteUrl, this.props.numberOfPeople);
   await this.LoadList();
   }
 
  
  public render(): React.ReactElement<IBirthdayProps> {
    const title: JSX.Element = this.state.title ? <div><strong> </strong> {this.state.title}</div> : <div/>;
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
      <div className={styles.birthday}>
        <div className={styles.title}> {title}</div>
      
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
  let department="";
  let imageURL=this.props.DefaultImageUrl;//"https://i.stack.imgur.com/l60Hf.png";
  let Location="";
  var reacthandler=this;
  let url=this.props.siteUrl + 'Lists/' + this.props.ListName;
  var today = new Date();
  let currentmonth;
  let currentday;
  let month= today.getMonth()+1;
  let day= today.getDate();
  if(month<10){
    currentmonth = '0'+month;
  }
  else{
    currentmonth= month;
  }
  if(day<10){
    currentday = '0'+day;
  }
  else{
    currentday= day;
  }
 var myDate = currentday+'-'+currentmonth;
  console.log(sp.web);
  let reqWeb = Web(this.props.siteUrl);
  reqWeb.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
  // sp.web.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
 // pnp.sp.web.folders.getByName('PeopleList').files.get().then(function(data){
    for(var k in data){
      if(data[k].DateOfbirth!=null)
      {
      var birthday = new Date(data[k].DateOfbirth);
    let birthmonth;
    let birthdate;
    let monthbirth= birthday.getMonth()+1;
    let birthdatee= birthday.getDate();
    if(monthbirth<10){
      birthmonth = '0'+monthbirth;
    }
    else{
      birthmonth=monthbirth;
    }
    if(birthdatee<10){
      birthdate = '0'+birthdatee;
    }
    else{
      birthdate=birthdatee;
    }
   var dob = birthdate+'-'+birthmonth;
          if( dob==myDate)
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
        if(data[k].LocationId!=null)
        {
          const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Location/Title", "Location/ID").expand('Location').get();
        Location=item.Location.Title;

        }
       peopleArr.push({FullName:data[k].FullName,DateOfJoining:data[k].DateOfJoining,DateOfBirth:data[k].DateOfbirth,
        EmailId:data[k].EmailId,jobTitle:designation,Address:data[k].Address,ImageUrl:imageURL,Location:Location});
      }
     }
  }
    if(peopleArr.length==0)
    {
      
      this.setState({
        title:"",
        loading: false,
        people: [],
        error:""});
    }
    else
    {
      this.setState({
        title: "Birthday Celebrations",
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
