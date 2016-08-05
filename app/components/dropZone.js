"use strict";

import React from "react";

export default class DropZone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.prevent = this.prevent.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  prevent(event){
    event.stopPropagation();
    event.preventDefault();
  }

  fileHandler(event){
      
    event.preventDefault();
    event.persist();
    let transfer = event.dataTransfer;
    console.log(event.target.files)
    let file;
    if(transfer) {

      file = transfer.files[event.target.files.length-1];
    }
    else{
      file = event.target.files[event.target.files.length-1];
    }
    this.props.handler(file);
  }

  clickHandler(){
    this.input.click();
  }


  render() {
    return (

    <div>
      
      <div className="twelve columns" id="dropArea">
        <input type="file" accept="image/*" style={{display: "none"}} onChange={this.fileHandler} ref={(ref) => this.input = ref}/>
        <div onDragEnter={this.prevent}
           onDragOver={this.prevent}
           onDrop={this.fileHandler}
           className="u-max-full-width"
           style={{ height: "50rem", background: "url(\"Upload-Song.png\") center no-repeat", margin: "0 auto", cursor: "pointer"}}
           onClick={this.clickHandler}>
        </div>
        <p style={{textAlign: "center"}} >Drag an Image (png or jpeg) here or click.</p>
        
      </div>
      <div id="palette">
        
        <span className="swatch" id="colorMuted" style={{color: "white"}}>#88D317</span>
        <span className="swatch" id="colorVibrant" style={{color: "white"}}>#1A0315</span>
        <span className="swatch" id="colorDarkVibrant" style={{color: "white"}}>#6E3667</span>
        <br></br>
        <span className="swatch" id="colorLightVibrant" style={{color: "white"}}>#D31788</span>
        <span className="swatch" id="colorDarkMuted" style={{color: "white"}}>#1788D3</span>
        <span className="swatch" id="colorLightMuted" style={{color: "white"}}>#000053</span>


      </div>

    </div>  
    );
  }
}
