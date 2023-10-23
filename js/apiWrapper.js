async function getPlaylist(id) {
    // takes an ID and gets the associated playlist as an array of track ids
    let tracks = [];
    let url = `https://api.spotify.com/v1/playlists/${id}`
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem("token")}`
        }
    });
    const playlist_obj = await response.json();
    const total = playlist_obj.tracks.total;
    const limit = playlist_obj.tracks.limit;
    if (total < limit) {
        for (let i= 0; i < total; i++) {
            tracks[i] = playlist_obj.tracks.items[0].track.id;
        }
    }
    return tracks;
}

async function getTrackInfo(id) {
    // gets all the info about a track (provided id)
    
}

async function getTracksFromGenre(genre, nTracks) {
    // given a genre, pulls playlists until list of tracks length (nTracks) is retrieved
}

async function getTracksFromCategory(category, nTracks) {
    // given a category, pulls playlists until list of tracks length (nTracks) is retrieved
}
