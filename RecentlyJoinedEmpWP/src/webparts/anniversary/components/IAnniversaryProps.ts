import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';

export interface IAnniversaryProps {
 httpClient: SPHttpClient;
  siteUrl: string;
  PastDays:number;
  ListName:string;
  DefaultImageUrl:string;
  WeddingAnniversary:string;
  WorkAnniversary:string;
  Height:string;
  AnnouncementListName:string;
  AnnouncementsiteUrl:string;
  Error: string;
}
