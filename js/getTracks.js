
function getInputs() {
    // TODO: Validate inputs
    const params = ['acoustic', 'dance', 'live', 'energy',
        'valence', 'tempo', 'popularity', 'category', 'genre', 'playlist'];
    const param_map = new Map();
    for (const param of params) {
        let val = document.getElementById(param).value;
        param_map.set(param, val);
    }
    console.log(param_map);
}
