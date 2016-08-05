"use strict";

import React from "react";
import Input from "./common/textInput";
import Homepage from "./homePage";

export default class savePlaylist extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      userInput: null
    };
    this._onChange = this._onChange.bind(this);
    this._onClick = this._onClick.bind(this);

  }

  _onChange(event){
    const userInput = event.target.value;
    this.setState({userInput: userInput});
  }
  _onClick(){
    if(this.state.userInput){
      this.props.handler(this.state.userInput);
    }
  }

  resetHandler(){
    // this.input.click
    location.reload();

  }

  render() {
    return (
      <div id="playlist">
     
        <Input label="Playlist Name" width="480" name="playlistName" onChange={this._onChange.bind(this)} value={this.state.userInput}/>
        <a href="#" onClick={this._onClick} className="button" style={{backgroundColor: "#5cb85c"}}>Save Playlist to Your Spotify Account</a>
        <br></br>
        <a href="#" onClick={this.resetHandler} className="button" style={{backgroundColor: "#5cb85c"}}>Make a New Playlist!</a>
      </div>
    );

  }
}
