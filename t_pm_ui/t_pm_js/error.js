export function errorLog(error) {
  document.getElementById("message").textContent = "An error occurred.";
  document.getElementById("message").style.color = "red";
  console.error("Error:", error);
}
