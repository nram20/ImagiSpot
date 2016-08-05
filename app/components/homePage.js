// "use strict";

import React from "react";
import ReactDOM from "react-dom";
import Vibrant from "node-vibrant";

import Image from "./backgroundImage";
import DropZone from "./dropZone";
import SavePlaylist from "./savePlaylist";
import TrackList from "./trackList";

import ImageStore from "../stores/imageStore";
import ApiStore from "../stores/apiStore";

import ImageActions from "../actions/imageActions";
import ApiActions from "../actions/apiActions";

import {hexToComplimentary} from "../helpers"

export default class homePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      swatches: null,
      genre: null,
      dropzone: true,
      auth: false,
      tracks: null,
      playlistHasBeenSaved: null
    };
    this._onChange = this._onChange.bind(this);
    this._updateSwatch = this._updateSwatch.bind(this);
    this._save = this._save.bind(this);
  }

  componentWillMount(){
    ImageStore.addChangeListener(this._onChange);
    ApiStore.addChangeListener(this._onChange);
    ApiActions.authenticate();
  }

  componentWillUnMount(){
    ImageStore.removeChangeListener(this._onChange);
    ApiStore.removeChangeListener(this._onChange);
  }

  componentWillReceiveProps() {
    ImageStore.addChangeListener(this._onChange);
    ApiStore.addChangeListener(this._onChange);
    ApiActions.authenticate();

  }

  _onChange(){
    // console.log(ImageStore.getImage())
    // console.log("test")
    this.setState({
      swatches: ImageStore.getSwatches(),
      image: ImageStore.getImage(),
      genre: ImageStore.getGenre(),
      tracks: ApiStore.getTracks(),
      auth: ApiStore.getAuth(),
      playlistHasBeenSaved: ApiStore.getSaveStatus()
    });
  }

  _auth(){
    ApiActions.authenticate();
  }

  _save(userInput){
    ApiActions.savePlaylist(this.state.tracks, userInput);
  }

  _updateImage(file) {
    const imageType = /^image\//;
      // console.log(file)
    if (imageType.test(file.type)) {
      ImageActions.addImage(file);

    }
  }

  _updateSwatch(){
    let imageNode = ReactDOM.findDOMNode(this.image);
    let src = imageNode.src;
    let vibrant = new Vibrant(src);
    vibrant.getSwatches((event, swatches) => {
      if (event) {
        // console.log(event);
      } else {
        this.setState({dropzone: !this.state.dropzone});
        document.body.style.backgroundColor = swatches["Vibrant"].getHex();
        // document.body.style.color = swatches["Vibrant"].getTitleTextColor();
        let backgroundHex = swatches["Vibrant"].getHex();
        document.body.style.color = swatches["Vibrant"].getTitleTextColor();
        ImageActions.addSwatches(swatches);
        ApiActions.getDataFromSpotify(this.state.genre);
        document.getElementById('dropArea').style.display = 'none';

        // First Swatch - Muted
        let mutedSwatch = document.getElementById('colorMuted');
        let mutedColor = swatches["Muted"];
        let titleTextColor = mutedColor.getTitleTextColor();
        mutedSwatch.style.backgroundColor = mutedColor.getHex();
        mutedSwatch.style.color = titleTextColor;
        mutedSwatch.innerHTML= mutedColor.getHex();
        mutedSwatch.style.border = `solid ${titleTextColor}`;

        // Second Swatch - Dominant (Vibrant)
        let vibrantSwatch = document.getElementById('colorVibrant');
        let vibrantColor = swatches["Vibrant"];
        vibrantSwatch.style.backgroundColor = vibrantColor.getHex();
        vibrantSwatch.style.color = vibrantColor.getTitleTextColor();
        vibrantSwatch.innerHTML= vibrantColor.getHex();
        vibrantSwatch.style.border = `solid ${vibrantColor.getTitleTextColor()}`;

        // Third Swatch - Dark Vibrant
        let darkVibrantSwatch = document.getElementById('colorDarkVibrant');
        let darkVibrantColor = swatches["DarkVibrant"];
        darkVibrantSwatch.style.backgroundColor = darkVibrantColor.getHex();
        darkVibrantSwatch.style.color = darkVibrantColor.getTitleTextColor();
        darkVibrantSwatch.innerHTML= darkVibrantColor.getHex();
        darkVibrantSwatch.style.border = `solid ${darkVibrantColor.getTitleTextColor()}`;

        // Fourth Swatch - Light Vibrant
        let lightVibrantSwatch = document.getElementById('colorLightVibrant');
        let lightVibrantColor = swatches["LightVibrant"];
        lightVibrantSwatch.style.backgroundColor = lightVibrantColor.getHex();
        lightVibrantSwatch.style.color = lightVibrantColor.getTitleTextColor();
        lightVibrantSwatch.innerHTML= lightVibrantColor.getHex();                        
        lightVibrantSwatch.style.border = `solid ${lightVibrantColor.getTitleTextColor()}`;
        
        // Fifth Swatch - Dark Muted
        let darkMutedSwatch = document.getElementById('colorDarkMuted');
        let darkMutedColor = swatches["DarkMuted"];
        darkMutedSwatch.style.backgroundColor = darkMutedColor.getHex();
        darkMutedSwatch.style.color = darkMutedColor.getTitleTextColor();
        darkMutedSwatch.innerHTML= darkMutedColor.getHex();  
        darkMutedSwatch.style.border = `solid ${darkMutedColor.getTitleTextColor()}`;        

        // Sixth Swatch - Complimentary       
        let lightMutedSwatch = document.getElementById('colorLightMuted');
        let lightMutedColor = swatches["LightMuted"];
        lightMutedSwatch.style.backgroundColor = lightMutedColor.getHex();
        lightMutedSwatch.style.color = lightMutedColor.getTitleTextColor();
        lightMutedSwatch.innerHTML= lightMutedColor.getHex();          
        lightMutedSwatch.style.border = `solid ${lightMutedColor.getTitleTextColor()}`;        

      }
    });
  }

  render() {
    let image, dropzone, authButton, saveComponent, genreHeader, list;

    if(this.state.auth){
      if(this.state.dropzone){
        dropzone = <DropZone handler={this._updateImage}/>;
      }
      if(this.state.image){
        // console.log(this.state.image)
        image = <Image image={this.state.image} ref={(ref) => this.image = ref} onImageLoad={this._updateSwatch}/>;
      }
      if(this.state.genre){
        genreHeader = <h4>Genre: {this.state.genre}</h4>;
      }
      if(this.state.tracks){
        list = <TrackList tracks={this.state.tracks}/>;

        if(!this.state.playlistHasBeenSaved){
          saveComponent = <SavePlaylist handler={this._save}/>;
        }
      }
    }
    else{
      authButton = <a href="#" onClick={this._auth} className="button">Log In</a>;
    }
    return (
      <div className="row">
        {image}
        {genreHeader}
        {dropzone}
        {authButton}
        {saveComponent}
        {list}
        {SavePlaylist}
      </div>
    );
  }
}
