
function getInputs() {
    console.log("reading inputs");
    const params = ['acoustic', 'dance', 'live', 'instrument', 'energy',
        'valence', 'popularity', 'category', 'genre', 'playlist'];
    const num_params = ['acoustic', 'dance', 'live', 'instrument', 'energy',
        'valence'];
    const param_map = new Map();
    let error_text = '';
    for (const param of params) {
        let val = document.getElementById(param).value;
        if (num_params.indexOf(param) > -1) {
            val = parseFloat(val);
            if ((val < 0) || (val > 1)) {
                error_text += `${param} must be [0-1]\n`
            }
        }
        if ((param === "tempo") && (val.includes('-'))) {
            const tempos = val.split('-');
            val = [parseFloat(tempos[0]), parseFloat(tempos[1])]
        }
        param_map.set(param, val);
    }
    if ((param_map.get('category') === '') && (param_map.get('genre') === '') && (param_map.get('playlist_id') === '')) {
        error_text += 'You must supply a category, genre, or playlist ID';
    }
    if (error_text === '') {
        return param_map;
    }
    else {
        alert(error_text);
        return null;
    }
}

async function getSampleTracks(params) {
    let tracks = []
    if (params.get("playlist") != null) {
        tracks = tracks.concat(await getPlaylist(params.get("playlist")));
    }
    else {
    }
    return tracks;
    // TODO: add category and genre input handling
}

function displayTracks(track_info) {

}

async function run() {
    const inputs = getInputs();
    console.log(inputs);
    if (inputs != null) {
        let sample_tracks = await getSampleTracks(inputs);
        const tracks_info = await getTracksFeatures(sample_tracks);
        console.log(tracks_info);
        const best_matches = findBestMatch(tracks_info, inputs);
        console.log(best_matches);
    }
}
