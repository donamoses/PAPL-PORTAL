import * as React from 'react';
import styles from './BulletinBoard.module.scss';
import { IBulletinBoardProps } from './IBulletinBoardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp, IList, Web } from "@pnp/sp/presets/all";
var BulletinArr=[];
export interface IWorkingWithState {
  BulletinArr:any[];
 }
export default class BulletinBoard extends React.Component<IBulletinBoardProps,IWorkingWithState, {}> {
  public constructor(props:  IBulletinBoardProps, state:IWorkingWithState ){ 
    super(props); 
  this.state = { 
    
    BulletinArr: [],
    
  };
}
  public async componentDidMount() {
    
   await this.LoadList();
   }
   private async LoadList(){
    var reacthandler=this;
    let url=this.props.siteUrl + 'Lists/' + this.props.ListName;
    // alert(this.props.ListName);
    // console.log(sp.web)
    let ListName=this.props.ListName;
    let reqWeb = Web(this.props.siteUrl);
    const items: any = await reqWeb.lists.getByTitle(ListName).items.get();
    console.log(items);
    BulletinArr=[];
    for(var k in items){
    BulletinArr.push({
      ID: items[k].ID,
      Title: items[k].Title,
      Content: items[k].Content,
      });
    }
    if(BulletinArr.length!=0)
    {
     
      this.setState({
          BulletinArr: BulletinArr
        });
    }
    reacthandler.setState({BulletinArr: BulletinArr});
  
    console.log(BulletinArr);
    return BulletinArr;
  }
  public render(): React.ReactElement<IBulletinBoardProps> {
    return (
      <div className={ styles.bulletinBoard }style={{    
        borderRadius: "5px", border: "1px solid gray",paddingBottom:"5px",paddingTop:"10px" }}>
           <div style={{ height: this.props.Height }}>
             
             <table id="bulletinboard" >
             
             <tbody>
               <tr><tr><td style={{display:(this.state.BulletinArr.length == 0 ? 'none':'block')}} className={ styles.title } >Thought for the day</td></tr></tr>
             
                 {this.state.BulletinArr.map((items) => {
                     return (<div>
                      <tr>
                        
                        {/* <tr><td  className={ styles.row }  style={{ fontWeight:'bold' }}>{items.Title}</td></tr> */}
                         <tr><td><div className={ styles.AnnouncementDatatitle }style={{ fontWeight:'bold' }} dangerouslySetInnerHTML={{__html: items.Content}} /></td></tr>
                      </tr>
                      </div>
                    );
                 })}
               
             </tbody>
             
             </table>
        </div>
      </div>
    );
  }
}
