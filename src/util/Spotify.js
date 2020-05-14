let accessToken;
let expires_in;
const cliendID = '32b49adec71a4c0eae6a66fa1227222c';
//const clientSecret = '863e0cccd5474d3c846114d5d6153408';
let redirect_uri = 'https://psevdon1m.github.io/jam/'




const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        };
         
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expires_in_data = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expires_in_data){

            accessToken = accessTokenMatch[1];
            expires_in = Number(expires_in_data[1]);
            // This clears the parameters, allowing us ot grab a new access token when it expires
            window.setTimeout(()=> accessToken = '', expires_in*1000);
            window.history.pushState('AccessToken', null, "/")
            return accessToken;
        }else {
            const urlToToken = `https://accounts.spotify.com/authorize?client_id=${cliendID}&redirect_uri=${redirect_uri}&scope=user-read-private%20user-read-email%20playlist-modify-public&response_type=token`;
            window.location = urlToToken;
        }
    },

    search(term) {
            const accessToken = Spotify.getAccessToken();
            const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`;
            return fetch(searchUrl, {headers:{'Authorization': `Bearer ${accessToken}`}}).then((response) => {
                return response.json()}).then((jsonResponse) => {
                    try {
                        if(jsonResponse.tracks){
                            return jsonResponse.tracks.items.map(track => {
                                console.log(jsonResponse)
                               return {
                                   id: track.id,
                                   name: track.name,
                                   artist: track.artists[0].name,
                                   album: track.album.name,
                                   uri: track.uri
                            } 
                            })
                        }else {
                            return [];
                        }
                    } catch(e) {
                        console.log(e)
                    }
                });
                
                
            },
        savePlaylist(nameOfPlaylist, trackURI){
            if(!nameOfPlaylist && !trackURI){
                return;
            }
            let userID;
            const accessToken = Spotify.getAccessToken();
            const userNameUrl =  `https://api.spotify.com/v1/me`;
            
            
            
            
            return fetch(userNameUrl, {headers:{'Authorization': `Bearer ${accessToken}`}}).then((response) => {
                return response.json()}).then((jsonResponse) => {
                    try {
                        if(jsonResponse){{
                               userID = jsonResponse.id;
                               console.log('User ID ' + userID)
                               return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {headers:{'Authorization': `Bearer ${accessToken}`},
                                method:'POST',
                                body: JSON.stringify({ name: nameOfPlaylist })
                            }).then(response => response.json()).then(jsonResponse => {
                                const playlistsID = jsonResponse.id;
                                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistsID}/tracks`, {headers:{'Authorization': `Bearer ${accessToken}`},
                                 method:'POST',
                                 body: JSON.stringify({ uris: trackURI })

                            })
                        })}
                        }else {
                            return [];
                        }
                    } catch(e) {
                        console.log(e)
                    }
                })
           
            
        }
}

export default Spotify;

