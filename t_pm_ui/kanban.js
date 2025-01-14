// const kanbanItems = document.querySelectorAll('.kanban-item');
// const offcanvas = document.querySelector('.offcanvas');
// const contentWrapper = document.querySelector('.content-wrapper');
// const offcanvasClosebtn = document.getElementById('offcanvase-close');
// const backdrop = `<div class="offcanvas-backdrop fade show"></div>`;
// open canbavase 
// for (const kanbanItem of kanbanItems) {
//     kanbanItem.addEventListener('click', function () {
//         console.log('kanban-item working');
//         offcanvas.classList.add('show');
//         contentWrapper.appendChild(backdrop);
//     });
// }

// close canvase
offcanvasClosebtn.addEventListener('click', function () {
    offcanvas.classList.remove('show');
})
//Add new todo item||ticket||task
const addItems = document.querySelectorAll('.kanban-title-button');
const addItmeForm = document.getElementById('add-new-todo');

for (const addItem of addItems) {
    addItem.addEventListener('click', function () {

        const formContent = `<div class="mb-4"><textarea class="form-control add-new-item" rows="2" id="ticket-title"
                                                        placeholder="Add Content"  required=""></textarea>
                                                </div>
                                                <div class="mb-4"><button type="submit"
                                                        class="btn btn-primary btn-sm me-4">Add</button><button
                                                        type="button"
                                                        class="btn btn-label-secondary btn-sm cancel-add-item waves-effect waves-light" >Cancel</button>
                                                </div>`;
        addItmeForm.innerHTML += formContent;
    });
}

// Select all kanban items dynamically
const kanbanselectItems = document.querySelectorAll('.kanban-item');

// Add drag event listeners to kanban items
kanbanselectItems.forEach(item => {
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

// const cancelAddItem = document.getElementsByClassName('cancel-add-item');

// const formhide = () => {
//     console.log('heelo');

//     addItmeForm.style.display = "none";
// }