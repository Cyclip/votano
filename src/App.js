import React, { Component } from 'react';
import './fonts.css';
import './App.css';

// All icon imports
import {
    MenuAlt3Icon,
    SearchIcon,
    ChevronDownIcon,
    CogIcon,
    PlusSmIcon,
} from '@heroicons/react/outline'

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            menuOpen: true,
            playlistsOpen: true,
            currentTab: "search",
            searchBarVal: "",
        };
    }

    toggleMenu = () => {
        this.setState({
            menuOpen: !this.state.menuOpen,
        });
    }

    togglePlaylists = () => {
        this.setState({
            playlistsOpen: !this.state.playlistsOpen,
        });
    }

    searchSongs = () => {
        alert("yee");
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
                                <h1>Search for a song</h1>
                                <div className="searchbar">
                                    <input 
                                        placeholder="Search song name.."
                                        onChange={event => {this.setState({searchBarVal: event.target.value})}}
                                        onKeyPress={event => {
                                            if (event.key == 'Enter') {
                                                this.searchSongs();
                                            }
                                        }}
                                    />
                                    <button onClick={() => this.searchSongs()} className="center-content">
                                        <SearchIcon className="icon"/>
                                    </button>
                                </div>

                                <div className="videos">
                                    <div className="video">
                                        <div className="thumbnail">
                                            <img src="https://via.placeholder.com/100" className="thumbnail"/>
                                        </div>
                                        <div className="details">
                                            <h2 className="video-title">Title</h2>
                                            <h3 className="video-author">By author</h3>
                                        </div>
                                        <div className="add-video center-content">
                                            <PlusSmIcon className="icon"/>
                                        </div>
                                    </div>
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
