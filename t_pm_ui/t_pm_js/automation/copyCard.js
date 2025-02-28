function copyCardToModal(ticketTitle, ticketId, ticket_status) {
  const copyCardToForm = document.getElementById(
    "automation-copy-card-to-form"
  );
  copyCardToForm.innerHTML = `
       <div class="modal-header">
        <h4 class="text-center">Edit Button</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
        <div class="modal-body">
          <!-- Title Input -->
          <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" class="form-control" id="titleInput" placeholder="copy card to...">
          </div>
    
          <!-- Actions -->
          <div class="mb-3">
            <label class="form-label">Actions</label>
            <div class="border p-3">
              <strong>Copy</strong></strong>
              <div>
                Copy the card to the 
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
          <button type="button" class="btn btn-primary w-100" id="saveButton" disabled onclick="addcopyautomationButton('${ticketId}','${ticket_status}')">Add Button</button>
        </div>
      `;

  // Initialize and show the Bootstrap modal dynamically
  let modalElementauto = document.getElementById("automationcopyCardToModal");
  let modal = new bootstrap.Modal(modalElementauto);
  modal.show();

  // Attach event listeners directly after injecting HTML
  const titleInput = document.getElementById("titleInput");
  const positionSelect = document.getElementById("positionSelect1");
  const listSelect = document.getElementById("listSelect");
  const boardSelect = document.getElementById("boardSelect");
  const saveButton = document.getElementById("saveButton");

  function checkInputs() {
   
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

async function addcopyautomationButton(ticketId, ticket_status) {
  const buttonTitle = document.getElementById("titleInput").value; // Get the value of the input field
  const listSelect = document.getElementById("listSelect").value;
  const buttonAction = `copycardAutomation('${ticketId}', '${ticket_status}', '${listSelect}')`;

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
      console.log("copy card automation button added successfully");
      location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function copycardAutomation(ticketId, currentTicketStatus, ticketStatus) {
  // only pass the new status
  const payload = { ticketStatus };
  try {
    const response = await fetch(
      `${API_BASE_URL}/copy-row-automation/${ticketId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      console.log("Ticket copied");
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
