const clientID = '3c63db50f04342d4b0f083f7d3689be5';
const redirectURL = 'http://localhost:3000/';

let userToken = null;
let expires = null;


let Spotify = {
    getAccessToken: function() {
        if (userToken) {
            console.log('User Token Found: ', userToken);
            return userToken;
        } else {
            console.log('User Token NOT Found');
            // let currentURL = 'https://example.com/callback#access_token=NwAExz...BV3O2Tk&token_type=Bearer&expires_in=6&state=123';
            let currentURL = window.location.href;      
            console.log('Current URL: ', currentURL);
            // setting search variables
            let access = 'access_token=';
            let time = 'expires_in=';
            if (currentURL.includes(access) && currentURL.includes(time)) {
                console.log('Parsing URL...');
                // getting token
                let tokenStart = currentURL.indexOf(access) + 13;
                let tokenEnd = currentURL.indexOf('&', tokenStart);
                userToken = currentURL.slice(tokenStart, tokenEnd);
                console.log('User Token Obtained: ', userToken);
                // getting expiry time
                let timeStart = currentURL.indexOf(time) + 11;
                if (currentURL.slice(timeStart).includes('&')) {
                    let timeEnd = currentURL.indexOf('&', timeStart);
                    expires = currentURL.slice(timeStart, timeEnd);
                } else {
                    expires = currentURL.slice(timeStart);
                }
                console.log('Expiry Time Obtained: ', expires);
                // clear expired data
                window.setTimeout(() => userToken = '', expires * 1000);
                window.history.pushState('Access Token', null, '/');
                console.log('Awaiting data clearance');
            } else {
                let newURL = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectURL;
                window.location.href = newURL;
            }

        }
    },
    
    async search(term) {
        let fetchURL = 'https://api.spotify.com/v1/search?type=track&q=' + term;
        
        const response = await fetch(fetchURL, {
            method: 'GET',
            headers: {Authorization: `Bearer ${userToken}`}
        }) 
        console.log('Fetching...');
        console.log(response);
        let responseJSON = await response.json();
        console.log(responseJSON);
        if (!responseJSON.hasOwnProperty('tracks')) {return []};
        let tracks = responseJSON.tracks.items.map(track => {
            let trackObj = {
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }
            return trackObj;
        });
        console.log(tracks);
        return tracks;
    },

    async savePlaylist(playlistName, trackURIs) {
        console.log('Running...');
        if (!playlistName || !trackURIs) {
            return;
        }
        let accessToken = userToken;
        let header = { Authorization: `Bearer ${accessToken}` };
        let userID;
        let response = await fetch('https://api.spotify.com/v1/me', {
            headers: header
        });
        let responseJSON = await response.json();
        userID = responseJSON.id;

        // create playlist
        let endpoint = `https://api.spotify.com/v1/users/${userID}/playlists`;
        
        let body = {
            name: playlistName
        }
        let bodyJSON = JSON.stringify(body);

        response = await fetch(endpoint, {
            method: 'POST',
            headers: header,
            body: bodyJSON
        });

        responseJSON = await response.json();
        let playlistID = responseJSON.id;

        // add tracks to playlist
        endpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
        body = {
            uris: trackURIs
        };
        bodyJSON = JSON.stringify(body);

        response = await fetch(endpoint, {
            method: 'POST',
            headers: header,
            body: bodyJSON
        });
    }

};

//Spotify.getAccessToken();
//Spotify.savePlaylist();

export default Spotify;
