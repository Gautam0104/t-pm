import { sendAutomationData } from "./createAutomationButton.js";
import { ELEMENT_IDS } from "../element_id.js";
let selectedColor = "rgb(10, 82, 42)"; // Default color

export function addLabelModal(ticketId) {
  const addLabelForm = document.getElementById(ELEMENT_IDS.ADD_LABEL_FORM);
  addLabelForm.innerHTML = `
      <div class="modal-body">
        <form id="label-form">
          <div class="label-gap">
            <label class="form-label">Icon</label>
            <span></span>
            <label class="form-label">Title</label>
          </div>
          <div class="mb-3 icon-title-container">
            <div class="icon-placeholder">
              <i class="fas fa-tags me-2"></i>
            </div>
            <input type="text" class="form-control" id="labelText" placeholder="Add label...">
          </div>
          <div class="mb-3">
            <label class="form-label">Actions</label>
            <div class="label-selection">
              <span>Add to</span>
              <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" type="button" id="labelDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="color-option" id="selectedColor" style="background-color: ${selectedColor};"></span>
                </button>
                <ul class="dropdown-menu" aria-labelledby="labelDropdown">
                  <li><a class="dropdown-item color-item" data-color="rgb(10, 82, 42)"><span class="color-option" style="background-color: rgb(10, 82, 42);"></span></a></li>
                  <li><a class="dropdown-item color-item" data-color="rgb(233, 34, 34)"><span class="color-option" style="background-color: rgb(233, 34, 34);"></span></a></li>
                  <li><a class="dropdown-item color-item" data-color="rgb(218, 110, 21)"><span class="color-option" style="background-color: rgb(218, 110, 21);"></span></a></li>
                  <li><a class="dropdown-item color-item" data-color="rgb(148, 122, 8)"><span class="color-option" style="background-color: rgb(148, 122, 8);"></span></a></li>
                  <li><a class="dropdown-item color-item" data-color="rgb(116, 128, 241)"><span class="color-option" style="background-color:rgb(116, 128, 241);"></span></a></li>
                  <li><a class="dropdown-item color-item" data-color="rgb(46, 60, 185)"><span class="color-option" style="background-color: rgb(46, 60, 185);"></span></a></li>
                </ul>
              </div>
              <span>label to the card</span>
            </div>
          </div>
         <button type="button" class="btn btn-light w-100" id="openActionButton">
                      + Add action
         </button>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" id="saveLabelButton" class="btn btn-primary">Save</button>
      </div>
    `;

  // Attach event listener for color selection
  document.querySelectorAll(".color-item").forEach(item => {
    item.addEventListener("click", function() {
      updateSelectedColor(this.getAttribute("data-color"));
    });
  });

  // Attach event listener for save button
  document
    .getElementById(ELEMENT_IDS.SAVE_LABEL_BUTTON)
    .addEventListener("click", function() {
      addLabelAutomationButton(ticketId);
    });

  // Attach event listener for action button
  document
    .getElementById(ELEMENT_IDS.OPEN_ACTION_BUTTON)
    .addEventListener("click", openActionModal);
}

// Function to update the selected color
function updateSelectedColor(color) {
  selectedColor = color;
  document.getElementById(ELEMENT_IDS.SELETCT_COLOR).style.backgroundColor = color;
}

async function addLabelAutomationButton(ticketId) {
  const titleInput = document.getElementById(ELEMENT_IDS.LABEL_TEXT).value.trim();

  if (!titleInput) {
    console.error("Button title cannot be empty.");
    return;
  }

  const buttonAction = `addLabelAutomation('${ticketId}', '${selectedColor}')`;
  await sendAutomationData(ticketId, titleInput, buttonAction);
}

// Expose function globally for inline onclick handlers if needed
window.updateSelectedColor = updateSelectedColor;
window.addLabelAutomationButton = addLabelAutomationButton;
