import React, { Component } from 'react';
import './fonts.css';
import './App.css';
import loading from './loading.svg';

// All icon imports
import {
    MenuAlt3Icon,
    SearchIcon,
    ChevronDownIcon,
    CogIcon,
    PlusSmIcon,
    PlayIcon,
} from '@heroicons/react/outline'

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            menuOpen: true,
            playlistsOpen: true,
            currentTab: "search",
            searchBarVal: "",
            currentlySearching: false, // if currently searching
            lastSearched: "", // last searchBarVal
            videos: null, // html of videos
        };
    }

    // toggle menu opening
    toggleMenu = () => {
        this.setState({
            menuOpen: !this.state.menuOpen,
        });
    }

    // toggle playlist opening
    togglePlaylists = () => {
        this.setState({
            playlistsOpen: !this.state.playlistsOpen,
        });
    }

    // function to search for song
    searchSongs = () => {
        if (this.state.lastSearched != this.state.searchBarVal && this.state.searchBarVal != "") {
            this.setState({
                lastSearched: this.state.searchBarVal,
                currentlySearching: true,
            });

            var url = `https://votanoapi.pythonanywhere.com/v1/search/${this.state.searchBarVal}?limit=8`
            
            fetch(url)
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        var videoList = this.searchToElements(result);
                        this.setState({
                            "videos": videoList,
                            currentlySearching: false,
                        });
                    },
                    (error) => {
                        console.error(error);
                        this.setState({
                            currentlySearching: false,
                        });
                    }
                )
            
            
        }
    }

    // convert a searched song JSON response to actual elements
    searchToElements = (res) => {
        return res.map(video => {
            return <div className="video">
                <div className="thumbnail">
                    <img src={video.thumbnail} className="thumbnail-img"/>
                    <div className="play-thumbnail center-content">
                        <PlayIcon className="icon"/>
                    </div>
                </div>
                <div className="details">
                    <h2 className="video-title">{video.title}</h2>
                    <h3 className="video-author">By {video.owner}</h3>
                </div>
                <div className="add-video center-content">
                    <PlusSmIcon className="icon"/>
                </div>
            </div>
        })
    }

    render() {
        return <div className="App"> 
            <header className="App-header">
                <div className="navbar">
                    <div className="menuButton center-content" onClick={() => this.toggleMenu()}>
                        <MenuAlt3Icon className="icon"/>
                    </div>
                    <h1 className='title no-select'>Votano</h1>
                </div>
                <div className="contents">
                    <div className={"menu " + (this.state.menuOpen ? "open" : "closed")}>
                        <div className="items no-select">
                            <div className="item" onClick={() => function() {}}>
                                <div className="name center-left-content withIcon">
                                    <h3>Search</h3>
                                </div>
                                <SearchIcon className="icon"/>
                            </div>
                            <div className="item" onClick={() => this.togglePlaylists()}>
                                <div className="name center-left-content withIcon">
                                    <h3>My playlists</h3>
                                </div>
                                <ChevronDownIcon className={"icon " + (this.state.playlistsOpen ? "flipped" : "unflipped")}/>
                            </div>
                            <div className={"playlistsContainer " + (this.state.playlistsOpen ? "visible" : "invisible")}>
                                <div className="playlist">
                                    <h4>Example playlist</h4>
                                </div>
                                <div className="newPlaylist">
                                    <div className="center-content">
                                        <PlusSmIcon className="icon"/>
                                    </div>
                                    <h4>Create playlist</h4>
                                </div>
                            </div>
                        </div>

                        <div className="settings">
                            <CogIcon className="icon"/>
                        </div>
                    </div>
                    <div className="main">
                        {
                            // search tab
                            this.state.currentTab == "search" &&
                            <div id="search">
                                <h1 className="no-select">Search for a song</h1>
                                <div className="searchbar">
                                    <input 
                                        placeholder="Search song name.."
                                        onChange={event => {
                                            this.setState({searchBarVal: event.target.value})
                                        }}
                                        onKeyPress={event => {
                                            if (event.key == 'Enter' && !this.state.currentlySearching) {
                                                this.searchSongs();
                                            }
                                        }}
                                    />
                                    <button onClick={() => this.searchSongs()} className="center-content">
                                        <SearchIcon className="icon"/>
                                    </button>
                                </div>

                                <div className="videos">
                                    {
                                        // render only if not searching
                                        !this.state.currentlySearching
                                        ? this.state.videos
                                        : <div class="loading center-content">
                                            <img src={loading}/>
                                        </div>

                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </header>
        </div>;
    };
}

export default App;
