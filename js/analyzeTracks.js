function findBestMatch(track_features, params) {
    // Given a bunch of tracks' features and some parameters, find the closest match
    // track_features: an array of audio features objects
    // params: map of input parameters

    // Give each track a "match" value ranging from 0 (not at all) to 1 (perfect)
    // Pick the best 3 tracks

    const num_params = ['acousticness', 'danceability', 'liveness', 'instrumentalness', 'energy',
        'valence', 'popularity'];

    let match, input_val, n_params;

    // get n_params
    for (let param of num_params) {
        if (!isNaN(parseFloat(params.get(param)))) {
            n_params += 1
        }
    }

    let track_match_map = new Map();

    // Each search has its own features object, so loop through those
    for (let track_set of track_features) {
        for (let track of track_set) {
            match = 0;
            for (let param of num_params) {
                input_val = parseFloat(params.get(param));
                    match += Math.pow(track[param] - input_val, 2)
            }
            match /= n_params;
            match = Math.sqrt(match);
            track_match_map.set(track.id, match);
        }
    }
}