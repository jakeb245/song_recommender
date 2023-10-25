function findBestMatch(track_features, params) {
    // Given a bunch of tracks' features and some parameters, find the closest match
    // track_features: an array of audio features objects
    // params: map of input parameters

    // Give each track a "match" value ranging from 0 (not at all) to 1 (perfect)
    // Pick the best 3 tracks

    const num_params = ['acousticness', 'danceability', 'liveness', 'instrumentalness', 'energy',
        'valence', 'popularity'];

    let match, input_val, n_params;

    n_params = 0;
    // get n_params
    for (let param of num_params) {
        if (!isNaN(parseFloat(params.get(param)))) {
            n_params += 1
        }
    }

    let track_match_map = new Map();

    // Each search has its own features object, so loop through those
    for (let track_set of track_features) {
        for (let track of track_set.audio_features) {
            match = 0;
            for (let param of num_params) {
                input_val = parseFloat(params.get(param));
                if (!isNaN(input_val)) {
                    match += Math.pow(track[param] - input_val, 2)
                }
            }
            match /= n_params;
            match = Math.sqrt(match);
            track_match_map.set(track.id, match);
        }
    }

    // Find top 3 matches from the map
    // Sort by value
    const tracks_sorted = Array.from(track_match_map.entries()).sort(
        (a,b)=> b[1] - a[1])

    const top_three = [];
    const entries = tracks_sorted.entries();

    for (let i = 0; i < 3; i++) {
        const entry = entries.next();
        if (entry.done) {
            // If there are fewer than three entries, break the loop.
            break;
        }
        top_three.push(entry.value);
    }

    return new Map(top_three);
}
