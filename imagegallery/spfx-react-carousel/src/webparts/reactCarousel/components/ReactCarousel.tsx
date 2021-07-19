import * as React from 'react';
import styles from './ReactCarousel.module.scss';
import { IReactCarouselProps } from './IReactCarouselProps';

import { escape } from '@microsoft/sp-lodash-subset';
//import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IReactCarouselState } from './IReactCarouselState';
import { ServiceScope } from '@microsoft/sp-core-library';
import { ImageService } from '../../../services/ImageService';
//import { IDataService } from '../../../services/IDataService';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
//import Carousel from 'react-elastic-carousel';
import { sp } from "@pnp/sp";
import { Carousel, CarouselButtonsLocation, CarouselButtonsDisplay, ICarouselProps } from "@pnp/spfx-controls-react/lib/Carousel";
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import { ICssInput } from "@uifabric/utilities/lib";



import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class ReactCarousel extends React.Component<IReactCarouselProps, IReactCarouselState, any> {

  // private dataCenterServiceInstance: IDataService;

  public constructor(props: IReactCarouselProps, state: IReactCarouselState) {
    super(props);

    this.state = {
      carouselElements: []

    };
    this._getFiles();
  }

  @autobind
  private async _getFiles() {
    const items: any[] = await sp.web.lists.getByTitle("Imagegallery").items.select("FileLeafRef", "FileRef").get();
    console.log(items);
    let banner: any[] = [];

    let i: number = 1;



    items.forEach(element => {
      i++;
      console.log(element.FileRef);
      let url = this.props.mycontext.pageContext.web.absoluteUrl.replace(this.props.mycontext.pageContext.web._serverRelativeUrl, "") + element.FileRef;
      console.log(url);
      banner.push(<div key={i} >


        <img style={{ width: this.props.width, height: this.props.height, borderRadius: this.props.radius,objectFit:'cover'}} src={element.FileRef} />


      </div>);
    });
    this.setState({ carouselElements: banner });
    console.log(this.state.carouselElements);
  }
  public render(): React.ReactElement<IReactCarouselProps> {

    return (
      <Carousel
        buttonsLocation={CarouselButtonsLocation.center}
        buttonsDisplay={CarouselButtonsDisplay.buttonsOnly}
        nextButtonStyles={styles.carouselBtnright}
        prevButtonStyles={styles.carouselBtn}
        isInfinite={true}
        element={this.state.carouselElements}
        onMoveNextClicked={(index: number) => { console.log(`Next button clicked: ${index}`); }}
        onMovePrevClicked={(index: number) => { console.log(`Prev button clicked: ${index}`); }}
      />
    );
  }
}
