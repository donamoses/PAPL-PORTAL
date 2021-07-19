import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'OfficeLocationWpWebPartStrings';
import OfficeLocationWp from './components/OfficeLocationWp';
import { IOfficeLocationWpProps } from './components/IOfficeLocationWpProps';

export interface IOfficeLocationWpWebPartProps {
  description: string;
  Height:string;
}

export default class OfficeLocationWpWebPart extends BaseClientSideWebPart <IOfficeLocationWpWebPartProps> {

  public render(): void {
    const element: React.ReactElement<any> = React.createElement(
      OfficeLocationWp,
      {
        description: this.properties.description,
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('Height', {
                  label: "Height"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
