import Plotly from "plotly.js-dist";

function findBestMatch(track_features, params) {
    // Given a bunch of tracks' features and some parameters, find the closest match
    // track_features: an array of audio features objects
    // params: map of input parameters

    // Give each track a "match" value ranging from 0 (not at all) to 1 (perfect)
    // Pick the best 3 tracks

    const num_params = ['acousticness', 'danceability', 'liveness', 'instrumentalness', 'energy',
        'valence'];

    let diff, input_val, n_params;

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
            if (track == null) {
                continue;
            }
            diff = 0;
            for (let param of num_params) {
                input_val = parseFloat(params.get(param));
                if (!isNaN(input_val)) {
                    diff += Math.pow(track[param] - input_val, 2);
                }
            }
            diff /= n_params;
            diff = Math.sqrt(diff);
            track_match_map.set(track.id, diff);
        }
    }

    console.log(track_match_map);

    // Find top 3 matches from the map
    // Sort by value
    const tracks_sorted = Array.from(track_match_map.entries()).sort(
        (a,b)=> a[1] - b[1]);

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

    return top_three;
}

function plotDiffDistribution(diff) {
    // plot a probability distribution of the difference values
    const diff_hist_div = document.createElement("div");
    diff_hist_div.id = 'diff_dist'
    document.body.appendChild(diff_hist_div);
    const data = {
        x: diff,
        type: 'histogram'
    };
    Plotly.newPlot(diff_hist_div, [data]);
}
