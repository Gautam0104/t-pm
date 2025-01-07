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


// Project table data filter
const filterInput = document.getElementById('filterInput');
const tableBody = document.getElementById('tableBody');

filterInput.addEventListener('keyup', () => {
    const filterValue = filterInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (let cell of cells) {
            if (cell.textContent.toLowerCase().includes(filterValue)) {
                match = true;
                break;
            }
        }

        row.style.display = match ? '' : 'none';
    }
});