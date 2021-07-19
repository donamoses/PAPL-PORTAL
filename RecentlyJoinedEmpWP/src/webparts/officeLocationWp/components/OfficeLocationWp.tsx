import * as React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { IOfficeLocationWpProps } from './IOfficeLocationWpProps';
import { IMapState } from './IMapState';
import styles from './OfficeLocationWp.module.scss';

export interface LatLng {
  lat: number;
  lng: number;
  placeinfo:string;
}
let coordss:LatLng;
let latitudeWind:number;
let longitudeWind:number;
export class GoogleMap extends React.Component<IOfficeLocationWpProps, IMapState> {

  constructor (props,state:IMapState) {
    super(props);
    this.state = {
      activeMarker: {},
      selectedPlace: {},
      showingInfoWindow: false,
       latitudeWind:null,
       longitudeWind:null,infoTitle:""

    };
  }


  private style: any = {
    width: '100%',
    height: '100%'
  };

  public render(): React.ReactElement<IOfficeLocationWpProps> {
   // let latitude=coordss.lat;
  //  let longitude=coordss.lng;
    var points = [
      {
        lat:9.5857,
        lng: 76.5293,
        place:"Kottayam",
        timediff:""
      },
      {lat:10.0080, lng: 76.3623, place:"Kochi",timediff:""},
      {lat: 60.4720, lng: 8.4689, place:"Norway",timediff:""},
    //  {lat: 15.0827, lng: 81.2707, place:"Pune"},
  ];
    let markers = points
    ? points.map((vendor, index) => {
          return (

              <Marker
                  key={index}
                  position={{
                      lat: vendor.lat,
                      lng: vendor.lng
                  }}
                  title={vendor.place}
                  onClick={this.onMarkerClick}
              >




              </Marker>



          );
      })
    : null;
    return (
      <div style={{height: this.props.Height}}>
       <div className={styles.title}>Office Locations</div>
      <Map google={this.props.google} zoom={6}  initialCenter={{
        lat:9.5857,
        lng: 76.5293
      }}>
          {markers ? markers : null}
          {/* <InfoWindow position={ {
        lat:this.state.latitudeWind,
        lng:this.state.longitudeWind
      }} visible>
          <small>
            {this.state.infoTitle}
          </small>
        </InfoWindow> */}
      </Map>
      </div>

    );
  }
  private LatLng:LatLng;
 private onMarkerClick = (props, marker, e) =>
 {
  coordss =props.position;
  this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true,

  });
 // console.log(coordss);
  this.LatLng=coordss;
  latitudeWind=coordss.lat;
  longitudeWind=coordss.lng;
  var infoTitle=props.title;
  var dt = new Date();
  //myDate.setDate(myDate.getDate() - this.props.PastDays);
  if(infoTitle=="Norway")
  {
    dt.setMinutes( dt.getMinutes() - 30 );
    dt.setHours(dt.getHours()-3);

  }
  this.setState({
    latitudeWind:latitudeWind,
    longitudeWind:longitudeWind,
    infoTitle:infoTitle+'\n'+"Time: "+dt.toLocaleTimeString()
  });

 }

}

export default GoogleApiWrapper({
  apiKey:"AIzaSyDeYnX9jev7RqoRTnM43vWfDblMIxBWa1g"//"AIzaSyA4GpOm3Gn9rJRU6oE162oypWtj2lw4yvc"
  // "AIzaSyDeYnX9jev7RqoRTnM43vWfDblMIxBWa1g"
})(GoogleMap);
