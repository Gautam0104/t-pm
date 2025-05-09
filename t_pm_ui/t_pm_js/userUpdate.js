import { ELEMENT_IDS } from "./element_id.js";
const edituserInput = document.getElementById(ELEMENT_IDS.USERNAME);
const loggedUser = localStorage.getItem("logged_username");
edituserInput.value = loggedUser;
const loggedUserId = localStorage.getItem("logged-user-id");
const newUsername = edituserInput.value;
const form = document.getElementById(ELEMENT_IDS.PROFILE_FORM);

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const usernameN = document.getElementById(ELEMENT_IDS.USERNAME).value.trim();
  const bio = document.getElementById(ELEMENT_IDS.BIO).value.trim();

  fetch(`${API_BASE_URL}${API_ROUTES.UPDATE_USERNAME}/${loggedUserId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username: usernameN })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to update username.");
      }
      return response.json();
    })
    .then(data => {
      console.log("Server message:", data.message);
      alert(data.message);
    })
    .catch(error => {
      console.error("Error updating username:", error);
    });
});
