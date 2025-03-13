import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely

// Handle login form submission
document
  .getElementById(ELEMENT_IDS.LOGIN_FORM)
  .addEventListener("submit", async event => {
    event.preventDefault();

    const username = document.getElementById(ELEMENT_IDS.LOGIN_USERNAME).value;
    const password = document.getElementById(ELEMENT_IDS.LOGIN_USER_PASSWORD)
      .value;
    const messageElement = document.getElementById(ELEMENT_IDS.LOGIN_MESSAGE);

    try {
      const response = await fetch(`${API_BASE_URL}/${API_ROUTES.AUTH_LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
        localStorage.setItem("sessionExpireTime", expireTime);
        localStorage.setItem("sessionIs", "true");
        // document.getElementById('dashboardMessage').textContent = 'Login successful! Welcome to your dashboard.';
        Swal.fire({
          title: "Login Successfully",
          text: `You are now logged in click ok to redirect on dashboard`,
          icon: "success",
          confirmButtonText: "Ok!"
        }).then(function() {
          // Redirect to dashboard.html
          window.location.href = "dashboard.html";
        });
        fetch(`${API_BASE_URL}/username/${API_ROUTES.GET_USERNAME}`)
          .then(response => {
            if (!response.ok) {
              throw new Error("Network response was not ok " + response);
            }
            return response.json();
          })
          .then(data => {
            data.map(user => {
              localStorage.setItem(ELEMENT_IDS.LOGGED_USERID, user.user_id);
              localStorage.setItem(ELEMENT_IDS.LOGGED_USERNAME, user.username);
              localStorage.setItem(ELEMENT_IDS.LOGGED_FIRSTNAME, user.first_name);
              localStorage.setItem(ELEMENT_IDS.LOGGED_USERROLE_ID, user.role_id);
              localStorage.setItem(ELEMENT_IDS.LOGGED_USERROLE_NAME, user.role_name);
            });
          });
      } else {
        // messageElement.style.color = 'red';
        Swal.fire({
          title: "Oops!",
          text: "username or password incorrect. Try again!",
          icon: "error",
          confirmButtonText: "Retry!"
        });
      }
    } catch (error) {
      messageElement.style.color = "red";
      messageElement.textContent = "An error occurred.";
      console.error(error);
    }
  });
