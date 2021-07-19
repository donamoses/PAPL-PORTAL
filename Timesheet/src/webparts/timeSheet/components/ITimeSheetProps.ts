
import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';

export interface ITimeSheetProps {
  httpClient: SPHttpClient;
  description: string;
  siteUrl: string;
  ListName:string;
  EmployeeSite:string;
  Redirect:string;
  
}
