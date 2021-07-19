import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'AdaptiveCardWebPartStrings';
import AdaptiveCard from './components/AdaptiveCard';
import { IAdaptiveCardProps } from './components/IAdaptiveCardProps';
import { sp } from "@pnp/sp/presets/all";
export interface IAdaptiveCardWebPartProps {
    description: string;
    fieldDetails: string;
    lookupDetails: string;
    listName: string;
    siteUrl: string;
    Height: string;
}

export default class AdaptiveCardWebPart extends BaseClientSideWebPart<IAdaptiveCardWebPartProps> {
    // public async onInit(): Promise<any> {
    //
    //
    // }
    protected onInit(): Promise<void> {
        return super.onInit().then((_) => {

            // other init code may be present

            sp.setup({
                spfxContext: this.context,
            });
        });
    }


    public render(): void {
        const element: React.ReactElement<IAdaptiveCardProps> = React.createElement(
            AdaptiveCard,
            {
                context: this.context,
                description: this.properties.description,
                fieldDetails: this.properties.fieldDetails,
                lookupDetails: this.properties.lookupDetails,
                listName: this.properties.listName,
                siteUrl: this.properties.siteUrl,
                Height: this.properties.Height
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
                                    label: 'List Name',
                                    placeholder: "Enter List Name",
                                }),
                                PropertyPaneTextField('siteUrl', {
                                    label: 'siteUrl',
                                    placeholder: "Enter siteUrl",
                                }),
                                PropertyPaneTextField('fieldDetails', {
                                    label: 'List Fields',
                                    placeholder: "Enter List Fields",
                                }),
                                PropertyPaneTextField('lookupDetails', {
                                    label: 'Lookup Fields',
                                    placeholder: "Enter Lookup Fields",
                                }),
                                PropertyPaneTextField('Height', {
                                    label: 'Height',
                                    placeholder: "Enter Height",
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}