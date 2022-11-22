import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import React from 'react';

Spotify.getAccessToken();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      searchResults: [],

      playlistName: 'New Playlist',

      playlist: []
     };

     this.addTrack = this.addTrack.bind(this);
     this.removeTrack = this.removeTrack.bind(this);
     this.updatePlaylistName = this.updatePlaylistName.bind(this);
     this.savePlaylist = this.savePlaylist.bind(this);
     this.search = this.search.bind(this);
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
            <Playlist onSave={this.savePlaylist} onRemove={this.removeTrack} onChange={this.updatePlaylistName} playlistName={this.state.playlistName} playlist={this.state.playlist}/>
          </div>
        </div>
      </div>
    );
  }

  addTrack(track) {
    if (this.state.playlist.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let currentPlaylist = this.state.playlist;
    currentPlaylist.push(track);
    this.setState({ playlist: currentPlaylist })

 } 

  removeTrack(track) {
    let currentPlaylist = this.state.playlist;
    let newPlaylist = currentPlaylist.filter(obj => obj.id !== track.id);
    this.setState({ playlist: newPlaylist});
  }

  updatePlaylistName(newName) {
    this.setState({ playlistName: newName });
  }

  async savePlaylist() {
    let trackURIs = this.state.playlist.map(track => {
      return `spotify:track:${track.id}`;
    })
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    console.log(this.state);
    this.setState({
      playlistName: 'New Playlist',
      playlist: []
    });
    console.log(this.state);
  }

  async search(term) {
    let results = await Spotify.search(term);
    console.log(results);
    this.setState({ searchResults: results });
  }
}

export default App;
