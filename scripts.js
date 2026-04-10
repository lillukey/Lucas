async function openSite(url) {
    let input = url.trim().toLowerCase();
    let fullUrl = input.startsWith("http") ? input : "https://" + input;

    const restricted = [
        "google.com", 
        "youtube.com", 
        "facebook.com", 
        "discord.com", 
        "github.com", 
        "reddit.com", 
        "instagram.com", 
        "twitter.com", 
        "x.com", 
        "netflix.com"
    ];
    // 1. Manual Blocklist (If it's on this list, don't even try stealth)
    if (restricted.some(site => input.includes(site))) {
        window.open(fullUrl, '_blank');
        return;
    }

    // 2. Automated Check
    try {
        // We use 'allorigins' because it's usually more reliable for this
        const response = await fetch(`https://allorigins.win{encodeURIComponent(fullUrl)}`);
        
        // If the fetch works, we try to stealth it
        if (response.ok) {
            launchStealth(fullUrl);
        } else {
            window.open(fullUrl, '_blank');
        }
    } catch (e) {
        // If the check fails, just try stealth anyway as a backup!
        launchStealth(fullUrl);
    }
}

function launchStealth(url) {
    let win = window.open('about:blank', '_blank');
    if (win) {
        win.document.documentElement.innerHTML = `
            <head>
                <title>Google</title>
                <link rel="icon" href="googlelogo.png">
                <style>body,html{margin:0;padding:0;height:100%;overflow:hidden;background:#000;} iframe{width:100%;height:100%;border:none;}</style>
            </head>
            <body><iframe src="${url}"></iframe></body>`;
    }
}

/* 2. Search bar and Enter key logic */
function searchSite() {
    let input = document.getElementById("urlInput");
    if (input.value) {
        openSite(input.value);
        input.value = ""; 
    }
    else alert ("Please insert a URL!")
}

function maskLink(url, fakeTitle) {
    let fullUrl = url;
    
    // Convert standard YouTube links to the Embed format
    if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1].split("&")[0];
        // Adding 'rel=0' prevents related videos from other channels
        fullUrl = "https://www.youtube.com/embed/" + videoId + "?rel=0&enablejsapi=1";
    }
    
    var win = window.open('about:blank', '_blank');

    if (win) {
        win.document.documentElement.innerHTML = `
            <head>
                <title>${fakeTitle || "Google Drive"}</title>
                <link rel="icon" href="googledrivelogo.png">
                <!-- This tag helps YouTube trust the embed source -->
                <meta name="referrer" content="no-referrer-when-downgrade">
                <style>
                    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
                    iframe { width: 100%; height: 100%; border: none; }
                </style>
            </head>
            <body>
                <iframe src="${fullUrl}" allowfullscreen></iframe>
            </body>`;
    }
}
// Single listener for the Enter key
window.onload = () => {
    document.getElementById("urlInput")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") searchSite();
    });
};
