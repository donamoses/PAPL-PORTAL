import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';


export interface IBirthdayProps {
  httpClient: SPHttpClient;
  siteUrl: string;
  PastDays:number;
  ListName:string;
  DefaultImageUrl:string;
}
