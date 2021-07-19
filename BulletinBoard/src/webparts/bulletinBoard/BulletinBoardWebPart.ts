import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'BulletinBoardWebPartStrings';
import BulletinBoard from './components/BulletinBoard';
import { IBulletinBoardProps } from './components/IBulletinBoardProps';
import { sp } from '@pnp/sp';

export interface IBulletinBoardWebPartProps {
  description: string;
  siteUrl: string;
  ListName:string;
  Height:string;
}

export default class BulletinBoardWebPart extends BaseClientSideWebPart<IBulletinBoardWebPartProps> {
  public async onInit(): Promise<void> {
    return super.onInit().then(_ => {
      // other init code may be present
      sp.setup({
        spfxContext: this.context,
      });
    });
  }
  public render(): void {
    const element: React.ReactElement<IBulletinBoardProps> = React.createElement(
      BulletinBoard,
      {
        description: this.properties.description,
        siteUrl:this.properties.siteUrl,
        httpClient: this.context.spHttpClient,
        ListName:this.properties.ListName,
        Height:this.properties.Height
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
                PropertyPaneTextField('Height',{
                  label: 'Height'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
