// script.js (SIMULATION MODE)

// --- 1. FIREBASE CONFIGURATION (Keep your real keys here) ---
const firebaseConfig = {
    // 🔴 PASTE YOUR FIREBASE KEYS HERE ONE LAST TIME
    apiKey: "AIzaSy...", 
    authDomain: "vibecheck-70b3e.firebaseapp.com",
    projectId: "vibecheck-70b3e",
    storageBucket: "vibecheck-70b3e.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// --- 2. FAKE LOGIN LOGIC (Bypassing Spotify) ---
function loginWithSpotify() {
    // Simulate a delay to make it look real
    const btn = document.querySelector('.btn');
    btn.innerText = "Connecting to Spotify...";
    
    setTimeout(() => {
        // Pretend we got a token
        localStorage.setItem("spotify_token", "simulation_token_123");
        
        // Switch screens
        document.querySelector('.hero').style.display = 'none';
        document.getElementById('app-area').style.display = 'block';
        
        // Load the Feed
        loadFeed();
        alert("✅ Logged in as 'Alex' (Simulation Mode)");
    }, 1500);
}

// Check if already logged in
window.onload = () => {
    if (localStorage.getItem("spotify_token")) {
        document.querySelector('.hero').style.display = 'none';
        document.getElementById('app-area').style.display = 'block';
        loadFeed();
    }
};


// --- 3. MOCK SEARCH LOGIC (Fake Database) ---
const mockSongs = [
    { name: "Starboy", artist: "The Weeknd", img: "https://i.scdn.co/image/ab67616d0000b2734718e28d24227b9dc6410312" },
    { name: "Die With A Smile", artist: "Lady Gaga, Bruno Mars", img: "https://i.scdn.co/image/ab67616d0000b27382ea2e9e1858aa012c57cd45" },
    { name: "Espresso", artist: "Sabrina Carpenter", img: "https://i.scdn.co/image/ab67616d0000b273659cd4673230913b3988ae2b" },
    { name: "Birds of a Feather", artist: "Billie Eilish", img: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62" },
    { name: "Not Like Us", artist: "Kendrick Lamar", img: "https://i.scdn.co/image/ab67616d0000b2731ea0c62b2339cbf493a999ad" }
];

function searchSong() {
    const query = document.getElementById("search-box").value.toLowerCase();
    const resultsDiv = document.getElementById("results");
    
    // Find a song that matches what you typed
    const match = mockSongs.find(s => s.name.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));

    if (match) {
        resultsDiv.innerHTML = `
            <div style="margin-top:20px; text-align:center; animation: fadeIn 0.5s;">
                <img src="${match.img}" style="width:150px; border-radius:10px; margin-bottom:10px;">
                <h3>${match.name}</h3>
                <p style="color:#b3b3b3;">${match.artist}</p>
                <button class="btn" onclick="saveToDatabase('${match.name}', '${match.artist}', '${match.img}')">
                    POST TO FEED 🚀
                </button>
            </div>
        `;
    } else {
        alert("Song not found in Demo Mode! \nTry searching for: 'Starboy', 'Espresso', or 'Birds'.");
    }
}


// --- 4. REAL DATABASE SAVE (This still works!) ---
function saveToDatabase(song, artist, image) {
    db.collection("posts").add({
        song_title: song,
        artist_name: artist,
        image_url: image,
        user: "Alex",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        visible_to_friends: true 
    })
    .then(() => { alert("✅ Success! Song posted to Real Database."); })
    .catch((error) => { alert("❌ Error: " + error.message); });
}


// --- 5. REAL FEED (This still works!) ---
function loadFeed() {
    document.getElementById("feed-container").style.display = "block";

    db.collection("posts")
      .orderBy("timestamp", "desc")
      .limit(20)
      .onSnapshot((snapshot) => {
          const feedDiv = document.getElementById("feed");
          feedDiv.innerHTML = ""; 

          snapshot.forEach((doc) => {
              const post = doc.data();
              const cardHTML = `
                <div class="post-card">
                    <img src="${post.image_url}" class="post-img">
                    <div class="post-info">
                        <span class="user-tag">@${post.user} is listening to</span>
                        <h4>${post.song_title}</h4>
                        <p>${post.artist_name}</p>
                    </div>
                </div>
              `;
              feedDiv.innerHTML += cardHTML;
          });
      });
}
