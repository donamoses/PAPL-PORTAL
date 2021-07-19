import * as React from 'react';
import styles from './Attachment.module.scss';
import { IAttachmentProps } from './IAttachmentProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";
// import { Carousel } from 'react-responsive-carousel';  
import Carousel from 'react-elastic-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import * as moment from 'moment';
import { Accordion } from "@pnp/spfx-controls-react/lib/Accordion";

import {
  css,
  Persona,
  PersonaSize,
  PersonaPresence,
  Spinner
} from 'office-ui-fabric-react';
export interface IAnnouncement {
  ID: any;
  Title: any;
  Announcement: any;
  ExpDate: any;
  Created: any;

}

var AnnouncementArr: IAnnouncement[] = [];
var ArticleArr: IAnnouncement[] = [];
var sorted_meetings: IAnnouncement[] = [];
export interface IWorkingWithState {
  title: string;
  announcement: IAnnouncement[];
  loading: boolean;
  error: string;
}
export default class Attachment extends React.Component<IAttachmentProps, IWorkingWithState, {}> {
  public constructor(props: IAttachmentProps, state: IWorkingWithState) {
    super(props);
    this.state = {
      title: null,
      announcement: [],
      loading: true,
      error: null
    };
  }
  public async componentDidMount() {
    // this.loadPeople(this.props.siteUrl, this.props.numberOfPeople);
    await this.LoadList();
  }
  public render(): React.ReactElement<IAttachmentProps> {
    if (this.state.announcement.length == 0) {
      return (

        <div><h1>{this.props.Error}</h1></div>
      )
    }
    else {

      return (

        <div className={styles.attachment} style={{
          borderRadius: "5px", border: "1px solid gray", paddingBottom: "5px", paddingTop: "10px"
        }}>
          <div style={{ display: (this.state.announcement.length == 0 ? 'none' : 'block') }} className={styles.title} >{this.props.Title}</div>
          <div className={styles.container} style={{ height: this.props.Height }}>

            {
              this.state.announcement.map((item, index) => (
                <Accordion title={item.Title} defaultCollapsed={true} className={"itemCell"} key={index}>
                  <div className={"itemContent"}>
                    <div className={"itemResponse"} dangerouslySetInnerHTML={{ __html: item.Announcement }}></div>

                  </div>
                </Accordion>
              ))
            }

            {/* <table id="announcement" >

              <tbody>
                <tr><tr><td style={{ display: (this.state.announcement.length == 0 ? 'none' : 'block') }} className={styles.title} >{this.props.Title}</td></tr></tr>

                {this.state.announcement.map((items) => {
                  return (<div>
                    <tr>

                      <tr><td className={styles.row} style={{ fontWeight: 'bold' }}>{items.Title}</td></tr>
                      <tr><td><div className={styles.AnnouncementDatatitle} dangerouslySetInnerHTML={{ __html: items.Announcement }} /></td></tr>
                    </tr>
                  </div>
                  );
                })}

              </tbody>

            </table> */}


          </div>
        </div>
      );
    }
  }
  private navigateTo(url: string): void {
    window.open(url, '_blank');
  }
  private async LoadList() {

    var reacthandler = this;
    let url = this.props.siteUrl + 'Lists/' + this.props.ListName;
    // alert(this.props.ListName);
    console.log(sp.web);
    if (this.props.ListName == "Announcement") {
      var AnnouncementArr: IAnnouncement[] = [];
      var sorted_meetings: IAnnouncement[] = [];
      sp.web.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
        console.log(data);

        let dd;
        let mm;
        let d = new Date();
        let yy = d.getFullYear();
        let m = d.getMonth() + 1;
        let da = d.getDate();
        if (da < 10) {
          dd = '0' + da;
        }
        else {
          dd = da;
        }
        if (m < 10) {
          mm = '0' + m;
        }
        else {
          mm = m;
        }
        let today = yy + '-' + mm + '-' + dd;
        for (var k in data) {
          let status = data[k].Status;

          let returnDate: Date = new Date(data[k].ExpDate);
          const format1 = "YYYY-MM-DD";
          const expdate = moment(returnDate).format(format1);


          if (expdate < today) {

          }
          else if (expdate == today && status == "Approved") {
            AnnouncementArr.push({
              ID: data[k].ID,
              Title: data[k].Title,
              Announcement: data[k].Announcement,
              ExpDate: moment(data[k].ExpDate).format('MM/DD/YYYY'),
              Created: data[k].Created

            });
          }
          else {
            if (status == "Approved") {
              AnnouncementArr.push({
                ID: data[k].ID,
                Title: data[k].Title,
                Announcement: data[k].Announcement,
                ExpDate: moment(data[k].ExpDate).format('MM/DD/YYYY'),
                Created: data[k].Created

              });
            }
          }


        }

        sorted_meetings = AnnouncementArr.sort((a, b) => {
          return new Date(b.Created).getDate() - new Date(a.Created).getDate();
        });
        if (sorted_meetings.length != 0) {

          this.setState({

            loading: false,
            error: null,
            announcement: sorted_meetings
          });
        }
        else {
          this.setState({
            title: this.props.Title,
            loading: false,
            announcement: [],
            error: this.props.Error

          });
        }
        reacthandler.setState({ announcement: sorted_meetings });

        console.log(AnnouncementArr);
        return sorted_meetings;
      });
    }
    else if (this.props.ListName == "Articles") {
      var ArticleArr: IAnnouncement[] = [];
      var sorted_meetings: IAnnouncement[] = [];
      sp.web.lists.getByTitle(this.props.ListName).items.getAll().then(async (data) => {
        console.log(data);

        let dd;
        let mm;
        let d = new Date();
        let yy = d.getFullYear();
        let m = d.getMonth() + 1;
        let da = d.getDate();
        if (da < 10) {
          dd = '0' + da;
        }
        else {
          dd = da;
        }
        if (m < 10) {
          mm = '0' + m;
        }
        else {
          mm = m;
        }
        let today = yy + '-' + mm + '-' + dd;
        for (var k in data) {
          let status = data[k].Status;

          let returnDate: Date = new Date(data[k].ExpDate);
          const format1 = "YYYY-MM-DD";
          const expdate = moment(returnDate).format(format1);


          if (expdate < today) {

          }
          else if (expdate == today && status == "Approved") {
            ArticleArr.push({
              ID: data[k].ID,
              Title: data[k].Title,
              Announcement: data[k].Article,
              ExpDate: moment(data[k].ExpDate).format('MM/DD/YYYY'),
              Created: data[k].Created

            });
          }
          else {
            if (status == "Approved") {
              ArticleArr.push({
                ID: data[k].ID,
                Title: data[k].Title,
                Announcement: data[k].Article,
                ExpDate: moment(data[k].ExpDate).format('MM/DD/YYYY'),
                Created: data[k].Created

              });
            }
          }


        }

        sorted_meetings = ArticleArr.sort((a, b) => {
          return new Date(a.ExpDate).getDate() - new Date(b.ExpDate).getDate();
        });
        if (sorted_meetings.length != 0) {

          this.setState({

            loading: false,
            error: null,
            announcement: sorted_meetings
          });
        }
        else {
          this.setState({
            title: this.props.Title,
            loading: false,
            announcement: [],
            error: this.props.Error

          });
        }
        reacthandler.setState({ announcement: sorted_meetings });

        console.log(ArticleArr);
        return sorted_meetings;
      });

    }
  }


}