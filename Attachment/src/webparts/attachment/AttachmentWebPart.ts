import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AttachmentWebPartStrings';
import Attachment from './components/Attachment';
import { IAttachmentProps } from './components/IAttachmentProps';
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
export interface IAttachmentWebPartProps {
  description: string;
  items: any;
  announcement: any;
  siteUrl: string;
  ListName: string;
  Height: string;
  Title: string;
  Error: string;
}

export default class AttachmentWebPart extends BaseClientSideWebPart<IAttachmentWebPartProps> {
  public async onInit(): Promise<void> {



    return super.onInit().then(_ => {
      // other init code may be present
      sp.setup({
        spfxContext: this.context,
      });
    });
  }
  public render(): void {
    const element: React.ReactElement<IAttachmentProps> = React.createElement(
      Attachment,
      {
        description: this.properties.description,
        items: this.properties.items,
        announcement: this.properties.announcement,
        siteUrl: this.properties.siteUrl,
        httpClient: this.context.spHttpClient,
        ListName: this.properties.ListName,
        Height: this.properties.Height,
        Title: this.properties.Title,
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
            description: strings.PropertyPaneDescription,

          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                // PropertyPaneTextField('description', {
                //   label: strings.DescriptionFieldLabel
                // }),
                PropertyPaneTextField('siteUrl', {
                  label: "siteUrl"
                }),
                // PropertyPaneTextField('PastDays', {
                //   label: 'Past days'
                // }),
                PropertyPaneTextField('ListName', {
                  label: 'ListName'
                }),
                PropertyPaneTextField('Height', {
                  label: 'Height'
                }),
                PropertyPaneTextField('Title', {
                  label: 'Title'
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
