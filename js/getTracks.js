
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
    let results_div = document.getElementById("results_div");
    for (let i = 0; i < 3; i++) {
        track_div = document.createElement('div');
        track_div.id = `track${i}`;
        track_div.className = 'track'; // Use className instead of class
        track_div.style.display = 'inline-block'; // Set display style to inline-block
        track_div.style.alignItems = 'center';

        // Create and append the image element
        const imageElement = document.createElement('img');
        imageElement.src = track_info[i].get('artwork');
        imageElement.alt = 'Band photo';
        track_div.appendChild(imageElement);

        // Create and append a container for title, artist, album, and button
        const infoContainer = document.createElement('div');
        infoContainer.style.display = 'inline-block';

        // Create and append the title element
        const titleElement = document.createElement('h3');
        titleElement.id = 'title';
        titleElement.innerHTML = track_info[i].get('name');
        infoContainer.appendChild(titleElement);

        // Create and append the artist element
        const artistElement = document.createElement('p');
        artistElement.id = 'artist';
        artistElement.innerHTML = track_info[i].get('artist');
        infoContainer.appendChild(artistElement);

        // Create and append the album element
        const albumElement = document.createElement('p');
        albumElement.id = 'album';
        albumElement.innerHTML = track_info[i].get('album');
        infoContainer.appendChild(albumElement);

        // Create and append the button element
        const queue_button = document.createElement('button');
        queue_button.onclick = async () => {
            await addTrackToQueue(track_info[i].get('uri'));
        };
        queue_button.innerHTML = 'Add to queue';
        infoContainer.appendChild(queue_button);

        // Append the infoContainer to the track_div
        track_div.appendChild(infoContainer);
        results_div.appendChild(track_div);
    }
}

async function run() {
    tokenCheck();
    console.log(`access token = ${localStorage.getItem("token")}`)
    if (document.getElementById('outputs_div')) {
        console.log('clearing results');
        let results_div = document.getElementById('outputs_div')
        results_div.innerHTML = "<div id=\"results_div\" class=\"results\">\n" +
            "        </div>\n" +
            "    \n" +
            "        <div id=\"plots_div\" class=\"plots\">\n" +
            "        </div>";
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
        makePlots();
    }
}
