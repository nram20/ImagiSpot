"use strict";

import SpotifyWebApi from "spotify-web-api-js";
import querystring from "querystring";
import {generateRandomString, getHashParams, shuffle} from "../helpers";

let _config = {
  baseUrl: "https://api.spotify.com/v1",
  params: {
    client_id: "e0f9623c1e414a0fba20f1d2d16ab7d9",
    secret: "c55984322bf748228e4a44126f927af0",
    scope: "playlist-modify-public playlist-read-private playlist-read-collaborative",
    redirect_uri: "http://localhost:8080",
    // redirect_uri: "http://localhost:8080", // for development // 
    response_type: "token"
  },
  redirectUrl: "https://accounts.spotify.com/authorize?",
  userId: null
};

export default class apiWrapper {
  constructor() {
    this.spotifyApi = new SpotifyWebApi();
    this.getTracksByGenre = this.getTracksByGenre.bind(this);
    this.verifyAuthentication = this.verifyAuthentication.bind(this);
    this.requestAuthentication = this.requestAuthentication.bind(this);
    this.saveTracksAsPlaylist = this.saveTracksAsPlaylist.bind(this);
  }

  requestAuthentication(){
  _config.params.state = generateRandomString(16);
    const params = querystring.stringify(_config.params);
    localStorage.setItem("spotify_auth", _config.params.state);

    window.location.href = _config.redirectUrl + params;
  }

  verifyAuthentication(){
    const params = getHashParams();

    const access_token = params.access_token,
      state = params.state,
      localState = localStorage.getItem("spotify_auth");

    if (access_token && (state === null || state !== localState)) {
      return false;
    } else {
      localStorage.removeItem("spotify_auth");

      if (access_token) {
        this.spotifyApi.setAccessToken(access_token);

        return true;
      } else {
        console.log("authentication failed");

        return false;
      }
    }
  }

  getTracksByGenre(genre) {
    const query = "genre:" + genre;

    const promise = new Promise((resolve, reject) => {
      let tracks = [];
      this.spotifyApi.searchArtists(query, {limit: 50})
      .then( data => {
        let artists = data.artists.items;
        let itemsProcessed = 0;
        artists.forEach( (artist, index, array) => {
          this.spotifyApi.getArtistTopTracks(artist.id, "FI")
          .then( data => {
            // only take the first track returned
            tracks.push(data.tracks[0]);
            itemsProcessed++;
            if(itemsProcessed === array.length) {
              let outGoing = tracks.filter( Boolean );
              outGoing = shuffle(outGoing);
              resolve(outGoing);
            }
          }, err => {
            console.error(err);
          });
        });
      })
      .catch( err => {
        throw new Error(err);
      });
    });

    return promise;
  }

  saveTracksAsPlaylist (tracks, userInput) {
    let track_uris = [];

    tracks.forEach( track => {
      track_uris.push(track.uri);
    });

    const promise = new Promise((resolve, reject) => {
      this.spotifyApi.getMe()
      .then(user => {
        _config.userId = user.id;
      })
      .then( () => {
        this.spotifyApi.createPlaylist(_config.userId, {name: userInput})
        .then( response => {
          if (response.id) {
            let playlistId = response.id;

            this.spotifyApi.addTracksToPlaylist(_config.userId, playlistId, track_uris)
            .then( response => {
              if (response.snapshot_id) {
                resolve(true);
              }
            })
            .catch( error => {
              console.log(error);
              resolve (false);
            });
          }
        })
        .catch( error => {
          console.log(error);
          resolve(false);
        });
      })
      .catch( error => {
        console.log(error);
        return false;
      });
    });

    return promise;
  }
}
