// Base URL of the API
const API_BASE_URL = 'http://localhost:3000/api/auth';





// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageElement = document.getElementById('loginMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Save token and username to localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);

            // Redirect to dashboard.html
                window.location.href = 'dashboard.html';

        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'An error occurred.';
        console.error(error);
    }
});

