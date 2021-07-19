import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp/presets/all";
import * as strings from 'OrganizationalchartWebPartStrings';
import Organizationalchart from './components/Organizationalchart';
import { IOrganizationalchartProps } from './components/IOrganizationalchartProps';

export interface IOrganizationalchartWebPartProps {
  listName:string;
}

export default class OrganizationalchartWebPart extends BaseClientSideWebPart <IOrganizationalchartWebPartProps> {
  // public onInit(): Promise<void> {
  //   return super.onInit().then(_ => {
  //   sp.setup({
  //   spfxContext: this.context
  //   });
  //   });
  //   }
  public render(): void {
    const element: React.ReactElement<IOrganizationalchartProps> = React.createElement(
      Organizationalchart,
      {
        listName: this.properties.listName,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
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
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
