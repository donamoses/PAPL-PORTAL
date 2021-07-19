import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RecentlyJoinedEmployeeWebPartStrings';
import RecentlyJoinedEmployee from './components/RecentlyJoinedEmployee';
import { IRecentlyJoinedEmployeeProps } from './components/IRecentlyJoinedEmployeeProps';
import { sp } from "@pnp/sp/presets/all";
export interface IRecentlyJoinedEmployeeWebPartProps {
  siteUrl: string;
  PastDays:number;
  ListName:string;
  DefaultImageUrl:string;
}

export default class RecentlyJoinedEmployeeWebPart extends BaseClientSideWebPart <IRecentlyJoinedEmployeeWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
    sp.setup({
    spfxContext: this.context
    });
    });
    }
  public render(): void {
    const element: React.ReactElement<IRecentlyJoinedEmployeeProps> = React.createElement(
      RecentlyJoinedEmployee,
      {
       // description: this.properties.description
       siteUrl:this.properties.siteUrl,
       httpClient: this.context.spHttpClient,
       PastDays:this.properties.PastDays,
       ListName:this.properties.ListName,
       DefaultImageUrl:this.properties.DefaultImageUrl
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
                PropertyPaneTextField('PastDays', {
                  label: 'Past days'
                }),
                PropertyPaneTextField('ListName', {
                  label: 'ListName'
                }),
                PropertyPaneTextField('DefaultImageUrl', {
                  label: 'DefaultImageUrl'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
