// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely


// get tickets


fetch(`${API_BASE_URL}/tickets`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.forEach(element => {
            const cardItem = document.getElementById('todo-task');

            // Create kanban card dynamically
            const card = document.createElement('div');
            card.className = "kanban-item";
            card.setAttribute('data-eid', element.id || "in-progress-1");
            card.setAttribute('data-comments', element.comments || "12");
            card.setAttribute('data-badge-text', element.badge || "UX");
            card.setAttribute('data-badge', "success");
            card.setAttribute('data-due-date', element.dueDate || "5 April");
            card.setAttribute('data-attachments', element.attachments || "4");
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
                            <span class="attachments">${element.attachments || "4"}</span>
                        </span>
                        <span class="d-flex align-items-center ms-2">
                            <i class="ti ti-message-2 me-1"></i>
                            <span>${element.comments || "12"}</span>
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
            cardItem.appendChild(card);
        });
    })
    .catch(error => console.error("Error fetching data:", error));

// Function to make an element draggable
function makeDraggable(element) {
    element.setAttribute('draggable', 'true');

    // Add dragstart event
    element.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', element.id); // Set the id of the dragged element
        element.classList.add('dragging');
    });

    // Add dragend event
    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
    });
}

const containers = document.querySelectorAll('.kanban-container');

containers.forEach(container => {
    container.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move"; // Show move cursor
        const draggingElement = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(container, event.clientY);

        if (afterElement == null) {
            container.appendChild(draggingElement);
        } else {
            container.insertBefore(draggingElement, afterElement);
        }
    });

    container.addEventListener('drop', (event) => {
        event.preventDefault();
        const cardId = event.dataTransfer.getData('text/plain');
        const draggedElement = document.querySelector(`[data-eid='${cardId}']`);
        container.appendChild(draggedElement); // Append card to the drop container
    });
});

// Helper function to find the correct position for the dragged item
function getDragAfterElement(container, y) {
    const draggableElements = [
        ...container.querySelectorAll('.kanban-item:not(.dragging)')
    ];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}