function joinCardToModal(ticketTitle, ticketId) {
    const joinCardToForm = document.getElementById("automation-join-card-to-form");
    joinCardToForm.innerHTML = `
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
        <i class="fas fa-user me-2"></i>
      </div>
    
      <!-- Input Field -->
      <input type="text" class="form-control" id="titleInput" placeholder="Join card">
    </div>
              <!-- Actions -->
              <div class="mb-3">
                <label class="form-label">Actions</label>
                <div class="border p-3">
                  <strong>Members</strong></strong>
                  <div>
                    Join the card
                  </div>
                </div>
              </div>
        
              <!-- Add Action Button -->
              <button type="button" class="btn btn-light w-100" onclick="openActionModal()">
                + Add action
              </button>
            </div>
        
            <div class="modal-footer">
              <button type="button" class="btn btn-primary w-100" id="saveButton" disabled onclick="joinAutomationButton('${ticketId}')">Add Button</button>
            </div>
            <p class="message" id="message"></p>
  
          `;
  
    // Initialize and show the Bootstrap modal dynamically
    let modalElementauto = document.getElementById("automationjoinCardToModal");
    let modal = new bootstrap.Modal(modalElementauto);
    modal.show();
  
    // Attach event listeners directly after injecting HTML
    const titleInput = document.getElementById("titleInput");
    const saveButton = document.getElementById("saveButton");
  
    function checkInputs() {
      if (
        titleInput.value.trim() !== "" 
      ) {
        saveButton.disabled = false;
      } else {
        saveButton.disabled = true;
      }
    }
  
    // Attach event listeners
    titleInput.addEventListener("input", checkInputs);
  
    // Initial check (in case inputs are cached)
    checkInputs();
  }
  
  async function joinAutomationButton(ticketId) {
    const buttonTitle = document.getElementById("titleInput").value; // Get the value of the input field
    const buttonAction = `joinCardAutomation('${ticketId}')`;
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
        console.log("join card automation button added successfully");
        location.reload();
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  
  async function addduedateAutomation(ticket_id) {
    const messageBox = document.getElementById("message");
  
    if (!ticket_id || !ticket_eta) {
      messageBox.textContent = "Please fill in both fields.";
      messageBox.style.color = "red";
      return;
    }
  
    fetch(`${API_BASE_URL}/automation-ticket-join`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id})
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
  
 
  