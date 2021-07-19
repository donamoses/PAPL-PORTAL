import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmailGreetingsWebPartStrings';
import EmailGreetings from './components/EmailGreetings';
import { IEmailGreetingsProps } from './components/IEmailGreetingsProps';
import { sp } from "@pnp/sp/presets/all";

export interface IEmailGreetingsWebPartProps {
  listSiteUrl: string;
}

export default class EmailGreetingsWebPart extends BaseClientSideWebPart<IEmailGreetingsWebPartProps> {

  protected onInit(): Promise<void> {
    return super.onInit().then((_) => {
      // other init code may be present
   
      sp.setup({
        spfxContext: this.context,
      });
    });
   }

  public render(): void {
    const element: React.ReactElement<IEmailGreetingsProps> = React.createElement(
      EmailGreetings,
      {
        listSiteUrl: this.properties.listSiteUrl
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
                PropertyPaneTextField('listSiteUrl', {
                  label: "list SiteUrl"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
