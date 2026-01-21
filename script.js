// script.js

// --- 1. CONFIGURATION ---
const firebaseConfig = {
    // 🔴 PASTE YOUR FIREBASE KEYS HERE 🔴
    apiKey: "AIzaSy...", 
    authDomain: "vibecheck-70b3e.firebaseapp.com",
    projectId: "vibecheck-70b3e",
    // ... add the rest ...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Spotify Config
const clientId = "PASTE_YOUR_CLIENT_ID_HERE"; 
const redirectUri = "https://techtrck.github.io/VibeCheck/"; 

// --- 2. AUTHENTICATION ---
function loginWithSpotify() {
    const scope = "user-read-private user-read-email";
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(clientId);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirectUri);
    window.location = url;
}

// Check for Token on Load
window.onload = () => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
        document.querySelector('.hero').style.display = 'none';
        document.getElementById('app-area').style.display = 'block';
        
        const token = hash.split('&')[0].split('=')[1];
        localStorage.setItem("spotify_token", token);
    }
};

// --- 3. SEARCH LOGIC ---
async function searchSong() {
    const query = document.getElementById("search-box").value;
    const token = localStorage.getItem("spotify_token");

    if (!token) { alert("Please Login first!"); return; }

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await response.json();

    if (data.tracks.items.length > 0) {
        const song = data.tracks.items[0];
        const songName = song.name.replace(/'/g, ""); 
        const artistName = song.artists[0].name.replace(/'/g, "");
        const imageUrl = song.album.images[0].url;

        document.getElementById("results").innerHTML = `
            <div style="margin-top:20px; text-align:center;">
                <img src="${imageUrl}" style="width:150px; border-radius:10px; margin-bottom:10px;">
                <h3>${songName}</h3>
                <p style="color:#b3b3b3;">${artistName}</p>
                <button class="btn" onclick="saveToDatabase('${songName}', '${artistName}', '${imageUrl}')">
                    POST TO FEED 🚀
                </button>
            </div>
        `;
    } else {
        alert("Song not found!");
    }
}

// --- 4. DATABASE LOGIC ---
function saveToDatabase(song, artist, image) {
    db.collection("posts").add({
        song_title: song,
        artist_name: artist,
        image_url: image,
        user: "Alex",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        visible_to_friends: true 
    })
    .then(() => { alert("✅ Success! Song posted."); })
    .catch((error) => { alert("❌ Error: " + error.message); });
}
