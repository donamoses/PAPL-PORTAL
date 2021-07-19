import * as React from 'react';
import styles from './Anniversary.module.scss';
import { IAnniversaryProps } from './IAnniversaryProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import { sp, IList, Web } from "@pnp/sp/presets/all";
import pnp, { Item, ItemAddResult, ItemUpdateResult, EmailProperties } from "sp-pnp-js";
import {
    css,
    Persona,
    PersonaSize,
    PersonaPresence,
    Spinner
} from 'office-ui-fabric-react';
import { DisplayMode } from '@microsoft/sp-core-library';
import * as _ from 'lodash';
export interface IActivity {
    name: string;
    date: string;
    actorId: number;
    actorName?: string;
    actorPhotoUrl?: string;
}
// export interface IAnnouncement {
// ID:any;
// Title:any;
// Announcement:any;
// ExpDate:any;
// Created:any;



// }


export interface IPerson {
    EmpId: string;
    FullName: string;
    ImageUrl: string;
    EmailId: string;
    jobTitle: string;
    /* department: string;
    photoUrl: string;
    profileUrl: string;*/
    DateOfJoining: string;
    DateOfBirth: string;
    DateOfWedding: string;
    Address: string;
    Location: string;
    Description: string;
}



/*export interface IWorkingWithState {
title: string;
people: IPerson[];
loading: boolean;
error: string;
}*/



export interface IWorkingWithState {
    weddingtitle: string;
    RecentlyJoinedtitle: string;
    Bdaytitle: string;
    wedding: IPerson[];
    Bday: IPerson[];
    RecentlyJoinedpeople: IPerson[];
    weddingloading: boolean;
    weddingerror: string;
    title: string;
    people: IPerson[];
    loading: boolean;
    error: string;
    // announcement: IAnnouncement[];

}
var sorted_Birthdays: IPerson[] = [];
var sorted_BirthdayMonth: IPerson[] = [];
var sorted_BirthdayYear: IPerson[] = [];
var sorted_WeddingDays: IPerson[] = [];
var sorted_WeddingMonth: IPerson[] = [];
var sorted_WeddingYear: IPerson[] = [];
export default class Anniversary extends React.Component<IAnniversaryProps, IWorkingWithState, {}> {
    public constructor(props: IAnniversaryProps, state: IWorkingWithState) {

        super(props);
        this.state = {
            title: "",
            people: [],
            wedding: [],
            loading: true,
            error: null,
            weddingtitle: "",
            RecentlyJoinedtitle: "",
            weddingloading: true,
            weddingerror: null,
            RecentlyJoinedpeople: [],
            Bday: [],
            Bdaytitle: "",
            // announcement:[]

        };
        this.LoadList();
        this.LoadRecentlyJoinedList();
        this.LoadBdayList();
        // this.LoadAttachmentList();
    }
    public async componentDidMount() {
        this.setState({
            title: "",
            people: [],
            wedding: [],
            loading: true,
            error: null,
            weddingtitle: "",
            RecentlyJoinedtitle: "",
            weddingloading: true,
            weddingerror: null,
            RecentlyJoinedpeople: [],
            Bday: [],
            Bdaytitle: "",
            // announcement:[]
        });
        console.log("Loading" + this.state.RecentlyJoinedpeople.length);
        // this.loadPeople(this.props.siteUrl, this.props.numberOfPeople);

    }
    public componentWillUnmount() {
        this.setState({
            title: "",
            people: [],
            wedding: [],
            loading: true,
            error: null,
            weddingtitle: "",
            RecentlyJoinedtitle: "",
            weddingloading: true,
            weddingerror: null,
            RecentlyJoinedpeople: [],
            Bday: [],
            Bdaytitle: "",
            // announcement:[]
        });
        console.log("Unloading" + this.state.RecentlyJoinedpeople.length);
    }

