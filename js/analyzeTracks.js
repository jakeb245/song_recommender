function findBestMatch(track_features, params) {
    // Given a bunch of tracks' features and some parameters, find the closest match
    // track_features: an array of audio features objects
    // params: map of input parameters

    // Give each track a "match" value ranging from 0 (not at all) to 1 (perfect)
    // Pick the best 3 tracks

    let first, second, third, match;

    // Each search has its own features object, so loop through those
    for (let track_set of track_features) {
        for (let track of track_set) {

        }
    }
}