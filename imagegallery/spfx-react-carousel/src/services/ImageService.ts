import { ServiceScope, ServiceKey } from "@microsoft/sp-core-library";
import { IDataService } from './IDataService';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { PageContext } from '@microsoft/sp-page-context';
import { ICarouselImage } from './ICarouselImage';

export class ImageService implements IDataService {
    public static readonly serviceKey: ServiceKey<IDataService> = ServiceKey.create<IDataService>('carousel:data-service', ImageService);
    private _spHttpClient: SPHttpClient;
    private _pageContext: PageContext;
    private _currentWebUrl: string;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            // Configure the required dependencies      
            this._spHttpClient = serviceScope.consume(SPHttpClient.serviceKey);
            this._pageContext = serviceScope.consume(PageContext.serviceKey);
            this._currentWebUrl = this._pageContext.web.absoluteUrl;
        });
    }

    public getImages(listName?: string): Promise<string[]> {
        var images: string[] = [];
        return new Promise<string[]>((resolve: (itemId: string[]) => void, reject: (error: any) => void): void => {
            this.readImages(listName)
                .then((carouselItems: ICarouselImage[]): void => {
                    var i: number = 0;
                    for (i = 0; i < carouselItems.length; i++) {
                        images.push(this._currentWebUrl + carouselItems[i].FileRef);
                    }
                    resolve(images);
                });
        });
    }

    private readImages(listName: string): Promise<ICarouselImage[]> {
        return new Promise<ICarouselImage[]>((resolve: (itemId: ICarouselImage[]) => void, reject: (error: any) => void): void => {
            this._spHttpClient.get(`${this._currentWebUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=FileRef/FileRef&$filter=FSObjType eq 0`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'odata-version': ''
                    }
                })
                .then((response: SPHttpClientResponse): Promise<{ value: ICarouselImage[] }> => {
                    return response.json();
                })
                .then((response: { value: ICarouselImage[] }): void => {
                    resolve(response.value);
                }, (error: any): void => {
                    reject(error);
                });
        });
    }
} 