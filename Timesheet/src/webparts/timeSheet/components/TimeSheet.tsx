import * as React from 'react';
import styles from './TimeSheet.module.scss';
import { ITimeSheetProps } from './ITimeSheetProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DefaultButton, TextField, ITextFieldProps, Label, ChoiceGroup, values, hiddenContentStyle } from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import {
  DatePicker,
  mergeStyleSets,
  DayOfWeek,
  IDatePickerStrings,
  PrimaryButton
} from "office-ui-fabric-react";
import { sp, IList, Web, ICamlQuery } from "@pnp/sp/presets/all";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import * as moment from "moment";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format';
import { id } from 'date-fns/esm/locale';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { th } from 'date-fns/locale';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';
import Select from 'react-select';
import * as NumericInput from "react-numeric-input";
export interface ITask {
  ID: any;
  Title: any;
  GID:any;
  GTask:any;
}
export interface ITime {
  ID: any;
  Task: any;
  Date: any;
  Time: any;
  TaskDescription: any;
  DayofWeek: any;
}
export interface Days {
  Sunday: any;
  Monday: any;
  Tuesday: any;
  Wednesday: any;
  Thursday: any;
  Friday: any;
  Saturday: any;
  Weektotal: any;
  Task: any;
  TaskDescription: any;
  Taskid: any;
  dpselectedDayItem?: { key: string | number | undefined| '' };
}
export interface IWorkingWithState {
  ChselectedItem?: { key: string | number | undefined };
  Task: ITask[];
  opt: any[];
  rows: Days[];
  days: Days[];
  weekday: any[];
  time: any[];
  rebind: any[];
  groupTask: any[];
  office:any[];
  selected_values:any[];
  selectedDay: any;
  bindMonday: any;
  bindtueday: any;
  bindwedday: any;
  bindthuday: any;
  bindFriday: any;
  bindsatday: any;
  bindSunday: any;
  insertMonday: any;
  insertTuesday: any;
  insertWednesday: any;
  insertThursday: any;
  insertFriday: any;
  insertSaturday: any;
  insertSunday: any;
  isEmpty: boolean;
  selectedDays: any[];
  firstDayOfWeek?: DayOfWeek;
  deptId: any;
  hoverRange: any;
  empId: any;
  weektotal: any;
  rowcount: any;
  iTask: any;
  ddid: any;
  ddTask: any;
  mon: any;
  tue: any;
  wed: any;
  thu: any;
  fri: any;
  sat: any;
  sun: any;
  copyMonday: any;
  copyTuesday: any;
  copyWednesday: any;
  copyThursday: any;
  copyFriday: any;
  copySaturday: any;
  copySunday: any;
  des: any;
  hidecreate: boolean;
  hideedit: boolean;
  hidecalendar: boolean;
  userName: any;
  employeeID: any;
  GrandTotal: any;
  SaveUpdate: any;
  userid: any;
  username: any;
  MondayTotal: any;
  TuesdayTotal: any;
  WednesdayTotal: any;
  ThursdayTotal: any;
  FridayTotal: any;
  SaturdayTotal: any;
  SundayTotal: any;
  requiredfielderror: boolean;
  timefielderror: boolean;
  savedisable:boolean;
}
var TaskArr = [];
var OfficeTaskArr = [];
let optionsArrays = [];
var TimeArr: ITime[] = [];
var DayArr = [];
var GroupTaskArr = [];
export default class TimeSheet extends React.Component<ITimeSheetProps, IWorkingWithState, {}> {

