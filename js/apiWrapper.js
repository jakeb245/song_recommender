async function getPlaylist(id) {
    // takes an ID and gets the associated playlist as an array of track ids
    console.log("getting playlist");
    let tracks = [];
    let url = `https://api.spotify.com/v1/playlists/${id}/tracks`
    let response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem("token")}`
        }
    });
    let playlist_obj = await response.json();
    console.log(playlist_obj);
    const total = playlist_obj.total
    // Return list of track ids
    let toAdd, i;
    while (tracks.length < total) {
        toAdd = [];
        for (i = 0; i < playlist_obj.items.length; i++) {
            toAdd[i] = playlist_obj.items[i].track.id;
        }
        tracks = tracks.concat(toAdd);
        console.log(tracks);
        // If end-loop condition not met, get new tracks
        if (tracks.length < playlist_obj.total) {
            url = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=${tracks.length}`
            console.log(url);
            response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem("token")}`
                }
            });
            playlist_obj = await response.json();
            console.log(playlist_obj);
        }
    }
    return tracks;
}

async function getTracksInfo(track_ids) {
    // gets all the info about a track (provided id)
    console.log("getting tracks info");
    let track_info = [];
    const n_tracks = track_ids.length;
    let tracks_searched = 0;
    while (tracks_searched < n_tracks) {
        console.log(`looping: tracks searched = ${tracks_searched}, n_tracks = ${n_tracks}`);
        let subset;
        if (tracks_searched + 100 <= n_tracks) {
            subset = track_ids.slice(tracks_searched, tracks_searched+100);
            tracks_searched += 100;
        }
        else {
            subset = track_ids.slice(tracks_searched, n_tracks-1);
            tracks_searched += (n_tracks - tracks_searched);
        }
        let ids_to_search = subset.join(',');
        console.log(ids_to_search);
        let url = `https://api.spotify.com/v1/audio-features?ids=${ids_to_search}`;
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem("token")}`
            }
        });
        let tracks = await response.json();
        console.log(tracks);
        track_info = track_info.concat(tracks);
    }
    return track_info;
}

async function getTracksFromGenre(genre, n_tracks) {
    // given a genre, pulls playlists until list of tracks length (nTracks) is retrieved
}

async function getTracksFromCategory(category, n_tracks) {
    // given a category, pulls playlists until list of tracks length (nTracks) is retrieved
}
