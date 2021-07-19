/**
 * ExtensionService
 */
import { HttpClientResponse } from "@microsoft/sp-http";
import { ICalendarService } from "..";
import { BaseCalendarService } from "../BaseCalendarService";
import { ICalendarEvent } from "../ICalendarEvent";
import { Web } from "@pnp/sp/presets/all";
import { combine } from "@pnp/common";

export class SharePointCalendarService extends BaseCalendarService
  implements ICalendarService {
  constructor() {
    super();
    this.Name = "SharePoint";
  }

  public getEvents = async (): Promise<ICalendarEvent[]> => {
    const parameterizedFeedUrl: string = this.replaceTokens(
      this.FeedUrl,
      this.EventRange
    );

    // Get the URL
    let webUrl = parameterizedFeedUrl.toLowerCase();

    // Break the URL into parts
    let urlParts = webUrl.split("/");

    // Get the web root
    let webRoot = urlParts[0] + "/" + urlParts[1] + "/" + urlParts[2];

    // Get the list URL
    let listUrl = webUrl.substring(webRoot.length);

    // Find the "lists" portion of the URL to get the site URL
    let webLocation = listUrl.substr(0, listUrl.indexOf("lists/"));
    let siteUrl = webRoot + webLocation;

    // Open the web associated to the site
    let web =  Web(siteUrl);

    // Get the web
    await web.get();
    const Eventcategory:string=this.Category;
    // Build a filter so that we don't retrieve every single thing unless necesssary
  //  let dateFilter: string = "EventDate ge datetime'" + this.EventRange.Start.toISOString() + "' and EndDate lt datetime'" + this.EventRange.End.toISOString() + "'";
   // let dateFilter: string = "EventDate ge datetime'" + this.EventRange.Start.toISOString() + "' and EndDate lt datetime'" + this.EventRange.End.toISOString() + "' and Category eq'"+Eventcategory+"'";
    let dateFilter: string = "Category eq'"+Eventcategory+"' and Status eq 'Approved'";
    try {
     
      const items = await web.getList(listUrl)
        .items.select("Id,Title,Description,EventDate,EndDate,fAllDayEvent,Category,Location,Status,fRecurrence,RecurrenceData,*")
        .orderBy('EventDate', true)
        .filter(dateFilter)
        .get();
      // Once we get the list, convert to calendar events
      let events: ICalendarEvent[] = items.map((item: any) => {
        let eventUrl: string = combine(webUrl, "DispForm.aspx?ID=" + item.Id);
        const eventItem: ICalendarEvent = {
          title: item.Title,
          start: item.EventDate,
          end: item.EndDate,
          url: eventUrl,
          allDay: item.fAllDayEvent,
          category: item.Category,
          fRecurrence: item.fRecurrence,
          recurrenceData: item.RecurrenceData
         // location: item.Location
        };
        return eventItem;
      });
      events= events.filter( item => {
        var startdate=new Date(item.start.toString()).toLocaleDateString();
        var currentdate=new Date().toLocaleDateString();
        if(item.fRecurrence)
        {
          return (new Date(item.end.toString()).getTime()>= new Date().getTime());
        }
        else
        {
          return (new Date(item.start.toString()).getTime()>= new Date().getTime());
        }
       
      });
      return events; 
    //   return events.sort((a,b) => {
    //     return a.start.getTime() - b.start.getTime();
    // });

      // Return the calendar items
    
    }
    catch (error) {
      console.log("Exception caught by catch in SharePoint provider", error);
      throw error;
    }
  }
}
