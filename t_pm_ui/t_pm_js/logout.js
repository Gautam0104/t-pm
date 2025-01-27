// Logout Button Click
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
setInterval(() => {
    const sessionExpireTime = localStorage.getItem("sessionExpireTime");
    if (sessionExpireTime && new Date() > new Date(sessionExpireTime)) {
        // alert('Session expired. Please log in again.');
        localStorage.removeItem("sessionExpireTime");
        localStorage.removeItem("sessionIs");
        // window.location.reload();
        window.location.href = "auth-login-cover.html";
    }
}, 900000);