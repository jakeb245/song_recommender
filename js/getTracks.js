
function getInputs() {
    console.log("reading inputs");
    const params = ['acoustic', 'dance', 'live', 'instrument', 'energy',
        'valence', 'category', 'playlist'];
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
        param_map.set(param, val);
    }
    if ((param_map.get('category') === '') && (param_map.get('playlist_id') === '')) {
        error_text += 'You must supply a category or playlist ID';
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
    let tracks;
    if (params.get("playlist") !== '') {
        tracks = await getPlaylist(params.get("playlist"));
    }
    else {
        // Must be category
        const category = params.get('category');
        console.log(category);
        tracks = await getTracksFromCategory(category);
    }
    return tracks;
}

function displayTracks(track_info) {
    // Display the tracks on the webpage
    // Use an HTML frame within the results div (.results CSS class)
    let track_div;
    let results_div = document.createElement('div');
    results_div.id = 'results';
    results_div.className = 'results';
    for (let i = 0; i < 3; i++) {
        track_div = document.createElement('div');
        track_div.id = `track${i}`
        track_div.innerHTML += `<img src="${track_info[i].get('artwork')}" alt="Band photo"><br>`;
        track_div.innerHTML += `<h3 id="title" class="track_info">${track_info[i].get('name')}</h3><br>`;
        track_div.innerHTML += `<p id="artist" class="track_info">${track_info[i].get('artist')}</p><br>`;
        track_div.innerHTML += `<p id="album" class="track_info">${track_info[i].get('album')}</p>`;
        results_div.appendChild(track_div);
    }
    document.body.appendChild(results_div);

}

async function run() {
    if (document.getElementById('results')) {
        console.log('clearing results')
        let results_div = document.getElementById('results')
        results_div.remove();
    }
    const inputs = getInputs();
    console.log(inputs);
    if (inputs != null) {
        let sample_tracks = await getSampleTracks(inputs);
        console.log(sample_tracks);
        const tracks_info = await getTracksFeatures(sample_tracks);
        console.log(tracks_info);
        const best_matches = findBestMatch(tracks_info, inputs);
        console.log(best_matches);
        const match_ids = []
        for (let i = 0; i < best_matches.length; i++) {
            match_ids[i] = best_matches[i][1][0];
        }
        console.log(match_ids);
        const best_match_info = await getTracksGeneralInfo(match_ids)
        console.log(best_match_info);
        displayTracks(best_match_info);
    }
}
