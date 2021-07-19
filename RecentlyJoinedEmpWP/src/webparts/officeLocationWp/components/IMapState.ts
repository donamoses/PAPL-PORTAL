import { LatLng } from "./OfficeLocationWp";

export interface IMapState {  
    activeMarker: object;
    selectedPlace: object;
    showingInfoWindow: boolean;
     latitudeWind:number;
 longitudeWind:number;
 infoTitle:string;
}