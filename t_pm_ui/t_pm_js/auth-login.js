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
      const response = await fetch(
        "https://d8wgkwwg-3000.inc1.devtunnels.ms/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        }
      );

      if (!response.ok) {
        // If response status is not OK (e.g., 401, 500, etc.), show error
        Swal.fire({
          title: "Login Failed",
          text: "Invalid username or password.",
          icon: "error",
          confirmButtonText: "Retry"
        });
      } else {
        // If successful, parse the JSON response
        const data = await response.json();
        const { message, token, user } = data;

        // Store token and user data in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user.userId);
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", user.role);

        // Show success message and redirect to dashboard
        Swal.fire({
          title: "Login Successful",
          text: "Redirecting to the dashboard...",
          icon: "success",
          confirmButtonText: "ok"
        }).then(function() {
          window.location.href = "dashboard.html"; // Redirect to dashboard page
        });
      }
    } catch (error) {
      // Handle network or other errors
      Swal.fire({
        title: "Error",
        text: "An error occurred. Please try again later.",
        icon: "error",
        confirmButtonText: "Close"
      });
    }
  });
