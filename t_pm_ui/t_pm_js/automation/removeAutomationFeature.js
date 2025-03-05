import { sendAutomationData } from "./createAutomationButton.js";

export function removeCardToModal(ticketTitle, ticketId, ticket_status) {
  console.log("Ticket status: " + ticket_status + ", Title: " + ticketTitle);

  let modalContainer = document.getElementById("removeCardToModal");
  if (!modalContainer) {
    console.error("Modal container 'removeCardToModal' not found.");
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
            <label class="form-label me-3">Title</label>
          </div>
          <div class="d-flex align-items-center">
            <div class="icon-placeholder me-2 d-flex align-items-center justify-content-center border rounded p-2 bg-light">
              <i class="fas fa-minus"></i>
            </div>
            <input type="text" class="form-control" id="titleInput" placeholder="Remove">
          </div>
          <div class="mb-3">
            <label class="form-label">Actions</label>
            <div class="border p-3">
              <strong>Remove</strong>
              <div>
                Remove
                <select id="selectRemoveAutomation" class="form-select d-inline w-auto m-2" onchange="toggleLabelDropdown()">
                  <option value="">Select</option>
                  <option value="removeLabel">the label</option>
                  <option value="removeAllLabels">all labels</option>
                  <option value="removeDuedate">the due date</option>
                  <option value="removeStartdate">the start date</option>
                  <option value="removeAllChecklists">all checklists</option>
                  <option value="removeAllMembers">all members</option>
                  <option value="removeStickers">the stickers</option>
                  <option value="removeStartCover">start cover</option>
                </select>
                from the card
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
  const selectRemoveAutomation = modalContainer.querySelector(
    "#selectRemoveAutomation"
  );
  const saveButton = modalContainer.querySelector("#saveButton");

  function checkInputs() {
    saveButton.disabled =
      titleInput.value.trim() === "" || selectRemoveAutomation.value === "";
  }

  titleInput.addEventListener("input", checkInputs);
  selectRemoveAutomation.addEventListener("change", checkInputs);

  saveButton.addEventListener("click", () =>
    addRemoveAutomationButton(ticketId)
  );

  checkInputs();
}

async function addRemoveAutomationButton(ticketId) {
  const removeFeature = document.getElementById("selectRemoveAutomation").value;
  const buttonTitle = document.getElementById("titleInput").value.trim();
  if (!buttonTitle) {
    console.error("Button title cannot be empty.");
    return;
  }
  const buttonAction = `${removeFeature}('${ticketId}')`;
  await sendAutomationData(ticketId, buttonTitle, buttonAction);
}

// function toggleLabelDropdown() {
//   const positionSelect = document.getElementById("positionSelect1");
//   const labelDropdownContainer = document.getElementById(
//     "labelDropdownContainer"
//   );

//   if (positionSelect.value === "the-label") {
//     labelDropdownContainer.style.display = "block";
//   } else {
//     labelDropdownContainer.style.display = "none";
//   }
// }
