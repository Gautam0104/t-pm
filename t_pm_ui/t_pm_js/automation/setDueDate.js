import { sendAutomationData } from "./createAutomationButton.js";

export function setDuedateCardToModal(ticketTitle, ticketId, ticket_status) {
  console.log("Ticket status: " + ticket_status + ", Title: " + ticketTitle);

  let modalContainer = document.getElementById("setdueDateCardToModal");
  if (!modalContainer) {
    console.error("Modal container 'setdueDateCardToModal' not found.");
    return;
  }

  // Inject modal content dynamically
  modalContainer.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="text-center">Set Due Date</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex align-items-center mb-2">
            <label class="form-label me-3">Icon</label>
            <label class="form-label me-3">Title</label>
          </div>
          <div class="d-flex align-items-center">
            <div class="icon-placeholder me-2 d-flex align-items-center justify-content-center border rounded p-2 bg-light">
              <i class="fas fa-clock"></i>
            </div>
            <input type="text" class="form-control" id="titleInput" placeholder="Set due date or start date...">
          </div>
          <div class="mb-3">
            <label class="form-label">Actions</label>
            <div class="border p-3">
              <strong>Dates</strong>
              <div>
                Set the 
                <select id="positionSelect1" class="form-select d-inline w-auto m-2">
                  <option value="">due date</option>
                  <option value="bottom">start date</option>
                </select>
                to
                <input id="listSelect" type="number" class="form-control d-inline w-auto m-2">
  
                <select id="boardSelect" class="form-select d-inline w-auto">
                  <option value="minutes">minutes</option>
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                  <option value="working days" selected>working days</option>
                  <option value="weeks">weeks</option>
                  <option value="months">months</option>
                </select>
                later
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
  const positionSelect = modalContainer.querySelector("#positionSelect1");
  const listSelect = modalContainer.querySelector("#listSelect");
  const boardSelect = modalContainer.querySelector("#boardSelect");
  const saveButton = modalContainer.querySelector("#saveButton");

  function checkInputs() {
    saveButton.disabled =
      titleInput.value.trim() === "" ||
      positionSelect.value === "" ||
      listSelect.value === "" ||
      boardSelect.value === "";
  }

  titleInput.addEventListener("input", checkInputs);
  positionSelect.addEventListener("change", checkInputs);
  listSelect.addEventListener("change", checkInputs);
  boardSelect.addEventListener("change", checkInputs);

  saveButton.addEventListener("click", () =>
    addDueDateAutomationButton(ticketId, ticket_status)
  );

  checkInputs();
}

async function addDueDateAutomationButton(ticketId, ticket_status) {
  const buttonTitle = document.getElementById("titleInput").value.trim();
  const listSelect = document.getElementById("listSelect").value;
  const boardSelect = document.getElementById("boardSelect").value;
  const positionSelect = document.getElementById("positionSelect1").value;

  if (!buttonTitle || !listSelect || !boardSelect || !positionSelect) {
    console.error("Please fill in all fields.");
    return;
  }

  const buttonAction = `addduedateAutomation('${ticketId}', '${listSelect}', '${boardSelect}')`;

  await sendAutomationData(ticketId, buttonTitle, buttonAction);
}

// Fetch boards list for the select input
async function fetchLists() {
  try {
    const response = await fetch(`${API_BASE_URL}/getboards`);
    const lists = await response.json();

    const select = document.getElementById("listSelect");
    select.innerHTML = '<option value="">Select List</option>';

    lists.forEach(list => {
      const option = document.createElement("option");
      option.value = list.board_id;
      option.textContent = list.board_title;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
}
