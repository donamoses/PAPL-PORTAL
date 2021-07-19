import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EmbedWebpartWebPartStrings';
import EmbedWebpart from './components/EmbedWebpart';
import { IEmbedWebpartProps } from './components/IEmbedWebpartProps';
import { sp } from "@pnp/sp/presets/all";

export interface IEmbedWebpartWebPartProps {

  EmbedUrl: string;
  Height: string;
  Width: string;
  EmployeesiteUrl: string;
  EmployeelistName: string;
}

export default class EmbedWebpartWebPart extends BaseClientSideWebPart<IEmbedWebpartWebPartProps> {
  protected onInit(): Promise<void> {
    return super.onInit().then((_) => {
      // other init code may be present
      sp.setup({
        spfxContext: this.context,
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IEmbedWebpartProps> = React.createElement(
      EmbedWebpart,
      {

        EmbedUrl: this.properties.EmbedUrl,
        Height: this.properties.Height,
        Width: this.properties.Width,
        EmployeelistName: this.properties.EmployeelistName,
        EmployeesiteUrl: this.properties.EmployeesiteUrl

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // protected get dataVersion(): Version {
  //   return Version.parse('1.0');
  // }

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
                PropertyPaneTextField('EmployeelistName', {
                  label: 'EmployeelistName',
                  placeholder: "Enter List Name",
                }),
                PropertyPaneTextField('EmployeesiteUrl', {
                  label: 'EmployeesiteUrl',
                  placeholder: "Enter siteUrl",
                }),
                PropertyPaneTextField('EmbedUrl', {
                  label: 'EmbedUrl'
                }),
                PropertyPaneTextField('Height', {
                  label: 'Height'
                }),
                PropertyPaneTextField('Width', {
                  label: 'Width'
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
