import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ReactCarouselWebPartStrings';
import ReactCarousel from './components/ReactCarousel';
import { IReactCarouselProps } from './components/IReactCarouselProps';
import { Carousel } from 'react-responsive-carousel';
import { sp } from "@pnp/sp";

export interface IReactCarouselWebPartProps {
  description: string;
  serviceScope: any;
  context: any;
  width: any;
  height: any;
  radius: any;
}

export default class ReactCarouselWebPart extends BaseClientSideWebPart<IReactCarouselWebPartProps> {
  public onInit(): Promise<void> {

    return super.onInit().then(_ => {

      // other init code may be present

      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IReactCarouselProps> = React.createElement(
      ReactCarousel,
      {
        description: this.properties.description,
        serviceScope: this.properties.serviceScope,
        mycontext: this.context,
        width: this.properties.width,
        height: this.properties.height,
        radius: this.properties.radius,
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
                PropertyPaneTextField('width', {
                  label: "WIDTH"
                }),
                PropertyPaneTextField('height', {
                  label: "HEIGHT"
                }),
                PropertyPaneTextField('radius', {
                  label: "RADIUS"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
