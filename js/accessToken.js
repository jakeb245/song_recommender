
async function fetchToken() {
    let params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    });
    const obj = await response.json();
    return obj;
}


function getNewToken() {
    fetchToken().then((data) => {
        const accessToken = data.access_token;
        localStorage.setItem('token', accessToken);
        const token_dur = data.expires_in;
        const token_exp = Date.now() + (token_dur*1000)
        localStorage.setItem('token_exp', token_exp);
        document.getElementById('token').innerHTML = "Access token: acquired";
    });
}

function tokenCheck() {
    if (localStorage.getItem('token') == null) {
        getNewToken();
    }
    else if (Date.now() > localStorage.getItem('token_exp')) {
        localStorage.removeItem('token');
        localStorage.removeItem('token_exp');
        getNewToken();
    }
    else {
        document.getElementById('token').innerHTML = "Access token: acquired";
    }
}

