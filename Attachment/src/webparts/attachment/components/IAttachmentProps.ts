import { SPHttpClient, SPHttpClientConfiguration, SPHttpClientResponse, ODataVersion, ISPHttpClientConfiguration } from '@microsoft/sp-http';

export interface IAttachmentProps {
  httpClient: SPHttpClient;
  description: string;
  items: any;
  announcement: any;
  siteUrl: string;
  ListName: string;
  Height: string;
  Title: any;
  Error: any;
}
