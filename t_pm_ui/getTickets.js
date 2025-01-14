// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely


// get tickets


fetch(`${API_BASE_URL}/ticket/`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            console.log(data);
            const cardItemTodo = document.getElementById('todo-task');
            // const cardItemInprogress = document.getElementById('in-progress');
            // const cardItemForapproval = document.getElementById('todo-task');
            // const cardItemRejected = document.getElementById('for-approval');
            // const cardItemAproved = document.getElementById('app');

            // Create kanban card dynamically
            const card = document.createElement('div');
            card.className = "kanban-item";
            card.setAttribute('data-eid', element.ticket_id || "in-progress-1");
            card.setAttribute('data-comments', element.comments || "0");
            card.setAttribute('data-badge-text', element.badge || "");
            card.setAttribute('data-badge', "success");
            card.setAttribute('data-due-date', element.dueDate || "5 April");
            card.setAttribute('data-attachments', element.attachments || "0");
            card.setAttribute('data-members', element.members || "Thunder,Thunder");

            // Add card content
            card.innerHTML = `
                <div class="d-flex justify-content-between flex-wrap align-items-center mb-2">
                    <div class="item-badges">
                        <div class="badge bg-label-success">${element.badge || "UX"}</div>
                    </div>
                    <div class="dropdown kanban-tasks-item-dropdown">
                        <i class="dropdown-toggle ti ti-dots-vertical" id="kanban-tasks-item-dropdown" 
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                        <div class="dropdown-menu dropdown-menu-end" 
                            aria-labelledby="kanban-tasks-item-dropdown">
                            <a class="dropdown-item waves-effect" href="javascript:void(0)">Copy task link</a>
                            <a class="dropdown-item waves-effect" href="javascript:void(0)">Duplicate task</a>
                            <a class="dropdown-item delete-task waves-effect" href="javascript:void(0)">Delete</a>
                        </div>
                    </div>
                </div>
                <span class="kanban-text">${element.title}</span>
                <div class="d-flex justify-content-between align-items-center flex-wrap mt-2">
                    <div class="d-flex">
                        <span class="d-flex align-items-center me-2">
                            <i class="ti ti-paperclip me-1"></i>
                            <span class="attachments">${element.attachments || "0"}</span>
                        </span>
                        <span class="d-flex align-items-center ms-2">
                            <i class="ti ti-message-2 me-1"></i>
                            <span>${element.comments || "0"}</span>
                        </span>
                    </div>
                    <div class="avatar-group d-flex align-items-center assigned-avatar">
                        <div class="avatar avatar-xs" data-bs-toggle="tooltip" 
                            data-bs-placement="top" aria-label="Thunder" data-bs-original-title="Thunder">
                            <img src="../assets/img/avatars/1.png" alt="Avatar" 
                                class="rounded-circle pull-up">
                        </div>
                        <div class="avatar avatar-xs" data-bs-toggle="tooltip" 
                            data-bs-placement="top" aria-label="Thunder" data-bs-original-title="Thunder">
                            <img src="../assets/img/avatars/1.png" alt="Avatar" 
                                class="rounded-circle pull-up">
                        </div>
                    </div>
                </div>
            `;

            // Make the card draggable
            makeDraggable(card);

            // Append card to the container
            cardItemTodo.appendChild(card);
        });
    })
    .catch(error => console.error("Error fetching data:", error));

// Function to make an element draggable
const kanbanselect = document.querySelectorAll('.kanban-item');

// Add drag event listeners to kanban items
kanbanselect.forEach(item => {
    item.setAttribute('draggable', 'true'); // Ensure draggable attribute is set
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

// Select all drop zones (kanban-drag within kanban-board)
const taskContainers = document.querySelectorAll('.kanban-drag');

taskContainers.forEach(container => {
    container.addEventListener('dragover', dragOver);
    container.addEventListener('drop', drop);
});

// Variables
let draggedItem = null;

// Drag-and-drop functions
function dragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move'; // Allow moving the item
    setTimeout(() => (this.style.display = 'none'), 0); // Temporarily hide the item while dragging
}

function dragEnd(e) {
    this.style.display = 'block'; // Restore item visibility after dragging
    draggedItem = null;
}

function dragOver(e) {
    e.preventDefault(); // Allow items to be dropped
    e.dataTransfer.dropEffect = 'move'; // Indicate the move action
}

function drop(e) {
    e.preventDefault();
    if (draggedItem) {
        this.appendChild(draggedItem); // Append the dragged item to the drop target
    }
}