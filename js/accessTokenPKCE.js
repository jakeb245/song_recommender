async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173");
    params.append("scope", "user-modify-playback-state");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

async function fetchAccessTokenPKCE(clientId, code) {
    const verifier = localStorage.getItem("verifier");
    console.log('verifier', verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    return await result.json();
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function getNewTokenPKCE() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    console.log(code);

    if (!code) {
        await redirectToAuthCodeFlow(clientId);
    } else {
        fetchAccessTokenPKCE(clientId, code).then((data) => {
            const accessToken = data.access_token;
            localStorage.setItem('token_pkce', accessToken);
            console.log('access token (pkce) = ' + accessToken);
            const token_dur = data.expires_in;
            const token_exp = Date.now() + (token_dur*1000)
            localStorage.setItem('token_exp_pkce', token_exp.toString());
        });
    }
}

async function tokenCheckPKCE() {
    console.log("checking token")
    if ((localStorage.getItem('token_pkce') == null) || ((localStorage.getItem('token_pkce') === 'undefined'))) {
        console.log("token is null or undefined")
        await getNewTokenPKCE();
    }
    else if (Date.now() > localStorage.getItem('token_exp_pkce')) {
        console.log("token has expired")
        localStorage.removeItem('token_pkce');
        localStorage.removeItem('token_exp_pkce');
        await getNewTokenPKCE();
    }
    else {
        console.log("access token is", localStorage.getItem("token_pkce"))
    }
}