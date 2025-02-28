function retrieveAutomation(ticketId) {
  fetch(`${API_BASE_URL}/automation-data`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const automationButtonArea = document.getElementById(
        `automation-button-ul-${ticketId}`
      );
      if (data.length > 0) {
        automationButtonArea.style.display = "block";
      }
      data.map(item => {
        const automationButtonAreaContent = `<li class="nav-item dropdown">
        <button class="nav-link  d-flex align-items-center border-0  w-100" id="add-button-dropdown" onclick="${item.button_action}">
               <i class="fas fa-arrow-right me-2"></i> ${item.button_title}
           </button>
        </li>`;
        if (item.ticket_id === ticketId) {
          automationButtonArea.innerHTML += automationButtonAreaContent;
        }
      });
    });
}

function moveCardToModal(ticketTitle, ticketId, ticket_status) {
  console.log("ticket status is" + ticket_status);

  const moveCardToForm = document.getElementById("move-card-to-form");
  moveCardToForm.innerHTML = `
     <div class="modal-header">
      <h4 class="text-center">Edit Button</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      <div class="modal-body">
        <!-- Title Input -->
        <div class="mb-3">
          <label class="form-label">Title</label>
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
        <button type="button" class="btn btn-primary w-100" id="saveButton" disabled onclick="addautomationButton('${ticketId}','${current_ticket_status}','${ticket_status}')">Add Button</button>
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
