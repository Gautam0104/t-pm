import { sendAutomationData } from "./createAutomationButton.js";
import { fetchLists } from "./boardList.js";

export function copyCardToModal(ticketTitle, ticketId, ticket_status) {
  let modalContainer = document.getElementById("automationcopyCardToModal");

  if (!modalContainer) {
    console.error("Modal container 'automationcopyCardToModal' not found.");
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
              <i class="fas fa-copy"></i>
            </div>
            <input type="text" class="form-control" id="titleInput" placeholder="Copy card to...">
          </div>
          <div class="mb-3">
            <label class="form-label">Actions</label>
            <div class="border p-3">
              <strong>Copy</strong>
              <div>
                Copy the card to 
                <select id="positionSelect1" class="form-select d-inline w-auto m-3">
                  <option value="">Select Position</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                </select>
                of the list 
                <select id="listSelect" class="form-select d-inline w-auto m-3">
                  <option value="">Select List</option>
                </select>
                on
                <select id="boardSelect" class="form-select d-inline w-auto m-3">
                  <option value="">Select Board</option>
                  <option value="board1">Main Board</option>
                  <option value="board2">Secondary Board</option>
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

  // Initialize Bootstrap Modal properly
  let modal = new bootstrap.Modal(modalContainer);
  modal.show();

  // Attach event listeners
  const titleInput = modalContainer.querySelector("#titleInput");
  const positionSelect = modalContainer.querySelector("#positionSelect1");
  const listSelect = modalContainer.querySelector("#listSelect");
  const boardSelect = modalContainer.querySelector("#boardSelect");
  const saveButton = modalContainer.querySelector("#saveButton");
  const addActionButton = modalContainer.querySelector("#addActionButton");

  function checkInputs() {
    // Check if all inputs have non-empty values
    const isValid =
      titleInput.value.trim() !== "" &&
      positionSelect.value !== "" &&
      listSelect.value !== "" &&
      boardSelect.value !== "";

    saveButton.disabled = !isValid;
  }

  // Attach event listeners to inputs
  titleInput.addEventListener("input", checkInputs);
  positionSelect.addEventListener("change", checkInputs);
  listSelect.addEventListener("change", checkInputs);
  boardSelect.addEventListener("change", checkInputs);

  // Add event listener for "Save" button
  saveButton.addEventListener("click", () =>
    addcopyautomationButton(ticketId, ticket_status)
  );

  // Initial check (in case inputs are cached)
  checkInputs();

  // Fetch lists for dynamic list options
  fetchLists();
  console.log("Fetching lists...");
}

async function addcopyautomationButton(ticketId, ticket_status) {
  const listSelect = document.getElementById("listSelect").value;
  const buttonAction = `copycardAutomation('${ticketId}', '${ticket_status}', '${listSelect}')`;

  const titleInput = document.getElementById("titleInput").value.trim();
  if (!titleInput) {
    console.error("Button title cannot be empty.");
    return;
  }

  await sendAutomationData(ticketId, titleInput, buttonAction);
}
