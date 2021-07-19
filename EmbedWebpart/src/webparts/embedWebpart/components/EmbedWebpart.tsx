import * as React from 'react';
import styles from './EmbedWebpart.module.scss';
import { IEmbedWebpartProps } from './IEmbedWebpartProps';
import Iframe from 'react-iframe';
import { sp, Web } from "@pnp/sp/presets/all";
import $ from 'jquery';
import { escape } from '@microsoft/sp-lodash-subset';
import Pagination from 'office-ui-fabric-react-pagination';
///import jsPDF from 'jspdf'
//import 'jspdf-autotable'
//import { Component, Input, OnInit, Inject } from '@angular/core';
declare let jsPDF;

export interface IEmbedWebpartState {
  user: string;
  userid: number;
  empid: number;
}

export default class EmbedWebpart extends React.Component<IEmbedWebpartProps, IEmbedWebpartState, {}> {
  
  public constructor(props: IEmbedWebpartProps) {
    super(props);
    this.state = {
      user: '',
      userid: null,
      empid: null


    };
  }
  public async componentDidMount() {



    let username;
    username = await sp.web.currentUser.get();
    console.log(username.Id);
    let reqWeb = Web(this.props.EmployeesiteUrl);
    const EmployeeListitems: any[] = await reqWeb.lists.getByTitle("Employees").items.select("Title").filter(" UserNameId eq " + username.Id).get();
    console.log(EmployeeListitems[0].Title);
    this.setState({ empid: EmployeeListitems[0].Title });
    //let eurl = this.props.EmbedUrl + this.state.empid;


  }

  public render(): React.ReactElement<IEmbedWebpartProps> {
    const doc = new jsPDF()
 
// It can parse html:
// <table id="my-table"><!-- ... --></table>
doc.autoTable({ html: '#my-table' })
 
// Or use javascript directly:
doc.autoTable({
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain'],
    // ...
  ],
})
 
doc.save('table.pdf')
    let eurl = this.props.EmbedUrl + this.state.empid;
    console.log(eurl);
    //alert(eurl);
    //alert(this.state.empid);
    return (
      <div className={styles.embedWebpart}>
        <Iframe url={eurl}
          width={this.props.Height}
          height={this.props.Width}
          allowpaymentrequest={true}
          id="myId"
          className="myClassname"
          display="inline"
          position="relative" />
        <div>
          <p>{eurl}</p>
        </div>



      </div>
    );
  }

}
