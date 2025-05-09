import { ELEMENT_IDS } from "./element_id.js";

function handleCoverImage() {
  const coverImage = document.querySelectorAll(".coverImage");
  const checkBox = document.getElementById(ELEMENT_IDS.WORKSPACE_EDITING_ADMINS);
  console.log(checkBox);
  coverImage.forEach(item => {
    item.classList.toggle("d-none");
  });
}
