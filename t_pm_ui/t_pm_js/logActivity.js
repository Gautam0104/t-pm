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