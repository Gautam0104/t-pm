function removeCardToModal(ticketTitle, ticketId, ticket_status) {
  const removeCardToForm = document.getElementById("remove-card-to-form");
  removeCardToForm.innerHTML = `
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
        <i class="fas fa-minus me-2"></i>
      </div>
    
      <!-- Input Field -->
      <input type="text" class="form-control" id="titleInput" placeholder="Remove">
    </div>
    
        
              <!-- Actions -->
              <div class="mb-3">
                <label class="form-label">Actions</label>
                <div class="border p-3">
                  <strong>Remove</strong></strong>
                  <div>
                    Remove
                    <select id="selectremoveAutomation" class="form-select d-inline w-auto m-2" onchange="toggleLabelDropdown()">
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
                    <div id="labelDropdownContainer" style="display:none;" class="mt-2">
                   <div class="dropdown">
              <button class="btn btn-light dropdown-toggle" type="button" id="labelDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="color-option" id="selectedColor" style="background-color: green;"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="labelDropdown">
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(10, 82, 42)')"><span class="color-option" style="background-color: rgb(10, 82, 42);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(233, 34, 34)')"><span class="color-option" style="background-color: rgb(233, 34, 34);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(218, 110, 21)')"><span class="color-option" style="background-color: rgb(218, 110, 21);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(148, 122, 8)')"><span class="color-option" style="background-color: rgb(148, 122, 8);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(116, 128, 241)')"><span class="color-option" style="background-color:rgb(116, 128, 241);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(46, 60, 185)')"><span class="color-option" style="background-color: rgb(46, 60, 185);"></span></a></li>
              </ul>
              </div>
                    </div>
                    from the card
                  </div>
                </div>
              </div>
        
              <!-- Add Action Button -->
              <button type="button" class="btn btn-light w-100" onclick="openActionModal()">
                + Add action
              </button>
            </div>
        
            <div class="modal-footer">
              <button type="button" class="btn btn-primary w-100" id="saveButton" onclick="addremoveautomationButton('${ticketId}')">Add Button</button>
            </div>
            <p class="message" id="message"></p>
  
          `;

  // Initialize and show the Bootstrap modal dynamically
  let modalElementauto = document.getElementById("removeCardToModal");
  let modal = new bootstrap.Modal(modalElementauto);
  modal.show();
}

async function addremoveautomationButton(ticketId) {
  const removeFeature = document.getElementById("selectremoveAutomation").value;
  const buttonTitle = document.getElementById("titleInput").value;
  const buttonAction = `${removeFeature}('${ticketId}')`;

  console.log(removeFeature);

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

function removeDuedate(ticket_id) {
  const ticket_eta = "";
  const messageBox = document.getElementById("message");

  if (!ticket_id) {
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
async function removeAllChecklists(id) {
  try {
    // Send DELETE request to the API
    const response = await fetch(`${API_BASE_URL}/remove-checklist/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("You successfully removed all checklist of given id's card");
      window.location.reload(); // Refresh the page after successful delete
    } else {
      console.log("Oops, something went wrong");
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
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
