function setDuedateCardToModal(ticketTitle, ticketId, ticket_status) {
  const copyCardToForm = document.getElementById("set-duedate-card-to-form");
  copyCardToForm.innerHTML = `
         <div class="modal-header">
          <h4 class="text-center">Edit Button</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          <div class="modal-body">
            <!-- Label Row -->
  <div class="d-flex align-items-center mb-2">
    <label class="form-label">Icon</label>
    <span></span>
    <label class="form-label ms-4">Title</label>
  </div>
  
  <!-- Input Row -->
  <div class="d-flex align-items-center">
    <!-- Icon -->
    <div class="icon-placeholder me-2 d-flex align-items-center justify-content-center border rounded p-2 bg-light">
      <i class="fas fa-clock"></i>
    </div>
  
    <!-- Input Field -->
    <input type="text" class="form-control" id="titleInput" placeholder="Set due date or start date...">
  </div>
  
      
            <!-- Actions -->
            <div class="mb-3">
              <label class="form-label">Actions</label>
              <div class="border p-3">
                <strong>Dates</strong></strong>
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
                    <option value="days">days</option>
                    <option value="days">days</option>
                  </select>
                  later
                </div>
              </div>
            </div>
      
            <!-- Add Action Button -->
            <button type="button" class="btn btn-light w-100" onclick="openActionModal()">
              + Add action
            </button>
          </div>
      
          <div class="modal-footer">
            <button type="button" class="btn btn-primary w-100" id="saveButton" disabled onclick="addduedateautomationButton('${ticketId}','${ticket_status}')">Add Button</button>
          </div>
          <p class="message" id="message"></p>

        `;

  // Initialize and show the Bootstrap modal dynamically
  let modalElementauto = document.getElementById("setdueDateCardToModal");
  let modal = new bootstrap.Modal(modalElementauto);
  modal.show();
  fetchLists();

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

async function addduedateautomationButton(ticketId, ticket_status) {
  const buttonTitle = document.getElementById("titleInput").value; // Get the value of the input field
  const listSelect = document.getElementById("listSelect").value;
  const boardSelect = document.getElementById("boardSelect").value;
  const buttonAction = `addduedateAutomation('${ticketId}', '${listSelect}' , '${boardSelect}',)`;

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
      console.log("set due date card automation button added successfully");
      location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
}

async function addduedateAutomation(ticket_id, listSelect, boardSelect) {
  const ticket_eta = listSelect + boardSelect;
  const messageBox = document.getElementById("message");

  if (!ticket_id || !ticket_eta) {
    messageBox.textContent = "Please fill in both fields.";
    messageBox.style.color = "red";
    return;
  }

  fetch(`${API_BASE_URL}/automation-ticket-eta`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticket_id, ticket_eta })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        messageBox.textContent = "Error: " + data.error;
        messageBox.style.color = "red";
      } else {
        messageBox.textContent = "Success: " + data.message;
        messageBox.style.color = "green";
        window.location.reload();
      }
    })
    .catch(error => {
      messageBox.textContent = "Failed to connect to API.";
      messageBox.style.color = "red";
      console.error("Request Error:", error);
    });
}

// function to fetch list
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
