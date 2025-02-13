document.addEventListener("DOMContentLoaded", () => {
    // Log when user enters the page
    const userName = localStorage.getItem("logged-username") || "Guest";
    logActivity(`${userName} entered the page at ${new Date().toLocaleString()}`);

    // Track changes in the ticket form (if it exists)
    const ticketForm = document.getElementById("ticketForm");

    if (ticketForm) {
        ticketForm.addEventListener("input", (event) => {
            event.preventDefault();
            logActivity(`${userName} updated ${event.target.name || "a field"} in the ticket form`);
        });

        ticketForm.addEventListener("submit", (event) => {
            event.preventDefault();
            logActivity(`${userName} submitted the ticket form`);
        });
    }
});

document.addEventListener("beforeunload", () => {
    // Log when user leaves the page
    const userName = localStorage.getItem("logged-username") || "Guest";
    logActivity(`${userName} left the page at ${new Date().toLocaleString()}`);
});

document.addEventListener("click", (event) => {
    let currentTime = new Date().toLocaleString();
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