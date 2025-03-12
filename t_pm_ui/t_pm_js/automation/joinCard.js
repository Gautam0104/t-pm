import { sendAutomationData } from "./createAutomationButton.js";
import { ELEMENT_IDS } from "../element_id.js";
// Function to open modal and inject content
export function joinCardToModal(ticketTitle, ticketId) {
  console.log("Opening modal for:", ticketTitle, ticketId);

  let modalContainer = document.getElementById(
    ELEMENT_IDS.AUTOMATION_JOIN_CARD_TO_MODAL
  );

  if (!modalContainer) {
    console.error("Modal container 'automationjoinCardToModal' not found.");
    return;
  }

  // Inject modal content dynamically
  modalContainer.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="text-center">Edit Button</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex align-items-center mb-2">
            <label class="form-label">Icon</label>
            <span></span>
            <label class="form-label ms-4">Title</label>
          </div>
          <div class="d-flex align-items-center">
            <div class="icon-placeholder me-2 d-flex align-items-center justify-content-center border rounded p-2 bg-light">
              <i class="fas fa-user"></i>
            </div>
            <input type="text" class="form-control" id="titleInput" placeholder="Join card">
          </div>
          <div class="mb-3">
            <label class="form-label">Actions</label>
            <div class="border p-3">
              <strong>Members</strong>
              <div>Join the card</div>
            </div>
          </div>
          <button type="button" class="btn btn-light w-100" onclick="openActionModal()">
            + Add action
          </button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary w-100" id="saveButton" disabled>
            Add Button
          </button>
        </div>
        <p class="message" id="message"></p>
      </div>
    </div>
  `;

  // Initialize Bootstrap Modal properly
  let modal = new bootstrap.Modal(modalContainer);
  modal.show();

  // Attach event listeners
  const titleInput = modalContainer.querySelector("#titleInput");
  const saveButton = modalContainer.querySelector("#saveButton");

  titleInput.addEventListener("input", () => {
    saveButton.disabled = titleInput.value.trim() === "";
  });

  saveButton.addEventListener("click", () => joinAutomationButton(ticketId));

  // Check input field initially
  saveButton.disabled = titleInput.value.trim() === "";
}

// Function to send automation data
async function joinAutomationButton(ticketId) {
  const titleInput = document.getElementById(ELEMENT_IDS.TITLE_INPUT);

  if (!titleInput) {
    console.error("Input field not found.");
    return;
  }

  const buttonTitle = titleInput.value.trim();
  if (!buttonTitle) {
    console.error("Button title cannot be empty.");
    return;
  }

  const buttonAction = `joinCard(${JSON.stringify(ticketId)})`;

  await sendAutomationData(ticketId, buttonTitle, buttonAction);
}
