import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TimeSheetWebPartStrings';
import TimeSheet from './components/TimeSheet';
import { ITimeSheetProps } from './components/ITimeSheetProps';
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
export interface ITimeSheetWebPartProps {
  description: string;
  siteUrl: string;
  ListName:string;
  EmployeeSite:string;
  Redirect:string;
}

export default class TimeSheetWebPart extends BaseClientSideWebPart<ITimeSheetWebPartProps> {
  public async onInit(): Promise<void> {
   return super.onInit().then(_ => {
      // other init code may be present
      sp.setup({
        spfxContext: this.context,
      });
    });
  }
  public render(): void {
    const element: React.ReactElement<ITimeSheetProps> = React.createElement(
      TimeSheet,
      {
        description: this.properties.description,
        siteUrl:this.properties.siteUrl,
        EmployeeSite:this.properties.EmployeeSite,
        httpClient: this.context.spHttpClient,
        ListName:this.properties.ListName,
        Redirect:this.properties.Redirect
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
                PropertyPaneTextField('ListName', {
                  label: 'ListName'
                }),
                PropertyPaneTextField('EmployeeSite', {
                  label: 'EmployeeSite'
                }),
                PropertyPaneTextField('Redirect', {
                  label: 'Redirect'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
