import { sendAutomationData } from "./createAutomationButton.js"; // Ensure correct path

// Function to open modal and inject content
export function markDueDateModal(ticketTitle, ticketId) {
  console.log("Opening modal for:", ticketTitle, ticketId);

  let modalContainer = document.getElementById("markDueDateModal");

  if (!modalContainer) {
    console.error("Modal container 'markDueDateModal' not found.");
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
              <i class="fas fa-clock"></i>
            </div>
            <input type="text" class="form-control" id="titleInput" placeholder="Mark Due Date">
          </div>
          <div class="mb-3">
            <label class="form-label">Actions</label>
            <div class="border p-3">
              <strong>Dates</strong>
              <div>
                Mark due date
                <select id="duedate" class="form-select d-inline w-auto m-3">
                  <option value="complete">Complete</option>
                  <option value="incomplete">Incomplete</option>
                </select>
              </div>
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
  const duedate = modalContainer.querySelector("#duedate");
  const saveButton = modalContainer.querySelector("#saveButton");

  function checkInputs() {
    saveButton.disabled = titleInput.value.trim() === "";
  }

  titleInput.addEventListener("input", checkInputs);
  duedate.addEventListener("change", checkInputs);

  // Initial check
  checkInputs();

  saveButton.addEventListener("click", () => markDueDateAutomationButton(ticketId));
}

// Function to send automation data
async function markDueDateAutomationButton(ticketId) {
  const titleInput = document.getElementById("titleInput");
  const duedateStatus = document.getElementById("duedate").value;

  if (!titleInput) {
    console.error("Input field not found.");
    return;
  }

  const buttonTitle = titleInput.value.trim();
  if (!buttonTitle) {
    console.error("Button title cannot be empty.");
    return;
  }

  const buttonAction = `markduedate('${ticketId}','${duedateStatus}')`;

  await sendAutomationData(ticketId, buttonTitle, buttonAction);
}
