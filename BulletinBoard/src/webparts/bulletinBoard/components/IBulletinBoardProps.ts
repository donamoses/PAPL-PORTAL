import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';

export interface IBulletinBoardProps {
  httpClient: SPHttpClient;
  description: string;
  siteUrl: string;
  ListName:string;
  Height:string;
}
