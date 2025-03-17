// Function to fetch and display board items
import { API_ROUTES } from "../apiRoutesHeader.js";
import {ELEMENT_IDS} from "./element_id.js";
async function getBoards() {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.GET_BOARDS}`);
        const data = await response.json();
        const boardList = document.getElementById(ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER);


        data.data.forEach(item => {

            const li = `                    <div data-id="board-${item.name}" data-order="${item.position}" class="kanban-board" id="board-${item.position}"
                      style="width: 250px; margin-left: 12px; margin-right: 12px;">
                      <header class="kanban-board-header" id="todo-header">
                        <div class="kanban-title-board">${item.name}</div>


                        <div class="dropdown">

                          <span id="watched-todo-card"></span>

                          <i class="ti ti-arrows-horizontal"
                            onclick="toggleTodo('todo-task','todo-header', 'new-todo-item')"></i>

                          <i class="dropdown-toggle ti ti-dots-vertical cursor-pointer" id="board-dropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>

                          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="board-dropdown">
                            <!-- Delete -->
                            <a class="dropdown-item delete-board waves-effect" href="javascript:void(0)">
                              <i class="ti ti-trash ti-xs me-1"></i> <span class="align-middle">Delete</span>
                            </a>

                            <!-- Rename -->
                            <a class="dropdown-item waves-effect" href="javascript:void(0)">
                              <i class="ti ti-edit ti-xs me-1"></i> <span class="align-middle">Rename</span>
                            </a>

                            <!-- Archive -->
                            <a class="dropdown-item waves-effect" href="javascript:void(0)">
                              <i class="ti ti-archive ti-xs me-1"></i> <span class="align-middle">Archive</span>
                            </a>
                            <!-- Move Board -->
                            <a class="dropdown-item waves-effect move-board-trigger" href="javascript:void(0)"
                              onclick="moveBoard(this)">
                              <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Move Board</span>
                            </a>

                            <!-- Copy Board -->
                            <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="copyBoard(this)">
                              <i class="ti ti-copy"></i> <span class="align-middle">Copy Board</span>
                            </a>

                            <!-- Move all card in this list -->
                            <div class="dropdown-submenu">
                              <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                                <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Move all card in this
                                  list</span>
                              </a>
                              <div class="dropdown-menu">
                                <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick=""
                                  style="pointer-events: none; opacity: 0.6; cursor: not-allowed;">

                                  <i class="ti ti-calendar ti-xs me-1"></i> <span class="align-middle">ToDo
                                  </span>
                                </a>
                                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                                  onclick="moveAllTask('todo-task', 'inprogress-task', 'todo', 'inprogress')">
                                  <i class="ti ti-calendar ti-xs me-1"></i> <span class="align-middle">In-Progress
                                  </span>
                                </a>
                                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                                  onclick="moveAllTask('todo-task', 'for-approval-task', 'todo', 'for-approval')">
                                  <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">For-Approval
                                  </span>
                                </a>
                                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                                  onclick="moveAllTask('todo-task', 'rejected-task', 'todo', 'rejected')">
                                  <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Rejected
                                  </span>
                                </a>
                                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                                  onclick="moveAllTask('todo-task', 'approved-task', 'todo', 'approved')">
                                  <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Approved
                                  </span>
                                </a>
                              </div>
                            </div>
                            <!-- Sort By (Nested Dropdown) -->
                            <div class="dropdown-submenu">
                              <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                                <i class="ti ti-arrows-sort ti-xs me-1"></i> <span class="align-middle">Sort
                                  by...</span>
                              </a>
                              <div class="dropdown-menu">
                                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                                  onclick="toggleTicketSortByName('todo-task')">
                                  <i class="ti ti-calendar ti-xs me-1"></i> <span class="align-middle">Sort by
                                    Name</span>
                                </a>
                                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                                  onclick="toggleTicketSortByDate('todo-task')">
                                  <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by
                                    created date (newest first)</span>
                                </a>
                                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                                  onclick="toggleTicketSortByDate('todo-task')">
                                  <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by created
                                    date (oldest first)</span>
                                </a>
                              </div>
                            </div>
                            <!-- Watch -->
                            <a class="dropdown-item waves-effect" href="javascript:void(0)"
                              onclick="watchedCard('watched-todo-card')" id="watched-todo-card-anchor">
                              <i class="ti ti-eye ti-xs me-1"></i> <span class="align-middle">Watch</span>
                            </a>
                            <!-- Color Picker -->
                            <div class="dropdown-item">
                              <i class="ti ti-palette ti-xs"></i>
                              <span class="align-middle">Card Bg</span>
                              <div class="d-flex flex-wrap mt-2" style="width: 140px;">
                                <div class="color-box" style="background: #ff5733;"
                                  onclick="changeBgColor('#ff5733','todo-task')"></div>
                                <div class="color-box" style="background: #33ff57;"
                                  onclick="changeBgColor('#33ff57','todo-task')"></div>
                                <div class="color-box" style="background: #3357ff;"
                                  onclick="changeBgColor('#3357ff','todo-task')"></div>
                                <div class="color-box" style="background: #f4d03f;"
                                  onclick="changeBgColor('#f4d03f','todo-task')"></div>
                                <div class="color-box" style="background: #8e44ad;"
                                  onclick="changeBgColor('#8e44ad','todo-task')"></div>
                                <div class="color-box" style="background: #1abc9c;"
                                  onclick="changeBgColor('#1abc9c','todo-task')"></div>
                                <div class="color-box" style="background: #e74c3c;"
                                  onclick="changeBgColor('#e74c3c','todo-task')"></div>
                                <div class="color-box" style="background: #2c3e50;"
                                  onclick="changeBgColor('#2c3e50','todo-task')"></div>
                                <div class="color-box" style="background: #d35400;"
                                  onclick="changeBgColor('#d35400','todo-task')"></div>
                                <div class="color-box" style="background: #16a085;"
                                  onclick="changeBgColor('#16a085','todo-task')"></div>
                                <div class="color-box" style="background: #ed0cf5;"
                                  onclick="changeBgColor('#ed0cf5','todo-task')"></div>
                                <div class="color-box" style="background: #f9fafa;" onclick="makeDefault('todo-task')">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button class="kanban-title-button btn" id="add-todo-item" onclick="formShowHide('${item.name}')">+ Add
                          New
                          Item</button>


                      </header>
                      <main class="kanban-drag">

                        <div id="${item.name}-task" style="display: block;">
                          <div id="content-inprogress">Droped in todo</div>

                        </div>
                        <form class="new-item-form" id="add-new-${item.name}-form" style="display:none;">

                        <div class="mb-4"><textarea class="form-control add-new-item" rows="2" id="ticket-title-for-approval" placeholder="Add Content" required=""></textarea>
                                                </div>
                                                <div class="mb-4"><button type="submit" class="btn btn-primary btn-sm me-4">Add</button><button type="button" class="btn btn-label-secondary btn-sm cancel-add-item waves-effect waves-light" id="cancel-form-3" onclick="formShowHide('${item.name}')">Cancel</button>
                                                </div></form>
                        <div id="backdrop">

                        </div>
                      </main>
                      <!-- <footer></footer> -->
                    </div>`;
            boardList.innerHTML += li;
            copyTicket(item.name, 'inprogress')

        });
    } catch (error) {
        console.error("Error fetching board items:", error);
    }
}

// Function to add a new board item
async function addBoard() {
    const name = document.getElementById(ELEMENT_IDS.COPY_BOARD_NAME).value;
    if (!name) {
        alert("Please enter a name!");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.ADD_NEW_BOARD}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById(ELEMENT_IDS.COPY_BOARD_NAME).value = ""; // Clear input
            getBoards(); // Refresh the board list
        } else {
            alert("Error: " + data.error);
        }
    } catch (error) {
        console.error("Error adding board item:", error);
    }
}

// Load board items when the page loads
window.onload = getBoards;


// Function to toggle the form visibility
function formShowHide(boardName) {
    const newForm = document.getElementById(`add-new-${boardName}-form`);

    // Check the current display status and toggle it
    if (newForm.style.display === "none" || newForm.style.display === "") {
        newForm.style.display = "block";  // Show the form
    } else {
        newForm.style.display = "none";   // Hide the form
    }
}



function copyTicket(newStatus, currentStatus) {

    // Check if both values are selected
    if (!currentStatus || !newStatus) {
        showMessage('Please select both current status and new status.', 'error');
        return;
    }

    // Send the data to the backend API
    fetch(`${API_BASE_URL}${API_ROUTES.COPY_BOARD}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            currentStatus: currentStatus,
            newStatus: newStatus
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage(data.message, 'success');
            } else {
                showMessage('Failed to copy the tickets.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        });
}
window.addBoard = addBoard;
window.formShowHide = formShowHide;