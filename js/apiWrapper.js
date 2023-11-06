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
    const total = playlist_obj.total;
    // Return list of track ids
    let toAdd, i;
    while (tracks.length < total) {
        toAdd = [];
        for (i = 0; i < playlist_obj.items.length; i++) {
            if (playlist_obj.items[i].track !== null) {
                toAdd[i] = playlist_obj.items[i].track.id;
            }
        }
        tracks = tracks.concat(toAdd);
        // If end-loop condition not met, get new tracks
        if (tracks.length < playlist_obj.total) {
            url = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=${tracks.length}`
            response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization' : `Bearer ${localStorage.getItem("token")}`
                }
            });
            playlist_obj = await response.json();
        }
    }
    return tracks;
}

async function getTracksFeatures(track_ids) {
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
        let url = `https://api.spotify.com/v1/audio-features?ids=${ids_to_search}`;
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization' : `Bearer ${localStorage.getItem("token")}`
            }
        });
        let tracks = await response.json();
        track_info = track_info.concat(tracks);
    }
    return track_info;
}

async function getTracksFromCategory(category) {
    // given a category, pulls 50 playlists and returns list of track IDs
    const category_id = await getCategoryId(category);
    // ignoring the null case
    // get category's playlists
    let url = `https://api.spotify.com/v1/browse/categories/${category_id}/playlists?limit=50`
    let response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem("token")}`
        }
    });
    let playlists_obj = await response.json();
    console.log(playlists_obj);
    let tracks = [];
    for (let i = 0; i < playlists_obj.playlists.items.length; i++) {
        if (playlists_obj.playlists.items[i] == null) continue;
        let id = playlists_obj.playlists.items[i].id;
        let list_tracks = await getPlaylist(id);
        tracks = tracks.concat(list_tracks);
    }
    tracks = tracks.flat();
    // remove duplicate tracks
    tracks = [...new Set(tracks)];
    return tracks;
}

async function getCategoryId(category) {
    console.log('checking if category exists')
    let url = `https://api.spotify.com/v1/browse/categories/${category}`;
    let response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem("token")}`
        }
    });
    let obj = await response.json();
    if (Object.hasOwn(obj, 'error')) {
        alert(`Error: status code ${obj.error.status}`);
        return null;
    }
    else {
        return obj.id;
    }
}

async function getTracksGeneralInfo(track_ids) {
    // given ids, return an array of maps of track name, artist, album, artwork, url per track
    const track_id_string = track_ids.join(',');
    const url = `https://api.spotify.com/v1/tracks?ids=${track_id_string}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem("token")}`
        }
    });
    const tracks_obj = await response.json();

    const track_info = [];

    console.log(tracks_obj.tracks);


    for (let i = 0; i < tracks_obj.tracks.length; i++) {
        track_info[i] = new Map();
        // track name easy
        track_info[i].set('name', tracks_obj.tracks[i].name);
        // artists can be an array so break it down into a string joined by ' and '
        let artists = [];
        for (let j = 0; j < tracks_obj.tracks[i].artists.length; j++) {
            artists[j] = tracks_obj.tracks[i].artists[j].name;
        }
        track_info[i].set('artist', artists.join(' and '));
        // album easy
        track_info[i].set('album', tracks_obj.tracks[i].album.name);
        // artwork url
        track_info[i].set('artwork', tracks_obj.tracks[i].album.images[0].url);
        track_info[i].set('spotify_url', tracks_obj.tracks[i].external_urls['spotify']);
    }

    return track_info;
}
