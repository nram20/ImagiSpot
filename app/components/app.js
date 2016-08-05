"use strict";

import React from "react";
import HomePage from "./homePage";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container" style={{marginTop: "3rem"}}>
        <div className="row" style={{textAlign: "center"}}>
          <h1><strong>ImagiSpot</strong></h1>
          <h3>Upload an Image and Receive a Spotify Playlist</h3>
          
          <h5>Playlist built using analysis of image chroma, hues, and light</h5>
          <HomePage style={{textAlign: "left"}}/>
        </div>
      </div>
    );
  }
}
