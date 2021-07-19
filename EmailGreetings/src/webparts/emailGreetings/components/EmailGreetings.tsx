import * as React from 'react';
import styles from './EmailGreetings.module.scss';
import { IEmailGreetingsProps } from './IEmailGreetingsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp,  Web } from '@pnp/sp/presets/all';
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";

import {
  DocumentCard,
  DocumentCardPreview,
  DocumentCardTitle,
  DocumentCardActivity,
  IDocumentCardPreviewProps
} from 'office-ui-fabric-react/lib/DocumentCard';

import {
  TextField,
  DialogFooter, 
  PrimaryButton, 
} from "office-ui-fabric-react";

export interface IEmailGreetingsState {

  msg           : any;
  empId         : any;
  email         : any;
  celType       : any;
  subject       : any;
  FullName      : any;
  fromMail      : any;
  fromName      : any;
  ImageUrl      : any;
  SpouseName    : any;
  DateofJoining : any;
  msgError: any;
 
}

export default class EmailGreetings extends React.Component<IEmailGreetingsProps,IEmailGreetingsState, any > {

  
  constructor(props: IEmailGreetingsProps) {

    super(props);

    this.state = {
      msg           :'',
      email         : '',
      empId         :'',
      celType       : '',
      subject       : '',
      ImageUrl      : '',
      fromMail      : '',
      fromName      : '',
      FullName      : '',
      SpouseName    : '',
      DateofJoining : '',
      msgError: ''
     
    };

    this.sendWish    = this.sendWish.bind(this);
    this.getDetails  = this.getDetails.bind(this);
  

  }

  public async componentDidMount() {

    this.getDetails();
   
    }

  public async getDetails()
  {

    let username;
    username = await sp.web.currentUser.get();
    //console.log(username.Title); 

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const emp = urlParams.get('EmpId');
    const type = urlParams.get('Type');

    this.setState({
      empId    : emp,
      celType  : type,
      fromMail : username.Email,
      fromName : username.Title
    });

    let reqWeb = Web(this.props.listSiteUrl);

    const Employeeitem: any = await reqWeb.lists.getByTitle("Employees").items.select("Title", "FullName", "DOJ", "SpouseName", "Location/Id", "Location/Title", "Department/Id", "Department/Title", "Designation/Id", "Designation/Title", "Extension", "TelephoneNumber", "MobileNo", "EmailId", "DOW", "BloodGroup", "ImageURL").expand("Department", "Designation", "Location").filter("Title eq " + emp).get();
    console.log(Employeeitem);

    for (let i = 0; i < Employeeitem.length; i++) {
      
      //console.log(Employeeitem[0].ImageURL.Url);
      
      this.setState({ 
        FullName: Employeeitem[0].FullName,
        DateofJoining: Employeeitem[0].DOJ,
        ImageUrl:Employeeitem[0].ImageURL.Url,
        SpouseName: Employeeitem[0].SpouseName,
        email: Employeeitem[0].EmailId
       });

    }
    

    if(type == "birthday")
    {

      this.setState({
        msg:"Many Many Happy Returns of the Day...!!!",
        subject: "Greetings from " + this.state.fromName
      });

    }
    else if(type == "wedding")
    {
      this.setState({
        msg:"Happy wedding anniversary...!!!",
        subject: "Greetings from " + this.state.fromName
      });

    }

  }


  public async sendWish()
  {

    if(this.state.celType == "birthday")
    {

      let mailMessage         = ((document.getElementById("Message") as HTMLInputElement).value);
   // console.log(mailMessage);

   if (mailMessage == undefined || mailMessage == null || mailMessage == '')
   {

    return this.setState({
      msgError: "Required"
    });

   }
   else{

    alert("Greetings Send Successfully");
      const emailProps: IEmailProperties = {
        From:this.state.fromMail,
      To: [this.state.email],
      Subject: this.state.subject,
      Body: mailMessage,
      AdditionalHeaders: {
          "content-type": "text/html"
      }
  };
  
  await sp.utility.sendEmail(emailProps);
  console.log("Email Sent!");

  let employeePortal ="https://mrbutlers.sharepoint.com/sites/EmployeePortal/";

   window.location.href = employeePortal;

   }
   

    }

    else if(this.state.celType == "wedding")
    {



      let mailMessage         = ((document.getElementById("Message") as HTMLInputElement).value);
      //console.log(mailMessage);

      if (mailMessage == undefined || mailMessage == null || mailMessage == '')
      {
   
       return this.setState({
         msgError: "Required"
       });
   
      }
      else{

        let msgWed;

        if(this.state.SpouseName == undefined || this.state.SpouseName == null || this.state.SpouseName == '')
        {
          
          msgWed="<p>To: "+this.state.FullName+",</p><p>"+mailMessage+"</p>";
          
        }

        else 
        {

          msgWed="<p>To: "+this.state.FullName+"& "+this.state.SpouseName+",</p><p>"+mailMessage+"</p>";

        }

        

      alert("Greetings Send Successfully");
  
        const emailProps: IEmailProperties = {
          From:this.state.fromMail,
        To: [this.state.email],
        Subject: this.state.subject,
        Body: msgWed,
        AdditionalHeaders: {
            "content-type": "text/html"
        }
    };
    
    await sp.utility.sendEmail(emailProps);
    console.log("Email Sent!");

    let employeePortal ="https://mrbutlers.sharepoint.com/sites/EmployeePortal/";

    window.location.href = employeePortal;

      }

      

    }

  }

  public render(): React.ReactElement<IEmailGreetingsProps> {

    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: this.state.ImageUrl,
          width: 203,
          accentColor: '#498205'
        }
      ],
    };

    return (
      <div className={ styles.reminderDiv }>

    <DocumentCard style={{width:200, objectFit:'contain'}}>
      <DocumentCardPreview { ...previewProps } />
      <DocumentCardTitle title={this.state.FullName} />
    </DocumentCard>

    <br></br>

    <TextField placeholder="Message" id="Message" defaultValue={this.state.msg} style={{color:'#498205'}} errorMessage={this.state.msgError}  multiline autoAdjustHeight required />

    <DialogFooter>

        <PrimaryButton text="Send Email" className={ styles.buttonStyle } onClick={this.sendWish} />

    </DialogFooter>  
      </div>
    );
  }
}
