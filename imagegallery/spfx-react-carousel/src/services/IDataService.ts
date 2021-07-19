export interface IDataService {
    getImages: (listName?: string) => Promise<any>;
}