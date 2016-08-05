"use strict";

import React from "react";

export default class trackList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tracks = this.props.tracks.map( (track, index) => {
      return (<li
        style={{borderTop: "1px solid #bbb", margin: "0", color: "", padding: "1rem"}}
        key={index}>
        {track.artists[0].name} - {track.name}
      </li>);
    });
    return (
      <div className="4 column offset-by-one columns" style={{marginTop: "1rem"}}>
        <ul style={{textAlign: "left" }}>
          {tracks}
        </ul>
      </div>
    );
  }
}