    public render(): React.ReactElement<IAnniversaryProps> {
        console.log("rendering" + this.state.RecentlyJoinedpeople.length);
        if (this.state.people.length == 0 && this.state.Bday.length == 0) {
            return (

                <div><h1>{this.props.Error}</h1></div>
            );
        }
        else {
            const title: JSX.Element = this.state.title ? <div><strong> </strong> {this.state.title}</div> : <div />;
            const loading: JSX.Element = this.state.loading ? <div style={{ margin: '0 auto' }}><Spinner label={'Loading...'} /></div> : <div />;
            const error: JSX.Element = this.state.error ? <div><strong> </strong> {this.state.error}</div> : <div />;
            const people: JSX.Element[] = this.state.people.map((person: IPerson, i: number) => {
                return (
                    <Persona
                        className={styles["persona-row"]}
                        primaryText={person.FullName}
                        secondaryText={person.jobTitle}
                        // tertiaryText={person.EmailId}
                        tertiaryText={person.Location}
                        imageUrl={person.ImageUrl}
                        size={PersonaSize.small}
                        presence={PersonaPresence.none}
                        key={person.EmailId} />

                );
            });
            const weddingtitle: JSX.Element = this.state.weddingtitle ? <div><strong> </strong> {this.state.weddingtitle}</div> : <div />;
            const weddingloading: JSX.Element = this.state.weddingloading ? <div style={{ margin: '0 auto' }}><Spinner label={'Loading...'} /></div> : <div />;
            const weddingerror: JSX.Element = this.state.weddingerror ? <div><strong> </strong> {this.state.weddingerror}</div> : <div />;
            const wedding: JSX.Element[] = this.state.wedding.map((weddding: IPerson, i: number) => {
                return (
                    <Persona
                        className={styles["persona-row"]}
                        primaryText={weddding.FullName}
                        secondaryText={weddding.Description}
                        // tertiaryText={person.EmailId}
                        tertiaryText={weddding.Location}
                        imageUrl={weddding.ImageUrl}
                        size={PersonaSize.small}
                        presence={PersonaPresence.none}
                        key={weddding.EmailId}
                        onClick={() => this.Weddingmail(weddding.EmpId, weddding.Description)} />

                );
            });
            const recentlyJOinedtitle: JSX.Element = this.state.RecentlyJoinedtitle ? <div><strong> </strong> {this.state.RecentlyJoinedtitle}</div> : <div />;
            const RecentlyJoinedpeople: JSX.Element[] = this.state.RecentlyJoinedpeople.map((person: IPerson, i: number) => {
                return (
                    <Persona
                        className={styles["persona-row"]}
                        primaryText={person.FullName}
                        secondaryText={person.jobTitle}
                        // tertiaryText={person.EmailId}
                        tertiaryText={person.Location}
                        imageUrl={person.ImageUrl}
                        size={PersonaSize.small}
                        presence={PersonaPresence.none}
                        key={person.EmailId} />

                );
            });
            const Bdaytitle: JSX.Element = this.state.Bdaytitle ? <div><strong> </strong> {this.state.Bdaytitle}</div> : <div />;

            const Bdaypeople: JSX.Element[] = this.state.Bday.map((person: IPerson, i: number) => {
                return (
                    <div >
                        <Persona
                            className={styles["persona-row"]}
                            primaryText={person.FullName}
                            secondaryText={person.Description}
                            // tertiaryText={person.EmailId}
                            tertiaryText={person.Location}
                            imageUrl={person.ImageUrl}
                            size={PersonaSize.small}
                            presence={PersonaPresence.none}
                            key={person.EmailId}
                            onClick={() => this.Birthdaymail(person.EmpId, person.Description)}
                        />
                    </div>
                );
            });
            return (


                <div className={styles.anniversary} style={{
                    borderRadius: "5px", border: "1px solid gray"
                }} >
                    <div className={styles.container} style={{ height: this.props.Height }}>

                        <div className={styles.title} style={{ display: (Bdaypeople.length == 0 ? 'none' : 'block') }}>{Bdaytitle}</div>

                        <div className={styles.row} style={{ display: (Bdaypeople.length == 0 ? 'none' : 'block') }}>{Bdaypeople}</div>


                        <div className={styles.title} style={{ display: (people.length == 0 ? 'none' : 'block') }}>{title}</div>
                        <div className={styles.row} style={{ display: (people.length == 0 ? 'none' : 'block') }}>{people}</div>
                        <div className={styles.title} style={{ display: (wedding.length == 0 ? 'none' : 'block') }}>{weddingtitle}</div>

                        {/* {weddingloading}  */}
                        {weddingerror}
                        <div className={styles.row} style={{ display: (wedding.length == 0 ? 'none' : 'block') }}>{wedding}</div>
                        <div className={styles.title} style={{ display: (RecentlyJoinedpeople.length == 0 ? 'none' : 'block') }}>{recentlyJOinedtitle}</div>

                        <div className={styles.row} style={{ display: (RecentlyJoinedpeople.length == 0 ? 'none' : 'block') }}>{RecentlyJoinedpeople}</div>

                    </div>

                </div>
            );
        }
    }
    private navigateTo(url: string): void {
        window.open(url, '_blank');
    }
    private async LoadList() {
        var peopleArr: IPerson[] = [];
        var weddingArr: IPerson[] = [];
        let designation = "";
        let department = "";
        let imageURL = this.props.DefaultImageUrl;//"https://i.stack.imgur.com/l60Hf.png";
        let Location = "";
        var reacthandler = this;
        let url = this.props.siteUrl + 'Lists/' + this.props.ListName;
        var today = new Date();
        let currentDate = moment(today).format("YYYY-MM-DDT12:00:00Z");
        let currentYear = moment(today).format("YYYY");
        let currentMonth = moment(today).format("MM");

        var myDate = moment(new Date(currentDate)).format("DD-MM");
        let currentDatee = moment(new Date(currentDate)).format(currentYear + "-MM-DD");
        var new_date = moment(currentDate, "YYYY-MM-DDT12:00:00Z").add('days', 7);
        let toDate = new_date.format("YYYY-MM-DDT12:00:00Z");
        let toYear = moment(toDate).format("YYYY");
        let fullday = moment(new Date(toDate)).format(toYear + "-MM-DD");
        console.log(sp.web);
        let reqWeb = Web(this.props.siteUrl);
        // const data = await reqWeb.lists.getByTitle(this.props.ListName).getItemsByCAMLQuery({
        // ViewXml: "<View><Query><Where><Eq><FieldRef Name='ActiveEmployee' /><Value Type='Text'>Yes</Value></Eq></Where></Query></View>",
        // });
        // console.log(data);
        reqWeb.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
            // pnp.sp.web.folders.getByName('PeopleList').files.get().then(function(data){
            for (var k in data) {
                if (this.props.WorkAnniversary) {
                    // console.log(data);
                    if (data[k].DateOfJoining != null && data[k].ActiveEmployee == "Yes") {
                        var doj = moment(new Date(data[k].DateOfJoining)).format("DD-MM");
                        var Joiningday = moment(new Date(data[k].DateOfJoining)).format("DD-MM-YYYY");
                        var Currentday = moment(new Date(currentDate)).format("DD-MM-YYYY");
                        let dojdatee = moment(new Date(data[k].DateOfJoining)).format("MM-DD");
                        if (moment(Joiningday).isSame(Currentday)) { }
                        else {
                            if (moment(doj).isSame(myDate)) {
                                // alert(data[k].DesignationId);
                                if (data[k].DesignationId != null) {

                                    const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Designation/Title", "Designation/ID").expand("Designation").get();
                                    designation = item.Designation.Title;
                                }
                                if (data[k].ImageURL != null) {
                                    imageURL = data[k].ImageURL.Url;
                                }
                                if (data[k].LocationId != null) {
                                    const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Location/Title", "Location/ID").expand('Location').get();
                                    Location = item.Location.Title;

                                }
                                peopleArr.push({
                                    EmpId: data[k].Title, FullName: data[k].FullName, DateOfJoining: data[k].DateOfJoining, DateOfBirth: data[k].DateOfBirth,
                                    EmailId: data[k].EmailId, jobTitle: designation, Address: data[k].Address, ImageUrl: imageURL,
                                    DateOfWedding: data[k].DateOfWedding, Location: Location, Description: ""
                                });
                            }
                        }
                    }
                }
                if (this.props.WeddingAnniversary) {
                    if (data[k].DateOfWedding != null && data[k].ActiveEmployee == "Yes") {

                        var dow = moment(new Date(data[k].DateOfWedding)).format("DD-MM");
                        var dowmonth = moment(new Date(data[k].DateOfWedding)).format("MM");

                        currentYear = moment(today).format("YYYY");
                        let dowdatee = moment(new Date(data[k].DateOfWedding)).format(currentYear + "-MM-DD");
                        if (dowmonth == "01" && currentMonth == "12") {
                            currentYear = (parseInt(currentYear) + 1) + "";

                        }
                        dowdatee = moment(new Date(data[k].DateOfWedding)).format(currentYear + "-MM-DD");
                        var dowday = moment(new Date(data[k].DateOfWedding)).format("DD-MM-" + currentYear);
                        if (moment(dowdatee).isSameOrAfter(currentDatee) && moment(dowdatee).isSameOrBefore(fullday)) {

                            if (data[k].DesignationId != null) {
                                const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Designation/Title", "Designation/ID").expand("Designation").get();
                                designation = item.Designation.Title;
                            }
                            if (data[k].ImageURL != null) {
                                imageURL = data[k].ImageURL.Url;
                            }
                            if (data[k].LocationId != null) {
                                const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Location/Title", "Location/ID").expand('Location').get();
                                Location = item.Location.Title;

                            }
                            if (dow == myDate) {
                                weddingArr.push({
                                    EmpId: data[k].Title, FullName: data[k].FullName, DateOfJoining: data[k].DateOfJoining, DateOfBirth: data[k].DateOfBirth,
                                    EmailId: data[k].EmailId, jobTitle: designation, Address: data[k].Address, ImageUrl: imageURL,
                                    DateOfWedding: dowdatee, Location: Location, Description: "Today"
                                });
                            }
                            else {
                                weddingArr.push({
                                    EmpId: data[k].Title, FullName: data[k].FullName, DateOfJoining: data[k].DateOfJoining, DateOfBirth: data[k].DateOfBirth,
                                    EmailId: data[k].EmailId, jobTitle: designation, Address: data[k].Address, ImageUrl: imageURL,
                                    DateOfWedding: dowdatee, Location: Location, Description: dowday
                                });
                            }
                        }
                    }
                }
            }

            sorted_WeddingDays = _.orderBy(weddingArr, (o: any) => {
                return moment(o.DateOfWedding).format("YYYYMMDD");
            }, ['asc']);
            console.log(sorted_WeddingDays);
            if (peopleArr.length != 0) {

                this.setState({
                    title: "Work Anniversary ",
                    loading: false,
                    error: null,
                    people: peopleArr
                });
            }
            else {
                this.setState({
                    title: "",
                    loading: false,
                    people: [],
                    error: this.props.Error

                });
            }
            if (sorted_WeddingDays.length != 0) {
                this.setState({
                    weddingtitle: "Wedding Anniversary ",
                    weddingloading: false,
                    wedding: sorted_WeddingDays,
                    weddingerror: null
                });
            }
            else {
                this.setState({

                    weddingtitle: "",
                    error: this.props.Error,
                    wedding: [],
                    weddingerror: ""
                });
            }

            reacthandler.setState({ people: peopleArr });
            reacthandler.setState({ wedding: sorted_WeddingDays });

            //reacthandler.setState({SaveData});
            // console.log(peopleArr);
            return peopleArr;
        });




    }

    private async LoadRecentlyJoinedList() {
        var RecentpeopleArr: IPerson[] = [];
        let designation = "";
        let imageURL = this.props.DefaultImageUrl;//"https://i.stack.imgur.com/l60Hf.png";
        let Location = "";
        var reacthandler = this;

        let urll = this.props.siteUrl + '/Lists/' + this.props.ListName;
        let reqWeb = Web(this.props.siteUrl);
        var myDate = new Date();
        myDate.setDate(myDate.getDate() - this.props.PastDays);
        // console.log(sp.web);
        // const data = await reqWeb.lists.getByTitle(this.props.ListName).getItemsByCAMLQuery({
        // ViewXml: "<View><Query><Where><Eq><FieldRef Name='ActiveEmployee' /><Value Type='Text'>Yes</Value></Eq></Where></Query></View>",
        // });
        reqWeb.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
            // console.log(data);
            for (var k in data) {
                if (data[k].DateOfJoining != null) {
                    var doj = new Date(data[k].DateOfJoining);
                    if (doj >= myDate) {
                        if (data[k].DesignationId != null) {
                            const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Designation/Title", "Designation/ID").expand("Designation").get();
                            designation = item.Designation.Title;
                        }
                        if (data[k].ImageURL != null) {
                            imageURL = data[k].ImageURL.Url;
                        }
                        else {
                            imageURL = data[k].ImageURL;
                        }
                        if (data[k].LocationId != null) {
                            const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Location/Title", "Location/ID").expand("Location").get();
                            Location = item.Location.Title;

                        }
                        //peopleArr.push({FullName:data[k].FullName,DateOfJoining:data[k].DateOfJoining,EmailId:data[k].EmailId,jobTitle:designation,Address:data[k].Address,ImageUrl:imageURL,Location:Location});

                        RecentpeopleArr.push({
                            EmpId: data[k].Title, FullName: data[k].FullName, DateOfJoining: data[k].DateOfJoining, DateOfBirth: data[k].DateOfBirth,
                            EmailId: data[k].EmailId, jobTitle: designation, Address: data[k].Address, ImageUrl: imageURL,
                            DateOfWedding: data[k].DateOfWedding, Location: Location, Description: ""
                        });
                    }
                }
            }

            if (RecentpeopleArr.length == 0) {

                this.setState({
                    loading: false,
                    RecentlyJoinedpeople: [],
                    error: "No Employee joined in last week"
                });
            }
            else {
                this.setState({
                    loading: false,
                    error: null,
                    RecentlyJoinedtitle: "Recently Joined Employees",
                    RecentlyJoinedpeople: RecentpeopleArr
                });
            }
            reacthandler.setState({ RecentlyJoinedpeople: RecentpeopleArr });
            //reacthandler.setState({SaveData});
            // console.log(RecentpeopleArr);
            return RecentpeopleArr;
        });
    }

    private async LoadBdayList() {
        var BdayArr: IPerson[] = [];
        let designation = "";
        let department = "";
        let imageURL = this.props.DefaultImageUrl;//"https://i.stack.imgur.com/l60Hf.png";
        let Location = "";
        var reacthandler = this;
        let url = this.props.siteUrl + 'Lists/' + this.props.ListName;
        var today = new Date();
        let currentDate = moment(today).format("YYYY-MM-DDT12:00:00Z");
        let currentYear = moment(today).format("YYYY");
        let currentMonth = moment(today).format("MM");

        var myDate = moment(new Date(currentDate)).format("DD-MM");
        let currentDatee = moment(new Date(currentDate)).format(currentYear + "-MM-DD");
        var new_date = moment(currentDate, "YYYY-MM-DDT12:00:00Z").add('days', 7);
        let toDate = new_date.format("YYYY-MM-DDT12:00:00Z");
        let toYear = moment(toDate).format("YYYY");
        let fullday = moment(new Date(toDate)).format(toYear + "-MM-DD");

        console.log(sp.web);
        let reqWeb = Web(this.props.siteUrl);
        // const data = await reqWeb.lists.getByTitle(this.props.ListName).getItemsByCAMLQuery({
        // ViewXml: "<View><Query><Where><Eq><FieldRef Name='ActiveEmployee' /><Value Type='Text'>Yes</Value></Eq></Where></Query></View>",
        // });
        // console.log(data);
        reqWeb.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
            console.log(data);
            for (var k in data) {
                if (data[k].DateOfbirth != null && data[k].ActiveEmployee == "Yes") {
                    var dob = moment(new Date(data[k].DateOfbirth)).format("DD-MM");
                    var dobmonth = moment(new Date(data[k].DateOfbirth)).format("MM");

                    currentYear = moment(today).format("YYYY");
                    let dobdatee = moment(new Date(data[k].DateOfbirth)).format(currentYear + "-MM-DD");
                    if (dobmonth == "01" && currentMonth == "12") {
                        currentYear = (parseInt(currentYear) + 1) + "";

                    }
                    dobdatee = moment(new Date(data[k].DateOfbirth)).format(currentYear + "-MM-DD");
                    var dobday = moment(new Date(data[k].DateOfbirth)).format("DD-MM-" + currentYear);
                    if (moment(dobdatee).isSameOrAfter(currentDatee) && moment(dobdatee).isSameOrBefore(fullday)) {
                        // console.log(data[k].FullName);
                        if (data[k].DesignationId != null) {
                            const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Designation/Title", "Designation/ID").expand("Designation").get();
                            designation = item.Designation.Title;
                        }
                        if (data[k].ImageURL != null) {
                            imageURL = data[k].ImageURL.Url;
                        }
                        if (data[k].LocationId != null) {
                            const item = await reqWeb.lists.getByTitle(this.props.ListName).items.getById(parseInt(data[k].ID.toString())).select("Title", "Location/Title", "Location/ID").expand('Location').get();
                            Location = item.Location.Title;

                        }
                        // console.log(data[k].DateOfbirth);
                        if (dob == myDate) {
                            BdayArr.push({
                                EmpId: data[k].Title, FullName: data[k].FullName, DateOfJoining: data[k].DateOfJoining, DateOfBirth: dobdatee,
                                EmailId: data[k].EmailId, jobTitle: designation, Address: data[k].Address, ImageUrl: imageURL,
                                DateOfWedding: data[k].DateOfWedding, Location: Location, Description: "Today"
                            });
                        }
                        else {
                            BdayArr.push({
                                EmpId: data[k].Title, FullName: data[k].FullName, DateOfJoining: data[k].DateOfJoining, DateOfBirth: dobdatee,
                                EmailId: data[k].EmailId, jobTitle: designation, Address: data[k].Address, ImageUrl: imageURL,
                                DateOfWedding: data[k].DateOfWedding, Location: Location, Description: dobday
                            });
                        }

                    }
                }
            }
            // for(let i = 0; i < BdayArr.length; i++)
            // {
            // BdayArr[i].DateOfBirth = moment(BdayArr[i].DateOfBirth).format("DD-MM-"+currentYear);
            // }
            // console.log(BdayArr);
            // var isAscending = true; //set to false for ascending
            // sorted_Birthdays =BdayArr.sort((a,b) =>isAscending ?
            // new Date(a.DateOfBirth).getTime() - new Date(b.DateOfBirth).getTime() : new Date(b.DateOfBirth).getTime()
            // - new Date(a.DateOfBirth).getTime());

            // const dateArray = [{date:"2019-05-11"},{date:"2018-05-12"},{date:"2020-05-10"}]
            sorted_Birthdays = _.orderBy(BdayArr, (o: any) => {
                return moment(o.DateOfBirth).format("YYYYMMDD");
            }, ['asc']);
            // console.log(sorted_Birthdays);



            if (sorted_Birthdays.length == 0) {

                this.setState({
                    Bdaytitle: "",
                    loading: false,
                    Bday: [],
                    error: this.props.Error
                });
            }
            else {
                this.setState({
                    Bdaytitle: "Birthday Celebrations",
                    loading: false,
                    error: null,
                    Bday: sorted_Birthdays
                });
            }
            reacthandler.setState({ Bday: sorted_Birthdays });
            //reacthandler.setState({SaveData});
            // console.log(BdayArr);
            return sorted_Birthdays;
        });
    }

    private async Birthdaymail(EmpID: string, Date: string) {
        console.log(EmpID);
        if (Date == "Today") {
            let Url = "https://ccsdev01.sharepoint.com/sites/Portal/SitePages/Greetings.aspx?EmpId=" + EmpID + "&Type=birthday";
            console.log(Url);
            window.location.href = Url;
        }
    }
    private async Weddingmail(EmpID: string, Date: string) {
        console.log(EmpID);
        if (Date == "Today") {
            let Url = "https://ccsdev01.sharepoint.com/sites/Portal/SitePages/Greetings.aspx?EmpId=" + EmpID + "&Type=wedding";
            console.log(Url);
            window.location.href = Url;
        }
    }
}