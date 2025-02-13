document.addEventListener("DOMContentLoaded", () => {
    // Log when user enters the page (name assumed to be passed or retrieved)
    const userName = "User";  // You can dynamically retrieve this (e.g., from a form or session)
    logActivity(`${userName} entered the page at ${new Date().toLocaleString()}`);
});

document.addEventListener("beforeunload", () => {
    // Log when user leaves the page
    const userName = "User";  // Same here, retrieve dynamically if possible
    logActivity(`${userName} left the page at ${new Date().toLocaleString()}`);
});

document.addEventListener("click", (event) => {
    let currentTime = new Date().toLocaleString(); // Get the current date and time as a string
    logActivity(`Clicked on ${event.target.tagName} ${event.target.className} at (${event.clientX}, ${event.clientY}) at ${currentTime}`);
});

document.addEventListener("keydown", (event) => {
    logActivity(`Key pressed: ${event.key}`);
});

function logActivity(message) {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ${message}`;

    // Store in local storage (temporary)
    let logs = JSON.parse(localStorage.getItem("activityLogs")) || [];
    logs.push(log);
    localStorage.setItem("activityLogs", JSON.stringify(logs));

    // Print in console
    console.log(log);

    // Send to backend (optional)
    // fetch("/log", {
    //     method: "POST",
    //     body: JSON.stringify({ log }),
    //     headers: { "Content-Type": "application/json" }
    // });
}

function showLogs() {
    const logs = JSON.parse(localStorage.getItem("activityLogs")) || [];
    document.getElementById("logContainer").innerText = logs.join("\n");
}
