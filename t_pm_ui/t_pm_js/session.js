const session = localStorage.getItem("authToken");
if (!session) {
  window.location.href = "auth-login-cover.html";
}