  public constructor(props: ITimeSheetProps, state: IWorkingWithState) {
    super(props);

    this.state = {
      ChselectedItem: undefined,
      Task: [],
      opt: [],
      office:[],
      time: [],
      days: [],
      rows: [],
      weekday: [],
      rebind: [],
      groupTask: [],
      selected_values:[],
      selectedDay: '',
      isEmpty: true,
      selectedDays: [],
      bindMonday: "",
      bindtueday: "",
      bindwedday: "",
      bindthuday: "",
      bindFriday: "",
      bindsatday: "",
      bindSunday: "",
      insertMonday: "",
      insertTuesday: "",
      insertWednesday: "",
      insertThursday: "",
      insertFriday: "",
      insertSaturday: "",
      insertSunday: "",
      deptId: '',
      empId: '',
      hoverRange: '',
      weektotal: '',
      rowcount: 0,
      ddid: '',
      ddTask: '',
      iTask: '',
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: '',
      sun: '',
      copyMonday: '',
      copyTuesday: '',
      copyWednesday: '',
      copyThursday: '',
      copyFriday: '',
      copySaturday: '',
      copySunday: '',
      des: '',
      hidecreate: false,
      hideedit: true,
      hidecalendar: true,
      userName: '',
      employeeID: '',
      GrandTotal: '0',
      SaveUpdate: '',
      userid: '',
      username: '',
      MondayTotal: '0',
      TuesdayTotal: '0',
      WednesdayTotal: '0',
      ThursdayTotal: '0',
      FridayTotal: '0',
      SaturdayTotal: '0',
      SundayTotal: '0',
      requiredfielderror: true,
      timefielderror: true,
      savedisable:false
    };
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleWeekClick = this.handleWeekClick.bind(this);
    this.binddays = this.binddays.bind(this);
    this.additem = this.additem.bind(this);
    this.addrow = this.addrow.bind(this);
    this.totalChange = this.totalChange.bind(this);
    this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
    this.dropdownChange =this.dropdownChange.bind(this);

  }
  public async componentDidMount() {
   
    this.setState({
      rows:[]
    });
    console.log("Loading"+this.state.rows.length);
    await this.Timesheetentry();
  }
  // public async componentWillUnmount () {
  //   this.setState({
  //     rows:[]
  //   });
  //   console.log("Unloading"+this.state.rows.length);
  // }
  public async Timesheetentry() {
    var reacthandler = this;
    const params = new URLSearchParams(window.location.search);
    document.getElementById("date").style.visibility = "hidden";
    const user = await sp.web.currentUser.get();
    let userID = user.Id;
    var userName = user.Title;
    let date = new Date();
    let reqWeb = Web(this.props.siteUrl);
    let empWeb = Web(this.props.EmployeeSite);
    const item: any = await reqWeb.lists.getByTitle("TaskManagement").items.get();
    const office: any = await reqWeb.lists.getByTitle("OfficeTask").items.get();
    console.log(office);
    let data;
    const items = await empWeb.lists.getByTitle("Employees").getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><Eq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
        + userName + "</Value></Eq></Where></Query></View>",
    });
    console.log(items);
    // const items: any[] = await empWeb.lists.getByTitle("Employees").items.select("ID", "Department/Id").expand("Department").filter(" UserNameId eq " + userID).get();
    items.forEach(element => {
      var stringemp = element.ID.toString();
      var stringdep = element.DepartmentId.toString();
      this.setState({
        deptId: stringdep,
        empId: stringemp,
        employeeID: element.ID,
        userid: userID,
        username: userName
      });
    for (var k in item) {
      if (item[k].AssignedToId == user.Id && item[k].Status0 == "Approved") {
        TaskArr.push({
          ID: item[k].ID,
          Title: item[k].Title
        });
      }
    }
    for(var x in office){
      console.log(office[x].Task);
      TaskArr.push({
        ID: office[x].ID,
        Title: office[x].Task
      });

    }
    console.log(TaskArr);
    for (let i = 0; i < TaskArr.length; i++) {
        
       data = {
        key: TaskArr[i].Title,
        text: TaskArr[i].Title,
        id: TaskArr[i].ID,
        index:i,
        // dpselectedDayItem:{key:TaskArr[i].Title}
      };
    
      optionsArrays.push(data);
    }
   
    this.setState({
      opt: optionsArrays,
      office: OfficeTaskArr,
      selected_values: [{id: "", key: ""}]
    });

    this.currentday();
    this.addrow();
    
    });
  }
  public currentday = async () => {
    let date = new Date();

    this.setState({
      selectedDays: this.getWeekDays(this.getWeekRange(date).from),
    });
  }
  public getWeekRange(date) {
    return {
      from: moment(date)
        .startOf('week')
        .toDate(),
      to: moment(date)
        .endOf('week')
        .toDate(),
    };
  }
  public getWeekDays(weekStart) {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
      days.push(
        moment(weekStart)
          .add(i, 'days')
          .toDate()
      );
    }
    this.setState({
      weekday: days
    });
    this.binddays(days);
    return days;

  }
  public binddays = (days) => {

    var Sunday = new Date(days[0].toString()).toLocaleDateString();
    var Monday = new Date(days[1].toString()).toLocaleDateString();
    var Tuesday = new Date(days[2].toString()).toLocaleDateString();
    var Wednesday = new Date(days[3].toString()).toLocaleDateString();
    var Thursday = new Date(days[4].toString()).toLocaleDateString();
    var Friday = new Date(days[5].toString()).toLocaleDateString();
    var Saturday = new Date(days[6].toString()).toLocaleDateString();

    let Sundayy =days[0] ;
    const Mondayy = days[1];
    const Tuesdayy =days[2];
    const Wednesdayy =days[3];
    const Thursdayy =days[4];
    const Fridayy =days[5];
    const Saturdayy =days[6];
    let copySunday = moment(Sundayy).format('YYYY-MM-DDT12:00:00Z');
    let bindSunday = moment(Sundayy).format('DD/MM');
    let insertSunday = moment(Sundayy).format('DD/MM/YYYY');
    let copyMonday = moment(Mondayy).format('YYYY-MM-DDT12:00:00Z');
    let bindMonday = moment(Mondayy).format('DD/MM');
    let insertMonday = moment(Mondayy).format('DD/MM/YYYY');
    let copyTuesday = moment(Tuesdayy).format('YYYY-MM-DDT12:00:00Z');
    let bindtueday = moment(Tuesdayy).format('DD/MM');
    let insertTuesday = moment(Tuesdayy).format('DD/MM/YYYY');
    let copyWednesday = moment(Wednesdayy).format('YYYY-MM-DDT12:00:00Z');
    let bindwedday = moment(Wednesdayy).format('DD/MM');
    let insertWednesday = moment(Wednesdayy).format('DD/MM/YYYY');
    let copyThursday = moment(Thursdayy).format('YYYY-MM-DDT12:00:00Z');
    let bindthuday = moment(Thursdayy).format('DD/MM');
    let insertThursday = moment(Thursdayy).format('DD/MM/YYYY');
    let copyFriday = moment(Fridayy).format('YYYY-MM-DDT12:00:00Z');
    let bindFriday = moment(Fridayy).format('DD/MM');
    let insertFriday = moment(Fridayy).format('DD/MM/YYYY');
    let copySaturday = moment(Saturdayy).format('YYYY-MM-DDT12:00:00Z');
    let bindsatday = moment(Saturdayy).format('DD/MM');
    let insertSaturday = moment(Saturdayy).format('DD/MM/YYYY');

    this.setState({
      bindMonday: bindMonday,
      bindtueday: bindtueday,
      bindwedday: bindwedday,
      bindthuday: bindthuday,
      bindFriday: bindFriday,
      bindsatday: bindsatday,
      bindSunday: bindSunday,
      insertMonday: insertMonday,
      insertTuesday: insertTuesday,
      insertWednesday: insertWednesday,
      insertThursday: insertThursday,
      insertFriday: insertFriday,
      insertSaturday: insertSaturday,
      insertSunday: insertSunday,
      copyMonday: copyMonday,
      copyTuesday: copyTuesday,
      copyWednesday: copyWednesday,
      copyThursday: copyThursday,
      copyFriday: copyFriday,
      copySaturday: copySaturday,
      copySunday: copySunday
    });

    this.reloaddata();
  }
  public datepicker = async () => {
    document.getElementById("date").style.visibility = "visible";
    this.setState({
      hidecalendar: false
    });


  }
  public handleDayClick = date => {
    document.getElementById("date").style.visibility = "hidden";
    this.setState({
      hidecalendar: true
    });

    this.setState({
      selectedDays: this.getWeekDays(this.getWeekRange(date).from),
    });
  }
  public handleDayEnter = date => {
    this.setState({
      hoverRange: this.getWeekRange(date),
    });
  }
  public handleDayLeave = () => {
    this.setState({
      hoverRange: undefined,
    });
  }
  public handleWeekClick = (weekNumber, days, e) => {

    this.setState({
      selectedDays: days,
    });
  }
  public reloaddata = async () => {
    this.setState({
      rebind: []
    });
    var groupArray = require('group-array');
    let reqWeb = Web(this.props.siteUrl);
    let empWeb = Web(this.props.EmployeeSite);
    const user = await sp.web.currentUser.get();
    const userID = user.Id;
    const userName = user.Title;
    this.setState({ 
      userid: userID,
      username: userName
     });
    // const empData = await empWeb.lists.getByTitle("Employees").getItemsByCAMLQuery({
    //   ViewXml: "<View><Query><Where><Eq><FieldRef Name='UserName' /><Value Type='Person or Group'>"
    //     + this.state.username + "</Value></Eq></Where></Query></View>",
    // });

    // empData.forEach(element => {

    //   this.setState({
    //     employeeID: element.ID
    //   });
    // });

    let Monday;
    let Tuesday;
    let Wednesday;
    let Thursday;
    let Friday;
    let Saturday;
    let Sunday;
    let ID;
    let Task;
    let Date;
    let Time;
    let TaskDescription;
    let DayofWeek;
    let Weektotal;

    let search = [];
    DayArr = [];
    GroupTaskArr = [];

    search = await reqWeb.lists.getByTitle(this.props.ListName).getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='EmployeeId' /><Value Type='Text'>"
        + this.state.employeeID + "</Value></Eq><And><Geq><FieldRef Name='CopyTaskDate' /><Value Type='DateTime'>"
        + this.state.copySunday + "</Value></Geq> <Leq><FieldRef Name='CopyTaskDate' /><Value Type='DateTime' >"
        + this.state.copySaturday + "</Value></Leq></And></And></Where><GroupBy Collapse='TRUE' ><FieldRef Name='Task'/></GroupBy></Query></View>",
    });


    search.forEach(element => {
      ID = '';
      Task = '';
      Monday = '';
      Tuesday = '';
      Wednesday = '';
      Thursday = '';
      Friday = '';
      Saturday = '';
      Sunday = '';
      TaskDescription = '';
      ID = element.ID;
      Task = element.Task;
      Date = element.Date;
      Time = element.Time;
      TaskDescription = element.TaskDescription;

      DayofWeek = element.DayofWeek;
      if (this.state.insertMonday == Date && DayofWeek == "1") {
        Monday = Time;
      }
      if (this.state.insertTuesday == Date && DayofWeek == "2") {
        Tuesday = Time;
      }
      if (this.state.insertWednesday == Date && DayofWeek == "3") {
        Wednesday = Time;
      }
      if (this.state.insertThursday == Date && DayofWeek == "4") {
        Thursday = Time;
      }
      if (this.state.insertFriday == Date && DayofWeek == "5") {
        Friday = Time;
      }
      if (this.state.insertSaturday == Date && DayofWeek == "6") {
        Saturday = Time;
      }
      if (this.state.insertSunday == Date && DayofWeek == "7") {
        Sunday = Time;
      }

      DayArr.push({
        ID: ID,
        Task: Task,
        Monday: Monday,
        Tuesday: Tuesday,
        Wednesday: Wednesday,
        Thursday: Thursday,
        Friday: Friday,
        Saturday: Saturday,
        Sunday: Sunday,
        TaskDescription: TaskDescription,
      });

    });
    const group = DayArr.reduce((r, a) => {

      r[a.Task] = [...r[a.Task] || [], a];
      return r;
    }, {});

    Object.keys(group).forEach((key) => {
      ID = '';
      Task = '';
      Monday = '0';
      Tuesday = '0';
      Wednesday = '0';
      Thursday = '0';
      Friday = '0';
      Saturday = '0';
      Sunday = '0';
      TaskDescription = '';
      Weektotal = 0;
      let SundayTotal = 0;
      let MondayTotal = 0;
      group[key].forEach((object) => {


        ID = object.ID;
        Task = object.Task;
        TaskDescription = object.TaskDescription;
        if (object.Monday != "") {
          Monday = object.Monday;
        }

        if (object.Tuesday != "") {
          Tuesday = object.Tuesday;
        }

        if (object.Wednesday != "") {
          Wednesday = object.Wednesday;
        }

        if (object.Thursday != "") {
          Thursday = object.Thursday;
        }

        if (object.Friday != "") {
          Friday = object.Friday;
        }

        if (object.Saturday != "") {
          Saturday = object.Saturday;
        }

        if (object.Sunday != "") {
          
          Sunday = object.Sunday;
        }

        Weektotal = parseInt(Sunday) + parseInt(Monday) + parseInt(Tuesday) + parseInt(Wednesday) + parseInt(Thursday) + parseInt(Friday) + parseInt(Saturday);

      });
      GroupTaskArr.push({
        ID: ID,
        Task: Task,
        Monday: Monday,
        Tuesday: Tuesday,
        Wednesday: Wednesday,
        Thursday: Thursday,
        Friday: Friday,
        Saturday: Saturday,
        Sunday: Sunday,
        TaskDescription: TaskDescription,
        Weektotal: Weektotal,
        dpselectedDayItem: { key: Task }
      });
    });
    console.log(GroupTaskArr);
    this.setState({

      rows: GroupTaskArr,
      rebind: GroupTaskArr
    });

    if (this.state.rows.length == 0) {
      this.addrow();
      this.setState({
        SaveUpdate: "Save",
        hidecreate: false,
        hideedit: true
      });
    }
    else {
      this.setState({
        SaveUpdate: "Update",
        hidecreate: true,
        hideedit: false
      });
    }
    this.totalChange(0);
  }
  public addrow = () => {
    var rowcount = this.state.rowcount + 1;

    const item = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Weektotal: "",
      Task: "",
      TaskDescription: "",
      Taskid: ""

    };

    this.setState({
      rows: [...this.state.rows, item],
      rebind: [...this.state.rebind, item],
      rowcount: rowcount
    });
  }
 
  public handleChange = idx => e => {
    const { name, value } = e.target;

    const rows = [...this.state.rows];
    const item = {
      [name]: value
    };
   
    var newArray = this.state.rows;
    var arr = newArray[idx];
    
        if (name == "Sunday") {
      arr.Sunday = value;
    }
    if (name == "Monday") {
      arr.Monday = value;
    }
    if (name == "Tuesday") {
      arr.Tuesday = value;
    }
    if (name == "Wednesday") {
      arr.Wednesday = value;
    }
    if (name == "Thursday") {
      arr.Thursday = value;
    }
    if (name == "Friday") {
      arr.Friday = value;
    }
    if (name == "Saturday") {
      arr.Saturday = value;
    }
    if (name == "TaskDescription") {
      arr.TaskDescription = value;
    }
   
    this.setState({
      rows: newArray,
    });
  
    let weektotal;
    let Monday;
    let Tuesday;
   let Wednesday;
    let Thursday;
    let Friday;
    let Saturday;
    let Sunday;

    if (arr.Monday == "" || arr.Monday == 0) {
      Monday = 0;
    } else {
      Monday = parseFloat(arr.Monday);
    }
    if (arr.Tuesday == "" || arr.Tuesday == "0") {
      Tuesday = 0;
    } else {
      Tuesday = parseFloat(arr.Tuesday);
    }
    if (arr.Wednesday == "" || arr.Wednesday == "0") {
      Wednesday = 0;
    } else {
      Wednesday = parseFloat(arr.Wednesday);
    }
    if (arr.Thursday == ""  || arr.Thursday == "0") {
      Thursday = 0;
    } else {
      Thursday = parseFloat(arr.Thursday);
    }
    if (arr.Friday == "" || arr.Friday == "0") {
      Friday = 0;
    } else {
      Friday = parseFloat(arr.Friday);
    }
    if (arr.Saturday == "" || arr.Saturday == "0") {
      Saturday = 0;
    } else {
      Saturday = parseFloat(arr.Saturday);
    }
    if (arr.Sunday == "" || arr.Sunday == "0") {
      Sunday = 0;
    } else {
      Sunday = parseFloat(arr.Sunday);
    }
    weektotal = Sunday + Monday + Tuesday + Wednesday + Thursday + Friday + Saturday;
    arr.Sunday = Sunday;arr.Monday = Monday;arr.Tuesday = Tuesday;arr.Wednesday = Wednesday;
    arr.Thursday = Thursday;arr.Friday = Friday;arr.Saturday = Saturday;arr.Weektotal = weektotal;
    newArray[idx] = arr;
    this.setState({
      rows: newArray,

    });
    this.totalChange(idx);
  }
  public dropdownChange( idx: any,option: { key: any; }) {
    console.log(option.key);
    let Task = option.key;
    let Taskid;
    let index;
    let temp = 0;
    var newarray;
    this.state.opt.forEach(ddid => {
    if (Task == ddid.text.trim()) {
    Taskid = ddid.id;
    index =ddid.index;
    
    }
    });
    var newArray = this.state.rows;
    //var arr = newArray[idx];
    this.state.rows.forEach(Tasks =>{
    if(Task == Tasks.Task && Task != ""){
    
    temp = 1;
    }
    });
    if(temp == 1){
      newArray[idx]. Task= '';
      newArray[idx]. Taskid= '';
      newArray[idx].dpselectedDayItem= {
    key:''
    };
    alert("Task already selected . Please Select Another Task");
    }
    else{
     newArray[idx].Task = Task;
     newArray[idx].Taskid = Taskid;
     newArray[idx].dpselectedDayItem= {
      key:Task
      };
    }
   // newArray[idx] = arr;
    this.setState({
    rows: newArray,
    });
    
    }
  public numvalid(e){
  //   if (e.keyCode === 8) {
  //     console.log('delete');
  // }
  }
  public handleRemoveSpecificRow = (idx) => async () => {
    const rows = [...this.state.rows];
    console.log(rows);
    console.log(rows[idx].Task);
    let search = [];
    let reqWeb = Web(this.props.siteUrl);
    var Deleteid;
    var rowtask = rows[idx].Task;
    search = await reqWeb.lists.getByTitle(this.props.ListName).getItemsByCAMLQuery({
      ViewXml: "<View><Query><Where><And><Eq><FieldRef Name='EmployeeId' /><Value Type='Text'>"
        + this.state.employeeID + "</Value></Eq><And><Geq><FieldRef Name='CopyTaskDate' /><Value Type='DateTime'>"
        + this.state.copySunday + "</Value></Geq> <Leq><FieldRef Name='CopyTaskDate' /><Value Type='DateTime' >"
        + this.state.copySaturday + "</Value></Leq></And></And></Where><GroupBy Collapse='TRUE' ><FieldRef Name='Task'/></GroupBy></Query></View>",
    });
    console.log(search);
    if ((rows[idx].Sunday == 0 && rows[idx].Monday == 0 && rows[idx].Tuesday == 0 &&
      rows[idx].Wednesday == 0 && rows[idx].Thursday == 0 && rows[idx].Friday == 0 &&
      rows[idx].Saturday == 0) || (rows[idx].Sunday == "" && rows[idx].Monday == "" && rows[idx].Tuesday == "" &&
        rows[idx].Wednesday == "" && rows[idx].Thursday == "" && rows[idx].Friday == "" &&
        rows[idx].Saturday == "")) {
      if (confirm('Are you sure you want to delete the row?')) {
        search.forEach(async element => {
          if (rowtask == element.Task) {
            Deleteid = element.ID;
            await reqWeb.lists.getByTitle(this.props.ListName).items.getById(Deleteid).delete();
          }
        });
        rows.splice(idx, 1);
        alert("Time sheet entry deleted.");
      }
    }
    else {
      alert("Unable to delete, the row having time details. If you want to delete please set the time as 0");
    }

    this.setState({ rows });
  }
  public handleRemoveRow = () => {

    const rows = [...this.state.rows];
    console.log(rows);
    let idx = rows.length - 1;

    if ((rows[idx].Sunday == 0 && rows[idx].Monday == 0 && rows[idx].Tuesday == 0 &&
      rows[idx].Wednesday == 0 && rows[idx].Thursday == 0 && rows[idx].Friday == 0 &&
      rows[idx].Saturday == 0) || (rows[idx].Sunday == "" && rows[idx].Monday == "" && rows[idx].Tuesday == "" &&
        rows[idx].Wednesday == "" && rows[idx].Thursday == "" && rows[idx].Friday == "" &&
        rows[idx].Saturday == "")) {
      if (confirm('Are you sure you want to delete the row?')) {
        rows.splice(idx, 1);
      }
      this.setState({
        rows: this.state.rows.slice(0, -1),
        rebind: this.state.rebind.slice(0, -1)
      });
    }
    else {
      alert("Unable to delete, the row having time details.");
    }

  }
  public additem = async () => {
    this.setState({ requiredfielderror: true,
      timefielderror:true,
      savedisable:true
     });
    const user = await sp.web.currentUser.get();
    let userID = user.Id;
    var userName = user.Title;
    var today = new Date();
    let date = today.toLocaleString();
    let reqWeb = Web(this.props.siteUrl);
    let empWeb = Web(this.props.EmployeeSite);
    var Taskid;
    var flagi=1;
    let timeSheetList = await reqWeb.lists.getByTitle(this.props.ListName);
    const entityTypeFullName = timeSheetList.getListItemEntityTypeFullName();
    
    
    var rowCount = 0;

    let batch = sp.web.createBatch();
   
   
    this.state.rows.forEach(async element => {
      Taskid = element.Taskid;
      if (element.Task == "" || element.TaskDescription == "") {
        flagi=0;
        this.setState({ requiredfielderror: false });
      }
      else if(element.Monday != "" && element.Monday < 0||element.Tuesday != "" && element.Tuesday < 0||
    element.Wednesday != "" && element.Wednesday < 0||element.Thursday != "" && element.Thursday < 0||
    element.Friday != "" && element.Friday < 0||element.Saturday != "" && element.Saturday < 0||
    element.Sunday != "" && element.Sunday < 0){
      flagi=0;
      this.setState({ timefielderror: false });
    }
    
      else {
        if (element.Monday == "" ){
          element.Monday=0;
        }
          await this.upsert(timeSheetList, reqWeb, element, batch, date, Taskid, this.state.insertMonday, this.state.copyMonday, "Monday");
        
        if (element.Tuesday == "" ){element.Tuesday = 0;}
          await this.upsert(timeSheetList, reqWeb, element, batch, date, Taskid, this.state.insertTuesday, this.state.copyTuesday, "Tuesday");

        if (element.Wednesday == "" ){element.Wednesday = 0;}
          await this.upsert(timeSheetList, reqWeb, element, batch, date, Taskid, this.state.insertWednesday, this.state.copyWednesday, "Wednesday");

        if (element.Thursday == "" ){element.Thursday = 0;}
          await this.upsert(timeSheetList, reqWeb, element, batch, date, Taskid, this.state.insertThursday, this.state.copyThursday, "Thursday");

        if (element.Friday == ""){element.Friday = 0;}
          await this.upsert(timeSheetList, reqWeb,  element, batch, date, Taskid, this.state.insertFriday, this.state.copyFriday, "Friday");

        if (element.Saturday == ""){element.Saturday = 0; }
          await this.upsert(timeSheetList, reqWeb, element, batch, date, Taskid, this.state.insertSaturday, this.state.copySaturday, "Saturday");

        if (element.Sunday == "" ){element.Sunday = 0;}
          await this.upsert(timeSheetList, reqWeb, element, batch, date, Taskid, this.state.insertSunday, this.state.copySunday, "Sunday");
      }
      rowCount++;
      if (rowCount == this.state.rows.length) {
        batch.execute().then(res => {
          if(flagi!=0){
          alert("Data Saved Successfully");
          
          }
          this.setState({ savedisable:false });
        });
      }
    });

  }
  private async upsert(timeSheetList, reqWeb, element, batch, date, Taskid, insertWeekDay, copyWeekDay, dayOfWeek) {
    const listdata = await this.getTimesheetForADay(reqWeb, element,this.getDayOfWeek(dayOfWeek), insertWeekDay);
    if (listdata.length == 0) {
      timeSheetList.items.inBatch(batch).add(this.createTimeSheetObject(element, element[dayOfWeek], date, Taskid, this.getDayOfWeek(dayOfWeek), insertWeekDay, copyWeekDay)
      );
    }
    else {
      var updateid;
      listdata.forEach(async editid => {
        updateid = editid.ID;
      });
      timeSheetList.items.inBatch(batch).getById(updateid).update({
        TaskDescription: element.TaskDescription,
        Time: element[dayOfWeek],
        UserId: this.state.userid,
        UpdatedDate: date,
      });
    }
  }
  private getDayOfWeek(day) {
    let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek.indexOf(day) + 1;
  }
  private getTimesheetForADay(reqWeb, element, dayOfWeek,insertdate) {
    return reqWeb.lists.getByTitle(this.props.ListName).getItemsByCAMLQuery({
      ViewXml:
        "<View><Query><Where><And><And><Eq><FieldRef Name='DayofWeek' />  <Value Type='Number'>"+dayOfWeek+"</Value></Eq><Eq><FieldRef Name='Task' /> <Value Type='Text'>" + element.Task +
        "</Value></Eq></And><And><Eq><FieldRef Name='User' /> <Value Type='User'>" + this.state.username + "</Value></Eq><Eq><FieldRef Name='Date' /> <Value Type='Text'>" + insertdate +
        "</Value></Eq></And></And></Where></Query></View>"
    });
  }
  private createTimeSheetObject(element, time, updateddate, taskid, dayOfWeek, taskDate, copyTaskDate) {
    return {
      Task: element.Task,
      TaskDescription: element.TaskDescription,
      Time: time,
      DayofWeek: dayOfWeek,
      UserId: this.state.userid,
      UpdatedDate: updateddate,
      EmployeeId: this.state.empId,
      DepartmentId: this.state.deptId,
      TaskManagementId: taskid,
      Date: taskDate,
      CopyTaskDate: copyTaskDate
    };
  }
  public totalChange = async (idx) => {
    let GrandTotal = 0;
    let MondayTotal = 0;
    let TuesdayTotal = 0;
    let WednesdayTotal = 0;
    let ThursdayTotal = 0;
    let FridayTotal = 0;
    let SaturdayTotal = 0;
    let SundayTotal = 0;
    let flag = 0;
    let demo;
    this.state.rows.forEach(element => {
      let Weektotal = 0;
      if (element.Monday != "") {
        // MondayTotal= MondayTotal+parseFloat(element.Monday);
        if (MondayTotal + parseFloat(element.Monday) > 24) {
          this.state.rows[idx].Monday = 0;

          flag = 1;
        } else {
          MondayTotal = MondayTotal + parseFloat(element.Monday);
          Weektotal = Weektotal + parseFloat(element.Monday);
        }

      }
      if (element.Tuesday != "") {
        if (TuesdayTotal + parseFloat(element.Tuesday) > 24) {
          this.state.rows[idx].Tuesday = 0;
          flag = 1;
        } else {
          TuesdayTotal = TuesdayTotal + parseFloat(element.Tuesday);
          Weektotal = Weektotal + parseFloat(element.Tuesday);
        }

      }
      if (element.Wednesday != "") {
        if (WednesdayTotal + parseFloat(element.Wednesday) > 24) {
          this.state.rows[idx].Wednesday = "";
          flag = 1;
        } else {
          WednesdayTotal = WednesdayTotal + parseFloat(element.Wednesday);
          Weektotal = Weektotal + parseFloat(element.Wednesday);
        }

      }
      if (element.Thursday != "") {
        if (ThursdayTotal + parseFloat(element.Thursday) > 24) {
          this.state.rows[idx].Thursday = "";
          flag = 1;
        } else {
          ThursdayTotal = ThursdayTotal + parseFloat(element.Thursday);
          Weektotal = Weektotal + parseFloat(element.Thursday);
        }
      }
      if (element.Friday != "") {
        if (FridayTotal + parseFloat(element.Friday) > 24) {
          this.state.rows[idx].Friday = "";
          flag = 1;
        } else {
          FridayTotal = FridayTotal + parseFloat(element.Friday);
          Weektotal = Weektotal + parseFloat(element.Friday);
        }

      }
      if (element.Saturday != "") {
        if (SaturdayTotal + parseFloat(element.Saturday) > 24) {
          demo = this.state.rows[idx].Saturday;
          this.state.rows[idx].Saturday = "";
          flag = 1;

        } else {
          SaturdayTotal = SaturdayTotal + parseFloat(element.Saturday);
          Weektotal = Weektotal + parseFloat(element.Saturday);
        }

      }
      if (element.Sunday != "") {
        if (SundayTotal + parseFloat(element.Sunday) > 24) {
          this.state.rows[idx].Sunday = "";
          flag = 1;
        } else {
          SundayTotal = SundayTotal + parseFloat(element.Sunday);
          Weektotal = Weektotal + parseFloat(element.Sunday);
        }
      }
      element.Weektotal = Weektotal;
      console.log(element.Weektotal);
      if (element.Weektotal != "") {

        GrandTotal = GrandTotal + element.Weektotal;
      }
      this.setState({
        GrandTotal: GrandTotal,
        MondayTotal: MondayTotal,
        TuesdayTotal: TuesdayTotal,
        WednesdayTotal: WednesdayTotal,
        ThursdayTotal: ThursdayTotal,
        FridayTotal: FridayTotal,
        SaturdayTotal: SaturdayTotal,
        SundayTotal: SundayTotal

      });

    });
    if (flag == 1) {
      alert("The time entered for a day should not be greater than 24 hours. Please, verify it and try again.");

    }
  }
  private timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }
  private Cancel = async () => {
    window.location.href = this.props.Redirect;
  }
  public render(): React.ReactElement<ITimeSheetProps> {
    const { hoverRange, selectedDays } = this.state;
    const daysAreSelected = selectedDays.length > 0;
    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6],
      },
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6],
    };
    const modifiersStyles = {
      selectedRange:{
        height:"30px"
      }
    };
    const emojiIcon: IIconProps = { iconName: 'Cancel' };
    const { firstDayOfWeek } = this.state;
    
    return (
      <div className={ styles.timeSheet }>
      <div >
      <div style={{ paddingBottom: '10px', paddingTop: '10px' }}>
          <h2 className='od-ItemContent-title' style={{ fontWeight: "normal" }}>Time Sheet</h2>
        </div>
        <table>
          <tr><td><PrimaryButton text="--Select Date--" onClick={this.datepicker} /></td>
            <td hidden={this.state.hidecalendar}  ><div id= "date" >
              <DayPicker
              className ={styles.daypicker} 
              selectedDays={selectedDays}
              showWeekNumbers
              showOutsideDays
              modifiers={modifiers}
              onDayClick={this.handleDayClick}
              onWeekClick={this.handleWeekClick}/></div> </td>
            <td><DefaultButton id="buttonadd"  text="ADD ROW" onClick={this.addrow}  /></td>
            {/* <td><DefaultButton id="buttondelete"  text="DELETE ROW" onClick={this.handleRemoveRow}  /></td> */}
          </tr>  
        </table>  
        <div hidden={this.state.requiredfielderror} style={{ color: "red" }}>Please enter all mandatory fields</div>
        <div hidden={this.state.timefielderror} style={{ color: "red" }}>Please enter value greater than 0</div>  
          <table>
                <tr>
                  <th>Task<span style={{color:"red"}}>*</span></th>
                  <th> Task Description<span style={{color:"red"}}>*</span></th>
                  <th>{this.state.bindSunday}  Sun</th>
                  <th>{this.state.bindMonday}  Mon</th>
                  <th>{this.state.bindtueday}  Tue</th>
                  <th>{this.state.bindwedday}  Wed</th>
                  <th>{this.state.bindthuday}  Thu</th>
                  <th>{this.state.bindFriday}  Fri</th>
                  <th>{this.state.bindsatday}  Sat</th>
                  <th>Total</th>
                </tr>
              <tbody id="create" >
                  {this.state.rows.map((item, idx) => (
                <tr>
                  {/* <td><Select
              closeOnSelect={false}
               multi
               onChange={this.dropdownChange( idx)}
               options={this.state.opt}
               placeholder="Select"
               removeSelected={true}
               value={this.state.selected_values}
         /></td> */}
                   <td ><Dropdown  id={this.state.rowcount+"Task"} 
                  placeholder="Select Task" options={this.state.opt} 
                   key={idx} 
                    selectedKey={item.dpselectedDayItem ? item.dpselectedDayItem.key : undefined} 
                    onChanged={this.dropdownChange.bind(this,idx)} 
                    style={{ width: "300px" }}  /></td>
                  {/* <td ><Dropdown  id={this.state.rowcount+"Task"} placeholder="Select Task" options={this.state.opt} selectedKey={item.Task}   onChange={this.dropdownChange( idx)} style={{ width: "130px" }} /></td> */}
                   
                   <td><TextField id={this.state.rowcount+"des"}  name= "TaskDescription"  style={{ width: "300px" }} value={item.TaskDescription} onChange={this.handleChange(idx)} required ></TextField></td>   
                   <td><TextField  type="number" id={this.state.rowcount+"sun"} name="Sunday" value={item.Sunday} style={{ width: "72px" }}  onChange={this.handleChange(idx)}  onKeyDown={this.numvalid}></TextField></td>
                   <td><TextField type="number" id={this.state.rowcount+"mon"} name="Monday" value={item.Monday} style={{ width: "72px" }} onChange={this.handleChange(idx)}></TextField></td>
                   <td><TextField type="number" id={this.state.rowcount+"tue"} name="Tuesday"value={item.Tuesday} style={{ width: "72px" }} onChange={this.handleChange(idx)}></TextField></td>
                   <td><TextField type="number" id={this.state.rowcount+"wed"} name="Wednesday"value={item.Wednesday} style={{ width: "72px" }} onChange={this.handleChange(idx)}></TextField></td>
                   <td><TextField type="number" id={this.state.rowcount+"thu"} name="Thursday"value={item.Thursday} style={{ width: "72px" }} onChange={this.handleChange(idx)}></TextField></td>
                   <td ><TextField type="number" id={this.state.rowcount+"fri"} name="Friday"value={item.Friday}style={{ width: "72px" }} onChange={this.handleChange(idx)}></TextField></td>
                   <td ><TextField type="number" id={this.state.rowcount+"sat"} name="Saturday" value={item.Saturday}style={{ width: "72px" }} onChange={this.handleChange(idx)}></TextField></td>
                   <td> <TextField id={this.state.rowcount+"total"} name="total" value={item.Weektotal} style={{ width: "72px" }} disabled ></TextField></td>
                   <td ><IconButton iconProps={emojiIcon} title="Cancel" ariaLabel="Cancel" onClick={this.handleRemoveSpecificRow(idx)} /></td>
                </tr>
                  ))}
                </tbody>
               
                
               <tr>
                 <td ></td>
                 <td >TOTAL</td>
                 <td ><TextField id="sun" name="sun" style={{ width: "72px" }} value={this.state.SundayTotal}  disabled></TextField></td>
                 <td><TextField id="mon" name="mon" style={{ width: "72px" }} value={this.state.MondayTotal}  disabled></TextField></td>
                 <td><TextField id="tue" name="tue" style={{ width: "72px" }} value={this.state.TuesdayTotal} disabled></TextField></td>
                 <td><TextField id="wed" name="wed" style={{ width: "72px" }} value={this.state.WednesdayTotal} disabled></TextField></td>
                 <td><TextField id="thu" name="thu" style={{ width: "72px" }} value={this.state.ThursdayTotal} disabled></TextField></td>
                 <td><TextField id="fri" name="fri" style={{ width: "72px" }} value={this.state.FridayTotal} disabled></TextField></td>
                 <td ><TextField id="sat" name="sat" style={{ width: "72px" }} value={this.state.SaturdayTotal} disabled></TextField></td>
                 <td ><TextField id="total" name="total" style={{ width: "72px" }} value={this.state.GrandTotal} disabled></TextField></td>
                 </tr>
                 <tr>
                 <td ></td>
                 <td ></td>
                 <td ></td>
                 <td ></td>
                 <td ></td>
                 <td ></td>
                 <td ></td>
                 <td ></td>
                 <td ><DefaultButton id="b1"  text="SAVE" onClick={this.additem}  style={{ width: "72px"}} disabled={this.state.savedisable} /></td>
                 <td ><DefaultButton id="b1"  text="CANCEL" onClick={this.Cancel}  style={{ width: "72px"}}  /></td>
                 </tr>
              </table>
              
             
            </div>
            </div>
    );
  }
}
