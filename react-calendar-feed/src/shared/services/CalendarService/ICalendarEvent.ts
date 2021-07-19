export interface ICalendarEvent {
    title: string;
    start: Date;
    end: Date;
    url: string|undefined;
    allDay: boolean;
    category: string|undefined;
    fRecurrence:boolean;
    recurrenceData?: Object;
  //  description: string|undefined;
  //  location: string|undefined;
}
