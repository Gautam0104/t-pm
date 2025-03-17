export function errorLog() {
  document.getElementById(ELEMENT_IDS.MESSAGE).textContent =
    "An error occurred.";
  document.getElementById(ELEMENT_IDS.MESSAGE).style.color = "red";
  console.error("Error:", error);
}
