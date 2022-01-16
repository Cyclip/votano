import { invoke } from '@tauri-apps/api/tauri'
import React, { Component } from 'react';
import './fonts.css';
import './App.css';
import pulse from './pulse.svg';
import threedots from './3dots.svg';
import play from './play.svg';
import pause from './pause.svg';
import repeat from './repeat.svg';

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
            refinements: null, // "did you mean: x, y, etc."

            // not playing any
            currentVideo: {
                isVideo: false,
                id: null,
                title: null,
                thumbnail: threedots,
                currentTime: null,
                endTime: null,
            },

            percentPlayed: 30,

            currentPlaylist: {
                name: null,
                id: null,
            }
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
        console.log(this.state);
        if (this.state.lastSearched != this.state.searchBarVal && this.state.searchBarVal != "") {
            this.setState({
                lastSearched: this.state.searchBarVal,
                currentlySearching: true,
            });

            var url = `https://www.youtube.com/results?search_query=${this.state.searchBarVal}`;

            invoke('search_query', {
                url: url,
            }).then((json_str) => {
                this.parseSearchJson(json_str);
            });
        }
    }

    parseSearchJson = (jstr) => {
        var data = JSON.parse(jstr);
        const isDefined = (element) => element == undefined;

        var refinements = data.refinements;
        
        var videoList = data['contents']['twoColumnSearchResultsRenderer']['primaryContents']['sectionListRenderer']['contents'][0]['itemSectionRenderer']['contents'];

        var rv = [];

        for (var i = 0; i < videoList.length; i++) {
            try {
                var vid = videoList[i]['videoRenderer'];

                var vidComplete = {
                    id: vid['videoId'],
                    thumbnail: vid['thumbnail']['thumbnails'][0]['url'],
                    title: vid['title']['runs'][0]['text'],
                    url: vid['navigationEndpoint']['commandMetadata']['webCommandMetadata']['url'],
                    owner: vid['ownerText']['runs'][0]['text'],
                };

                var vals = Object.values(vidComplete);

                if (!vals.some(isDefined)) {
                    rv.push(vidComplete);
                };
            }
            catch(err) {
                // loser
            }
        };

        this.setState({
            videos: this.searchToElements(rv),
            refinements: refinements,
            currentlySearching: false,
        });
    }

    // convert a searched song JSON response to actual elements
    searchToElements = (rv) => {
        return rv.map(video => {
            const self = this;
            var vidid = video.id;

            return <div className="video">
                <div className="thumbnail" onClick={() => this.playVideo({vidid})}>
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

    // play a video by its ID
    playVideo = (r) => {
        this.setState({
            currentVideo: {
                isVideo: true,
                id: r.video.id,
                thumbnail: r.video.thumbnail,
                title: r.video.title,
                currentTime: "0:00",
                percentPlayed: 0,
            }
        });
    }

    render() {
        const maincontentstyle = {
            width: "100%",
        };

        const resetMargin = {
            margin: "0",
        }

        var colouredBarStyle = {
            "width": this.state.percentPlayed + "%"
        };

        var ballStyle = {
            "margin-left": "calc(" + this.state.percentPlayed + "% - 8px)"
        };


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
                    <div class="main-content" style={maincontentstyle}>
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
                                                <img src={pulse}/>
                                            </div>

                                        }
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="playbar">
                            <div className="currently-playing">
                                <div className="thumbnail">
                                    <img src={this.state.currentVideo.thumbnail} className={"thumbnail-img " + (this.state.currentVideo.isVideo ? "" : "no-vid")}/>
                                </div>
                                <div className="details">
                                    <h3 className="truncate">{this.state.currentVideo.title}</h3>
                                </div>
                            </div>
                            <div className="progressbar">
                                <div className="buttons">
                                    <div></div>
                                    <button className="play-button center-content">
                                        <img src={play} className="reverse fix-pos-reversed"/>
                                    </button>

                                    <button className="play-button center-content">
                                        <img src={pause}/>
                                    </button>

                                    <button className="play-button center-content">
                                        <img src={play} className="fix-pos"/>
                                    </button>

                                    <div></div>
                                    
                                    <div className="displaced">
                                        <button className="play-button center-content">
                                            <img src={repeat} className="fix-pos" style={resetMargin}/>
                                        </button>
                                    </div>
                                </div>
                                <div className="progress-bar">
                                    <div className="thin-bar">
                                        <div className="coloured-bar glow-bar" style={colouredBarStyle}></div>
                                        <div className="ball glow-bar" style={ballStyle}></div>
                                    </div>
                                    
                                    <div className="timing">
                                        <h5>{
                                                this.state.currentVideo.isVideo
                                                ? this.state.currentVideo.currentTime
                                                : "0:00"
                                            } / {
                                                this.state.currentVideo.isVideo
                                                ? this.state.currentVideo.endTime
                                                : "0:00"
                                            }</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>;
    };
}

export default App;
