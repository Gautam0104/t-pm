function moveCardToModal(ticketTitle, ticketId, ticket_status) {
  console.log("ticket status is" + ticket_status + ticketTitle);

  const moveCardToForm = document.getElementById("move-card-to-form");
  moveCardToForm.innerHTML = `
     <div class="modal-header">
      <h4 class="text-center">Edit Button</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      <div class="modal-body">
         <!-- Label Row -->
<div class="d-flex align-items-center mb-2">
  <label class="form-label">Icon</label>
  <label class="form-label">Title</label>
</div>

<!-- Input Row -->
<div class="d-flex align-items-center">
  <!-- Icon -->
  <div class="icon-placeholder me-2 d-flex align-items-center justify-content-center border rounded p-2 bg-light">
    <i class="fas fa-arrow-right "></i>
  </div>

  <!-- Input Field -->
  <input type="text" class="form-control" id="titleInput" placeholder="Move card to...">
</div>

  
        <!-- Actions -->
        <div class="mb-3">
          <label class="form-label">Actions</label>
          <div class="border p-3">
            <strong>Move</strong>
            <div>
              Move the card to the 
              <select id="positionSelect1" class="form-select d-inline w-auto">
                <option value="">Select Position</option>
                <option value="top">top</option>
                <option value="bottom">bottom</option>
              </select>
              of the list 
              <select id="listSelect" class="form-select d-inline w-auto">
                <option value="">Select List</option>
                <option value="todo">Todo</option>
                <option value="inprogress">InProgress</option>
                <option value="for-approval">For-Approval</option>
                <option value="rejected">Rejected</option>
                <option value="approved">Approved</option>
              </select>
              on
              <select id="boardSelect" class="form-select d-inline w-auto">
                <option value="">Select Board</option>
                <option value="board1">Main Board</option>
                <option value="board2">Secondary Board</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Add Action Button -->
        <button type="button" class="btn btn-light w-100" onclick="openActionModal()">
          + Add action
        </button>
      </div>
  
      <div class="modal-footer">
        <button type="button" class="btn btn-primary w-100" id="saveButton" disabled onclick="addautomationButton('${ticketId}','${ticket_status}')">Add Button</button>
      </div>
    `;

  // Initialize and show the Bootstrap modal dynamically
  let modalElement = document.getElementById("moveCardToModal");
  let modal = new bootstrap.Modal(modalElement);
  modal.show();

  // Attach event listeners directly after injecting HTML
  const titleInput = document.getElementById("titleInput");
  const positionSelect = document.getElementById("positionSelect1");
  const listSelect = document.getElementById("listSelect");
  const boardSelect = document.getElementById("boardSelect");
  const saveButton = document.getElementById("saveButton");

  function checkInputs() {
    // Debugging: Log input values to check if they're being read
    // console.log({
    //   title: titleInput.value.trim(),
    //   position: positionSelect.value,
    //   list: listSelect.value,
    //   board: boardSelect.value
    // });

    // Check if all inputs have non-empty values
    if (
      titleInput.value.trim() !== "" &&
      positionSelect.value !== "" &&
      listSelect.value !== "" &&
      boardSelect.value !== ""
    ) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  }

  // Attach event listeners
  titleInput.addEventListener("input", checkInputs);
  positionSelect.addEventListener("change", checkInputs);
  listSelect.addEventListener("change", checkInputs);
  boardSelect.addEventListener("change", checkInputs);

  // Initial check (in case inputs are cached)
  checkInputs();
}

async function addautomationButton(ticketId, ticket_status) {
  const buttonTitle = document.getElementById("titleInput").value; // Get the value of the input field
  const listSelect = document.getElementById("listSelect").value;
  const buttonAction = `movecardAutomation('${ticketId}', '${ticket_status}', '${listSelect}')`;

  console.log(ticketId + ticket_status);

  try {
    const response = await fetch(`${API_BASE_URL}/automation-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ticketId,
        buttonTitle, // Now passing the value of the input field
        buttonAction
      })
    });
    if (response.ok) {
      console.log("move card automation button added successfully");
      location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function movecardAutomation(ticketId, currentTicketStatus, ticketStatus) {
  // only pass the new status
  const payload = { ticketId, ticketStatus };
  try {
    const response = await fetch(
      `${API_BASE_URL}/update-ticket-status-automation`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      console.log("Ticket Updated");
      location.reload();
    } else {
      console.log("Something went wrong");
    }
  } catch (error) {
    messageElement.textContent = "Error connecting to the server.";
    messageElement.className = "message error";
    console.error("Error:", error);
  }
}
