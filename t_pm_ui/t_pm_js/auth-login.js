// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely



// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageElement = document.getElementById('loginMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password }),
        });



        if (response.ok) {
            const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
            localStorage.setItem('sessionExpireTime', expireTime);
            localStorage.setItem('sessionIs', 'true');
            // document.getElementById('dashboardMessage').textContent = 'Login successful! Welcome to your dashboard.';
            Swal.fire({
                title: 'Login Successfully',
                text: `You are now logged in click ok to redirect on dashboard`,
                icon: 'success',
                confirmButtonText: 'Ok!'
            }).then(function () {
                // Redirect to dashboard.html
                window.location.href = 'dashboard.html';
            })
            fetch(`${API_BASE_URL}/username/${username}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok " + response);
                    }
                    return response.json();
                })
                .then(data => {
                    data.map(user => {
                        localStorage.setItem("logged-user-id", user.user_id);
                        localStorage.setItem("logged-username", user.username);
                        localStorage.setItem("logged-first-name", user.first_name);
                        localStorage.setItem("logged-user-role-id", user.role_id);
                        localStorage.setItem("logged-user-role-name", user.role_name);
                    })
                })

        } else {
            // messageElement.style.color = 'red';
            Swal.fire({
                title: 'Oops!',
                text: 'username or password incorrect. Try again!',
                icon: 'error',
                confirmButtonText: 'Retry!'
            });
        }
    } catch (error) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'An error occurred.';
        console.error(error);
    }
});
