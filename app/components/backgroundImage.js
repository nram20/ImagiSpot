"use strict";

import React from "react";
import Homepage from "./homePage";

export default class backgroundImage extends React.Component {
  constructor(props) {
    super(props);
    this.loadImage = this.loadImage.bind(this);
  }

  componentDidMount() {
    this.loadImage();

  }

  loadImage() {
    let img = this.container;
    let file = this.props.image;
    img.file = file;
    console.log("file: ", file, "img: ", img);
    let reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
    setTimeout(this.props.onImageLoad, 200);

  }


  componentWillReceiveProps(nextProps) {
    let img = this.container;
    let file = nextProps.image;
    img.file = file;
    console.log("file: ", file, "img: ", img);
    let reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
    // // Homepage._updateImage(file);
    // Homepage._updateSwatch();
    // setTimeout(this.props.onImageLoad, 500);

    console.log("nextProps: ", nextProps);
  }

  render() {
    return (
      <img ref={(ref) => this.container = ref} style={{maxWidth:"342.75px", height:"342.75px"}}/>
    );
  }
}
