let diffs = [];
let acoustics = [];
let dances = [];
let lives = [];
let instruments = [];
let energies = [];
let valences = [];
let data_map;

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
    let i = 0;
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
                switch (param) {
                    case param === "acousticness": acoustics[acoustics.length-1] = track[param]; break;
                    case param === "danceability": dances[dances.length-1] = track[param]; break;
                    case param === "liveness": lives[lives.length-1] = track[param]; break;
                    case param === "instrumentalness": instruments[instruments.length-1] = track[param]; break;
                    case param === "energy": energies[energies.length-1] = track[param]; break;
                    case param === "valence": valences[valences.length-1] = track[param]; break;
                }
            }
            diff /= n_params;
            diff = Math.sqrt(diff);
            diffs[i] = diff;
            i++;
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

function plotDistribution(data, name) {
    console.log("plotting");
    // plot a probability distribution of the difference values
    const plots_div = document.getElementById("plots_div");
    const hist_div = document.createElement("div");
    hist_div.id = `${name}_dist`
    const inputs = {
        x: data,
        type: 'histogram',
        name: 'Distribution of difference from request'
    };
    const layout = {
        title: 'Distribution of difference from request'
    }
    Plotly.newPlot(diff_hist_div, [inputs], [layout]);
    plots_div.appendChild(diff_hist_div);
}

function makePlots() {
    plotDistribution(diffs);
    const num_params = ['acousticness', 'danceability', 'liveness', 'instrumentalness', 'energy',
        'valence'];
    for (let param of num_params) {
        plotDistribution()
    }
}
