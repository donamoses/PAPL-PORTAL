export interface IOfficeLocationWpProps {
  zoomLevel: number;
  loadMarkers: () => Promise<any[]>;
  initialLat: number;
  initialLon: number;
  google: any;
  Height:string;
}
