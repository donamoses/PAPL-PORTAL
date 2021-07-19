import { WebPartContext } from "@microsoft/sp-webpart-base";
//import { IPresence } from "../../../model/IPresence";
export interface IAdaptiveCardProps {
  description: string;
  fieldDetails: string;
  lookupDetails: string;
  listName: string;
  siteUrl: string;
  Height: string;
  context: WebPartContext;
}
