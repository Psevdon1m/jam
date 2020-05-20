import React, { Component } from 'react';
import "./App.css"
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';



class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchResults: [],
            playlistName: "",
            playlistTracks: []
        }

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }


    addTrack(track) {
        if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
            return;
        }
            this.state.playlistTracks.push(track);
            this.setState({playlistTracks: this.state.playlistTracks});
        }

    removeTrack(track) {
        let filteredArray = this.state.playlistTracks.filter((savedTrack)=> savedTrack.id !== track.id)
        this.setState({playlistTracks: filteredArray});
    }
    
    updatePlaylistName(nameOfPlaylist){
        this.setState({playlistName: nameOfPlaylist})
    }

    search(searchTerm){
       Spotify.search(searchTerm).then((results) => {
           console.log(results)
           this.setState({searchResults: results})
           
       })
    }

    savePlaylist(){
        
        console.log('before trackURI')

        let trackURIs = [];
        for(let i = 0; i < this.state.playlistTracks.length; i++) {
            trackURIs.push(this.state.playlistTracks[i].uri)
        }
        
        console.log('after' + trackURIs)
        Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=> {
            this.setState({playlistName: 'New Playlist',
        playlistTracks: []})})
        
    }

    componentDidMount(){
        window.addEventListener('load', ()=> {Spotify.getAccessToken()})
    }

    render(){
        
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search} />
                    <div className="App-playlist">
                        <SearchResults 
                        onAdd={this.addTrack}
                        searchResults={this.state.searchResults} />
                        <Playlist 
                        playlistName={this.state.playlistName} 
                        playlistTracks={this.state.playlistTracks} 
                        onRemove={this.removeTrack}
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist}
                         />
                    </div>
                </div>
            </div>
        )
    }
}

export default App;