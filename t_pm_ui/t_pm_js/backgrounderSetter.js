import { ELEMENT_IDS } from "./element_id.js";
var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");

const boardimageUrl = localStorage.getItem(`board-bg-image-url ${project_id}`);
if (boardimageUrl) {
  setTimeout(() => {
    changeElebg();
  }, 1000);
  document.body.style.background = `url('${boardimageUrl}') no-repeat center center/cover`;
} else {
  defaultBackground();
}
function changeBackground(imageUrl) {
  changeElebg();

  localStorage.setItem(`board-bg-image-url ${project_id}`, imageUrl);
  const boardimageUrl = localStorage.getItem(
    `board-bg-image-url ${project_id}`
  );

  document.body.style.background = `url('${boardimageUrl}') no-repeat center center/cover`;
  //console.log(todoFooter);
}

function defaultBackground() {
  resetElebg();
  localStorage.removeItem(`board-bg-image-url ${project_id}`);
}

function changeElebg() {
  const todoFooter = document.getElementById(ELEMENT_IDS.FOOTER);
  const todoHeader = document.getElementsByTagName(ELEMENT_IDS.HEADER);
  const todoButton = document.getElementsByClassName(
    ELEMENT_IDS.KANBAN_TITLE_BUTTON
  );

  const todoForm = document.getElementsByClassName(ELEMENT_IDS.ADD_NEW_FORM);

  // Convert the HTMLCollection to an array
  const headerArray = Array.from(todoHeader);
  const buttonArray = Array.from(todoButton);
  const formArray = Array.from(todoForm);

  headerArray.map(header => {
    header.style.backgroundColor = "#ffffff";
  });
  buttonArray.map(button => {
    button.style.backgroundColor = "#ffffff";
  });
  formArray.map(form => {
    form.style.backgroundColor = "#ffffff";
    form.style.borderRadius = "5px";
  });
  todoFooter.style.backgroundColor = "#ffffff";
}

function resetElebg() {
  const todoFooter = document.getElementById(ELEMENT_IDS.FOOTER);
  const todoHeader = document.getElementsByTagName(ELEMENT_IDS.HEADER);
  const todoButton = document.getElementsByClassName(
    ELEMENT_IDS.KANBAN_TITLE_BUTTON
  );

  const todoForm = document.getElementsByClassName(ELEMENT_IDS.ADD_NEW_FORM);

  // Convert the HTMLCollection to an array
  const headerArray = Array.from(todoHeader);
  const buttonArray = Array.from(todoButton);
  const formArray = Array.from(todoForm);

  // Reset the styles for header
  headerArray.map(header => {
    header.style.backgroundColor = ""; // Remove the background color (revert to default)
  });

  // Reset the styles for button
  buttonArray.map(button => {
    button.style.backgroundColor = ""; // Remove the background color (revert to default)
  });

  // Reset the styles for form
  formArray.map(form => {
    form.style.backgroundColor = ""; // Remove the background color (revert to default)
    form.style.borderRadius = ""; // Reset the border radius
  });

  // Reset the footer background color
  todoFooter.style.backgroundColor = ""; // Revert to the default color

  // Reset the project title input background color
  // Revert to the default color
}

window.changeBackground = changeBackground;
window.defaultBackground = defaultBackground;
window.changeElebg = changeElebg;
