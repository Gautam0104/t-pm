// Logout Button Click
const logoutTime = 15 * 60 * 1000; // 15 minutes in milliseconds

function updateLastActivity() {
    localStorage.setItem("lastActivity", Date.now());
}

function checkInactivity() {
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && Date.now() - lastActivity > logoutTime) {
        localStorage.removeItem("sessionExpireTime");
        localStorage.removeItem("sessionIs");
        window.location.href = "auth-login-cover.html";
    }
}

// Update activity on user interactions
window.onload = updateLastActivity;
document.addEventListener("mousemove", updateLastActivity);
document.addEventListener("keydown", updateLastActivity);
document.addEventListener("click", updateLastActivity);
document.addEventListener("scroll", updateLastActivity);

// Check inactivity every minute
setInterval(checkInactivity, 60 * 1000);
document.getElementById("logoutButton").addEventListener("click", async () => {
    // try {
    //     const response = await fetch(`${baseURL}/auth/logout`, {
    //         method: 'POST'
    //     });
    //     if (response.ok) {

    //         localStorage.setItem('sessionIs', 'false');
    //         document.getElementById('dashboardMessage').textContent = '';
    //         document.getElementById('logoutButton').style.display = 'none';
    //         alert('Logout successful!');
    //     } else {
    //         alert('Logout failed!');
    //     }
    // } catch (error) {
    //     console.error('Error:', error);
    // }
    localStorage.removeItem("sessionIs");
});

// Check Session Expiration
// setInterval(() => {
//     const sessionExpireTime = localStorage.getItem("sessionExpireTime");
//     if (sessionExpireTime && new Date() > new Date(sessionExpireTime)) {
//         // alert('Session expired. Please log in again.');
//         localStorage.removeItem("sessionExpireTime");
//         localStorage.removeItem("sessionIs");
//         // window.location.reload();
//         window.location.href = "auth-login-cover.html";
//     }
// }, 900000);