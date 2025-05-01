const edituserInput = document.getElementById("username");
const loggedUser = localStorage.getItem("logged_username");
edituserInput.value = loggedUser;
const loggedUserId = localStorage.getItem("logged-user-id");
const newUsername = edituserInput.value;
const form = document.getElementById("profileForm");

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const usernameN = document.getElementById("username").value.trim();
  const bio = document.getElementById("bio").value.trim();

  fetch(`${API_BASE_URL}/update-username/${loggedUserId}`, {
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
