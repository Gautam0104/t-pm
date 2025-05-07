var urlParams = new URLSearchParams(window.location.search);
const project_name = urlParams.get("pname");
console.log("hello from about board", project_name);
import { ELEMENT_IDS } from "../element_id.js";
async function getBoard() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-boards?board_name=${project_name}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }

    const lists = await response.json();

    lists.forEach(selected => {});

    return lists;
  } catch (error) {
    console.error("Fetch list error:", error);

    // Optional: show error in UI
    alert("An error occurred. Please try again later.");
  }
}

getBoard();

const adminName = document.getElementById(ELEMENT_IDS.ADMIN_NAME);
const adminLogo = document.getElementById(ELEMENT_IDS.ADMIN_LOGO);
const adminHashtag = document.getElementById(ELEMENT_IDS.ADMIN_HASHTAG);

const loggedUser = localStorage.getItem("logged_username");

if (loggedUser) {
  const userInitials = loggedUser.substring(0, 2).toUpperCase();
  const hashtag = loggedUser.toLowerCase();

  if (adminName) adminName.textContent = loggedUser;
  if (adminLogo)
    adminLogo.innerHTML = `<span class="avatar-initial bg-label-success rounded-circle">${userInitials}</span>`;
  if (adminHashtag) adminHashtag.textContent = `@${hashtag}`;
} else {
  // Optional: handle no logged user
  console.warn("No logged in user found in localStorage.");
}
