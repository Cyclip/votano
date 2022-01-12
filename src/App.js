import React, { Component } from 'react';
import './fonts.css';
import './App.css';

// All icon imports
import {
    MenuAlt3Icon,
    ChevronDownIcon,
} from '@heroicons/react/outline'

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            menuOpen: true,
            playlistsOpen: true,
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
                        <div className="item center-left-content">
                            <h3>Search</h3>
                        </div>
                        <div className="item" onClick={() => this.togglePlaylists()}>
                            <div class="name center-left-content withIcon">
                                <h3>My playlists</h3>
                            </div>
                            <ChevronDownIcon class={"icon " + (this.state.playlistsOpen ? "flipped" : "unflipped")}/>
                        </div>
                        
                        </div>
                    </div>
                    <div class="main">
                        
                    </div>
                </div>
            </header>
        </div>;
    };
}

export default App;
