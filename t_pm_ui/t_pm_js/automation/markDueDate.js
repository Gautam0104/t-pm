import { sendAutomationData } from "./createAutomationButton.js";
import { ELEMENT_IDS } from "../element_id.js";

export function markDueDateModal(ticketTitle, ticketId) {
  console.log("Ticket Title: " + ticketTitle + ", Ticket ID: " + ticketId);

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
            <label class="form-label me-3">Icon</label>
            <label class="form-label">Title</label>
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
          <button type="button" class="btn btn-light w-100" id="addActionButton">+ Add action</button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary w-100" id="saveButton" disabled>Add Button</button>
        </div>
      </div>
    </div>
  `;

  let modal = new bootstrap.Modal(modalContainer);
  modal.show();

  const titleInput = modalContainer.querySelector("#titleInput");
  const duedate = modalContainer.querySelector("#duedate");
  const saveButton = modalContainer.querySelector("#saveButton");

  function checkInputs() {
    saveButton.disabled =
      titleInput.value.trim() === "" || duedate.value === "";
  }

  titleInput.addEventListener("input", checkInputs);
  duedate.addEventListener("change", checkInputs);

  saveButton.addEventListener("click", () =>
    markDueDateAutomationButton(ticketId)
  );

  checkInputs();
}

async function markDueDateAutomationButton(ticketId) {
  const duedateStatus = document.getElementById(ELEMENT_IDS.DUEDATE).value;
  const titleInput = document
    .getElementById(ELEMENT_IDS.TITLE_INPUT)
    .value.trim();

  if (!titleInput) {
    console.error("Button title cannot be empty.");
    return;
  }

  const buttonAction = `markduedate('${ticketId}', '${duedateStatus}')`;
  await sendAutomationData(ticketId, titleInput, buttonAction);
}
