import { ELEMENT_IDS } from "./element_id.js";
// Logout Button Click
const logoutTime = 15 * 60 * 1000; // 15 minutes in milliseconds

function updateLastActivity() {
  localStorage.setItem(ELEMENT_IDS.LAST_ACTIVITY, Date.now());
}

function checkInactivity() {
  const lastActivity = localStorage.getItem(ELEMENT_IDS.LAST_ACTIVITY);
  if (lastActivity && Date.now() - lastActivity > logoutTime) {
    localStorage.removeItem("authToken");
    localStorage.removeItem(ELEMENT_IDS.LOGGED_SESSION_EXPIRE);
    localStorage.removeItem(ELEMENT_IDS.LOGGED_SESSION_LS);
    localStorage.removeItem(ELEMENT_IDS.LOGGED_USERID);
    localStorage.removeItem(ELEMENT_IDS.LOGGED_USERNAME);
    localStorage.removeItem(ELEMENT_IDS.LOGGED_FIRSTNAME);
    localStorage.removeItem(ELEMENT_IDS.LOGGED_ROLE_ID);
    localStorage.removeItem(ELEMENT_IDS.LOGGED_ROLE_NAME);
    window.location.href = "auth-login-cover.html";
  }
}

// Update activity on user interactions
window.onload = updateLastActivity;
document.addEventListener("mousemove", updateLastActivity);
document.addEventListener("keydown", updateLastActivity);
document.addEventListener("click", updateLastActivity);
document.addEventListener("scroll", updateLastActivity);

// Check inactivity every minute
setInterval(checkInactivity, 60 * 1000);
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
  localStorage.removeItem(ELEMENT_IDS.LOGGED_SESSION_EXPIRE);
  localStorage.removeItem(ELEMENT_IDS.LOGGED_SESSION_LS);
  localStorage.removeItem(ELEMENT_IDS.LOGGED_USERID);
  localStorage.removeItem(ELEMENT_IDS.LOGGED_USERNAME);
  localStorage.removeItem(ELEMENT_IDS.LOGGED_FIRSTNAME);
  localStorage.removeItem(ELEMENT_IDS.LOGGED_ROLE_ID);
  localStorage.removeItem(ELEMENT_IDS.LOGGED_ROLE_NAME);
  localStorage.removeItem("authToken");
  window.location.href = "auth-login-cover.html";
});

// Check Session Expiration
// setInterval(() => {
//     const sessionExpireTime = localStorage.getItem("sessionExpireTime");
//     if (sessionExpireTime && new Date() > new Date(sessionExpireTime)) {
//         // alert('Session expired. Please log in again.');
//         localStorage.removeItem("sessionExpireTime");
//         localStorage.removeItem("sessionIs");
//         // window.location.reload();
//         window.location.href = "auth-login-cover.html";
//     }
// }, 900000);
