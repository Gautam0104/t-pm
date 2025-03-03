function removeCardToModal(ticketTitle, ticketId, ticket_status) {
  const removeCardToForm = document.getElementById('remove-card-to-form');
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
                    <select id="positionSelect1" class="form-select d-inline w-auto m-2" onchange="toggleLabelDropdown()">
                      <option value="">Select</option>
                      <option value="the-label">the label</option>
                      <option value="all-labels">all labels</option>
                      <option value="the-due-date">the due date</option>
                      <option value="the-start-date">the start date</option>
                      <option value="all-checklist">all checklists</option>
                      <option value="all-members">all members</option>
                      <option value="the-stickers">the stickers</option>
                      <option value="start-cover">start cover</option>
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
              <button type="button" class="btn btn-primary w-100" id="saveButton" disabled onclick="addduedateautomationButton('${ticketId}','${ticket_status}')">Add Button</button>
            </div>
            <p class="message" id="message"></p>
  
          `;

  // Initialize and show the Bootstrap modal dynamically
  let modalElementauto = document.getElementById('removeCardToModal');
  let modal = new bootstrap.Modal(modalElementauto);
  modal.show();
  fetchLists();

  // Attach event listeners directly after injecting HTML
  const titleInput = document.getElementById('titleInput');
  const positionSelect = document.getElementById('positionSelect1');
  const listSelect = document.getElementById('listSelect');
  const boardSelect = document.getElementById('boardSelect');
  const saveButton = document.getElementById('saveButton');

  function checkInputs() {
    if (
      titleInput.value.trim() !== '' &&
      positionSelect.value !== '' &&
      listSelect.value !== '' &&
      boardSelect.value !== ''
    ) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  }

  // Attach event listeners
  titleInput.addEventListener('input', checkInputs);
  positionSelect.addEventListener('change', checkInputs);
  listSelect.addEventListener('change', checkInputs);
  boardSelect.addEventListener('change', checkInputs);

  // Initial check (in case inputs are cached)
  checkInputs();
}

async function addduedateautomationButton(ticketId, ticket_status) {
  const buttonTitle = document.getElementById('titleInput').value; // Get the value of the input field
  const listSelect = document.getElementById('listSelect').value;
  const boardSelect = document.getElementById('boardSelect').value;
  const buttonAction = `addduedateAutomation('${ticketId}', '${listSelect}' , '${boardSelect}',)`;

  console.log(ticketId + ticket_status);

  try {
    const response = await fetch(`${API_BASE_URL}/automation-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ticketId,
        buttonTitle, // Now passing the value of the input field
        buttonAction
      })
    });
    if (response.ok) {
      console.log('set due date card automation button added successfully');
      location.reload();
    }
  } catch (error) {
    console.log('error', error);
  }
}

async function addduedateAutomation(ticket_id, listSelect, boardSelect) {
  const ticket_eta = listSelect + boardSelect;
  const messageBox = document.getElementById('message');

  if (!ticket_id || !ticket_eta) {
    messageBox.textContent = 'Please fill in both fields.';
    messageBox.style.color = 'red';
    return;
  }

  fetch(`${API_BASE_URL}/automation-ticket-eta`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket_id, ticket_eta })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        messageBox.textContent = 'Error: ' + data.error;
        messageBox.style.color = 'red';
      } else {
        messageBox.textContent = 'Success: ' + data.message;
        messageBox.style.color = 'green';
        window.location.reload();
      }
    })
    .catch(error => {
      messageBox.textContent = 'Failed to connect to API.';
      messageBox.style.color = 'red';
      console.error('Request Error:', error);
    });
}

// function to fetch list
async function fetchLists() {
  try {
    const response = await fetch(`${API_BASE_URL}/getboards`);
    const lists = await response.json();

    const select = document.getElementById('listSelect');
    select.innerHTML = '<option value="">Select List</option>';

    lists.forEach(list => {
      const option = document.createElement('option');
      option.value = list.board_id;
      option.textContent = list.board_title;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching lists:', error);
  }
}
function toggleLabelDropdown() {
  const positionSelect = document.getElementById('positionSelect1');
  const labelDropdownContainer = document.getElementById('labelDropdownContainer');

  if (positionSelect.value === 'the-label') {
    labelDropdownContainer.style.display = 'block';
  } else {
    labelDropdownContainer.style.display = 'none';
  }
}
