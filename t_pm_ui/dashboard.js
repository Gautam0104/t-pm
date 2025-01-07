// Logout Button Click
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch(`${baseURL}/auth/logout`, {
            method: 'POST'
        });
        if (response.ok) {
            localStorage.removeItem('sessionExpireTime');
            document.getElementById('dashboardMessage').textContent = '';
            document.getElementById('logoutButton').style.display = 'none';
            alert('Logout successful!');
        } else {
            alert('Logout failed!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Check Session Expiration
setInterval(() => {
    const sessionExpireTime = localStorage.getItem('sessionExpireTime');
    if (sessionExpireTime && new Date() > new Date(sessionExpireTime)) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('sessionExpireTime');
        // window.location.reload();
        window.location.href = 'auth-login-cover.html';
    }
}, 1000);