let diffs = [];
let acoustics = [];
let dances = [];
let lives = [];
let instruments = [];
let energies = [];
let valences = [];
const data_map = new Map();

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
                    case ("acousticness"): acoustics[acoustics.length] = track[param]; break;
                    case ("danceability"): dances[dances.length] = track[param]; break;
                    case ("liveness"): lives[lives.length] = track[param]; break;
                    case ("instrumentalness"): instruments[instruments.length] = track[param]; break;
                    case ("energy"): energies[energies.length] = track[param]; break;
                    case ("valence"): valences[valences.length] = track[param]; break;
                }
            }
            diff /= n_params;
            diff = Math.sqrt(diff);
            diffs[i] = diff;
            i++;
            track_match_map.set(track.id, diff);
        }
    }

    data_map.set("acousticness", acoustics);
    data_map.set("danceability", dances);
    data_map.set("liveness", lives);
    data_map.set("instrumentalness", instruments);
    data_map.set("energy", energies);
    data_map.set("valence", valences);
    data_map.set("differences", diffs);
    console.log(data_map);

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

function plotDistribution(name, data) {
    console.log("plotting");
    // plot a probability distribution of the difference values
    const plots_div = document.getElementById("plots_div");
    const hist_div = document.createElement("div");
    hist_div.id = `${name}_dist`
    const inputs = {
        x: data,
        type: 'histogram',
        name: `${name} distribution`
    };
    const layout = {
        title: `Distribution of ${name}`,
        xaxis: {
            title: {
                text: name
            }
        }
    }
    Plotly.newPlot(hist_div, [inputs], layout);
    hist_div.style.display = "flex";
    hist_div.style.justifyContent = "center";
    hist_div.style.alignItems = "center";
    plots_div.appendChild(hist_div);
}

function makePlots() {
    const div = document.getElementById("plots_div");
    const plot_header = document.createElement("h2");
    plot_header.innerHTML = "<br>Plots:";
    div.appendChild(plot_header);
    const num_params = ['differences', 'acousticness', 'danceability', 'liveness', 'instrumentalness', 'energy',
        'valence'];
    for (let param of num_params) {
        plotDistribution(param, data_map.get(param));
    }
}
