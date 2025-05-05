import { apiUrl } from '../../apiRoutesHeader.js';

// Function to initialize card button functionality
export function initializeCardButtons() {
    const createNewButton = document.getElementById('createNewButton');
    const cancelCreate = document.getElementById('cancelCreate');
    const createButtonSection = document.querySelector('.create-button-section');
    const buttonListSection = document.querySelector('.button-list-section');
    const actionButtons = document.querySelectorAll('.btn-outline-secondary.btn-sm');
    const saveButton = document.querySelector('.create-button-section .btn-primary');

    // Toggle between create form and button list
    createNewButton?.addEventListener('click', function() {
        createButtonSection.classList.remove('d-none');
        buttonListSection.classList.add('d-none');
    });

    cancelCreate?.addEventListener('click', function() {
        createButtonSection.classList.add('d-none');
        buttonListSection.classList.remove('d-none');
        resetForm();
    });

    // Handle action button clicks
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionType = this.textContent.trim();
            addActionInput(actionType);
        });
    });

    // Handle save button click
    saveButton?.addEventListener('click', saveCardButton);
}

// Function to reset the form
function resetForm() {
    document.querySelector('input[placeholder="Button Name"]').value = '';
    document.getElementById('enabledByDefault').checked = true;
    document.getElementById('closeCard').checked = false;
    document.querySelector('.action-inputs').innerHTML = '';
}

// Function to add action input fields
function addActionInput(actionType) {
    const actionInputsContainer = document.querySelector('.action-inputs');
    let inputHTML = '';

    switch(actionType) {
        case 'Move':
            inputHTML = `
                <div class="input-group mb-3">
                    <input type="text" class="form-control" value="move" readonly>
                    <select class="form-select" aria-label="Move position">
                        <option value="top">to the top of list</option>
                        <option value="bottom">to the bottom of list</option>
                        <option value="specific">to position in list</option>
                    </select>
                    <select class="form-select" aria-label="Select list" id="listSelect">
                        <option selected disabled>Select a list</option>
                        <option value="ToDo">ToDo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                    <button class="btn btn-danger" onclick="this.parentElement.remove()">
                        <i class="ti ti-x"></i>
                    </button>
                </div>`;
            break;
        case 'Archive':
            inputHTML = `
                <div class="input-group mb-3">
                    <input type="text" class="form-control" value="archive" readonly>
                    <input type="text" class="form-control" value="the card" readonly>
                    <button class="btn btn-danger" onclick="this.parentElement.remove()">
                        <i class="ti ti-x"></i>
                    </button>
                </div>`;
            break;
        // Add more cases for other action types
    }

    if (inputHTML) {
        actionInputsContainer.insertAdjacentHTML('beforeend', inputHTML);
        // Initialize any new select elements if needed
        initializeSelects();
    }
}

// Function to initialize select elements with dynamic data
async function initializeSelects() {
    try {
        // Fetch lists from API
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.LIST}`); 
        const lists = await response.json();
        
        // Update all list select dropdowns
        const listSelects = document.querySelectorAll('#listSelect');
        listSelects.forEach(select => {
            // Keep the default option
            const defaultOption = select.querySelector('option[disabled]');
            select.innerHTML = '';
            if (defaultOption) {
                select.appendChild(defaultOption);
            }
            
            // Add list options
            lists.forEach(list => {
                const option = document.createElement('option');
                option.value = list.id;
                option.textContent = list.name;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Failed to load lists:', error);
    }
}

// Function to save card button
async function saveCardButton() {
    const buttonData = {
        title: document.querySelector('input[placeholder="Button Name"]').value,
        enabledByDefault: document.getElementById('enabledByDefault').checked,
        closeOnAction: document.getElementById('closeCard').checked,
        actions: getActions()
    };

    try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.CARD_BUTTONS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(buttonData)
        });

        if (response.ok) {
            // Show success message and reset form
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Card button created successfully!'
            });
            resetForm();
            document.querySelector('.create-button-section').classList.add('d-none');
            document.querySelector('.button-list-section').classList.remove('d-none');
            // Refresh button list
            loadCardButtons();
        } else {
            throw new Error('Failed to create card button');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create card button. Please try again.'
        });
    }
}

// Function to get actions from form
function getActions() {
    const actions = [];
    const actionInputs = document.querySelectorAll('.action-inputs .input-group');
    
    actionInputs.forEach(actionGroup => {
        const inputs = actionGroup.querySelectorAll('input, select');
        const action = {
            type: inputs[0].value,
            parameters: Array.from(inputs)
                .slice(1)
                .map(input => input.value)
                .filter(value => value && value !== 'Select a list') // Filter out placeholder values
        };
        actions.push(action);
    });

    return actions;
}

// Function to load existing card buttons
async function loadCardButtons() {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.CARD_BUTTONS}`); 
        const buttons = await response.json();
        displayCardButtons(buttons);
    } catch (error) {
        console.error('Failed to load card buttons:', error);
    }
}

// Function to display card buttons
function displayCardButtons(buttons) {
    const buttonListContainer = document.querySelector('.button-list-section');
    buttonListContainer.innerHTML = buttons.map(button => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <i class="ti ti-${button.icon || 'settings'} me-2"></i>
                    <span class="fw-medium">${button.title}</span>
                    <div class="ms-2">
                        <i class="ti ti-pencil me-1" onclick="editButton('${button.id}')"></i>
                        <i class="ti ti-copy me-1" onclick="duplicateButton('${button.id}')"></i>
                        <i class="ti ti-trash me-1" onclick="deleteButton('${button.id}')"></i>
                    </div>
                </div>
                <div class="bg-light p-3 rounded mb-3">
                    <span>${button.actions.map(action => action.type + ' ' + action.parameters.join(' ')).join(', ')}</span>
                </div>
                <!-- Visibility options -->
                <div class="d-flex align-items-center">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="visibility_${button.id}" checked>
                        <label class="form-check-label">Show on this board</label>
                    </div>
                    <div class="form-check ms-3">
                        <input class="form-check-input" type="radio" name="visibility_${button.id}">
                        <label class="form-check-label">Hide on this board for you only</label>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCardButtons); 