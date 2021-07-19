import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AnniversaryWebPartStrings';
import Anniversary from './components/Anniversary';
import { IAnniversaryProps } from './components/IAnniversaryProps';
import { sp } from "@pnp/sp/presets/all";
export interface IAnniversaryWebPartProps {
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

export default class AnniversaryWebPart extends BaseClientSideWebPart <IAnniversaryWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
    sp.setup({
    spfxContext: this.context
    });
    });
    }

  public render(): void {
    const element: React.ReactElement<IAnniversaryProps> = React.createElement(
      Anniversary,
      {
        // description: this.properties.description
        siteUrl:this.properties.siteUrl,
        httpClient: this.context.spHttpClient,
        PastDays:this.properties.PastDays,
        ListName:this.properties.ListName,
        DefaultImageUrl:this.properties.DefaultImageUrl,
        WeddingAnniversary:this.properties.WeddingAnniversary,
        WorkAnniversary:this.properties.WorkAnniversary,
        Height:this.properties.Height,
        AnnouncementsiteUrl:this.properties.AnnouncementsiteUrl,
        AnnouncementListName:this.properties.AnnouncementListName,
        Error: this.properties.Error
      
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('siteUrl', {
                  label: "siteUrl"
                }),
                // PropertyPaneTextField('PastDays', {
                //   label: 'Past days'
                // }),
                PropertyPaneTextField('ListName', {
                  label: 'ListName'
                }),
                PropertyPaneTextField('AnnouncementListName', {
                  label: 'AnnouncementListName'
                }),
                PropertyPaneTextField('AnnouncementsiteUrl', {
                  label: 'AnnouncementsiteUrl'
                }),
                PropertyPaneTextField('PastDays', {
                  label: 'Past days'
                }),
                PropertyPaneToggle('WeddingAnniversary',{
                  label: 'WeddingAnniversary',
                  onText: 'On',
                  offText: 'Off'
                }),
                PropertyPaneToggle('WorkAnniversary',{
                  label:'WorkAnniversary',
                  onText: 'On',
                  offText: 'Off'
                }),
                PropertyPaneTextField('Height', {
                  label: "Height"
                }),
              
                PropertyPaneTextField('Error', {
                  label: 'Error'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
