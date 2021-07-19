/**
 * RSS Calendar Service
 * Renders events from an RSS feed. It only renders events in the future, so not every plain old RSS feed will do, but
 * calendar RSS feeds should work ok.
 * Before anyone complains that I should have used a readily available RSS parser library, I tried almost
 * every one I could find on NPM and GitHub and found that they did not meet my needs.
 * I'm open to suggestions, though, if you have a library that you think would work better.
 */
import { ICalendarService } from "..";
import { BaseCalendarService } from "../BaseCalendarService";
import { ICalendarEvent } from "../ICalendarEvent";
import * as RSSParser  from 'rss-parser';
import * as moment from "moment";
import { sp, Web } from "@pnp/sp/presets/all";

export class RSSCalendarService extends BaseCalendarService implements ICalendarService {
  constructor() {
    super();
    this.Name = "RSS";
  }
  public getEvents = (): Promise<ICalendarEvent[]> => {
    let reqWeb = Web("/sites/HR/");
    reqWeb.lists.getByTitle("EmployeeCalendar").items.getAll().then(async (data) => {
    });
    const parameterizedFeedUrl: string = this.getCORSUrl(this.replaceTokens(this.FeedUrl, this.EventRange));
const Eventcategory:string=this.Category;
    let parser = new RSSParser();
    return parser.parseURL(parameterizedFeedUrl).then(feed => {

      let events: ICalendarEvent[] = feed.items.map(item => {
        let pubDate: Date = this.convertToDate(item.isoDate);
        let startDate: Date;
        let endDate : Date;
        item.contentSnippet.split("\n").forEach(itemTime => {
          if(itemTime.search("Start Time") >= 0) {
            startDate = this.convertToDate(itemTime.replace("Start Time: ", ""));
            console.log(startDate);
          }else if(itemTime.search("End Time") >=0) {
            endDate = this.convertToDate(itemTime.replace("End Time: ", ""));
            console.log(endDate);
          }
        });
        
        let cat = item.categories && item.categories.length > 0 && item.categories[0]
        const eventItem: ICalendarEvent = {
          title: item.title,
          start: startDate,
          end: endDate,
          url: item.link,
          allDay: false,
          fRecurrence:false,
        //  description: item.content,
         // location: undefined, // no equivalent in RSS
          category: item.categories && item.categories.length > 0 && item.categories[0]
        };
        return eventItem;
      });
      console.log("before sort"+events);

     
     
    //  let sortedevents = events.sort((a, b) => b.end.getDate() - a.end.getDate()).reverse();
   //   console.log("After sort"+sortedevents);
      // return events.filter( item => {
      //   return item.category == Eventcategory;
      // });
      // return events.sort((a, b) => b.start - a.start).filter( item => {
      //   return item.category == Eventcategory;
      // });
      events= events.filter( item => {
        return (item.category == Eventcategory && new Date(item.start.toString()).toLocaleDateString()>= new Date().toLocaleDateString()&&item.title.search("Deleted")==-1);
      });

      return events.sort((a,b) => {
        return a.start.getTime() - b.start.getTime();
    });


   // const sortedArray  = events.sort((a,b) => new moment(a.start).format('YYYYMMDD') - new moment(b.start).format('YYYYMMDD'))

    });
  }
  
}
