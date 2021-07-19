import { SPHttpClient } from '@microsoft/sp-http';

export interface IOrganizationalchartProps {
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}

