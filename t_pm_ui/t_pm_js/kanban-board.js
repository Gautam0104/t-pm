import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
import { errorLog } from "./error.js";
import { newRule } from "./todo.js";
import { moveAllCard } from "./moveallcard.js";
import { copyCardStatus } from "./createNewArea.js";
// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL;
var urlParams = new URLSearchParams(window.location.search);
var project_name = urlParams.get("pname");
// Function to fetch and populate lists
async function fetchListsnew() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-boards?board_name=${project_name}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }

    const lists = await response.json();
    const selects = document.querySelectorAll(
      ".listSelect.form-select.d-inline.w-auto.m-3"
    );

    if (selects.length === 0) {
      console.warn("No select elements found");
      return;
    }

    selects.forEach(select => {
      select.innerHTML = '<option value="">Select List</option>';

      lists.forEach(list => {
        const option = document.createElement("option");
        option.value = list.board_title;
        option.textContent = list.board_title;
        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error("Fetch list  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  }
}

// Initialize lists when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(() => {
    const selectElements = document.querySelectorAll(".listSelect");
    console.log("Found elements:", selectElements.length);

    if (selectElements.length > 0) {
      fetchListsnew();
    } else {
      console.warn("No .listSelect elements found at the time of execution");
    }
  }, 500);
});

// Access the URL securely

fetch(`${API_BASE_URL}/get-boards?board_name=${project_name}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    const kanbanboardContainer = document.getElementById(
      ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
    );
    data.forEach(item => {
      const kanbanboardContent = `<div data-id="board-in-progress" data-order="${item.order}" class="kanban-board" id="board-${item.order}"
        style="width: 250px; margin-left: 12px; margin-right: 12px;">
        <header class="kanban-board-header" id="${item.board_title}-header">
            <div class="kanban-title-board" style="text-transform: capitalize;">${item.board_title}</div>


            <div class="dropdown" style="height:auto;">

            <span id="watched-${item.board_title}-card"></span>

            <i class="ti ti-arrows-horizontal"
                onclick="toggleTodo('${item.board_title}-task','${item.board_title}-header', 'new-${item.board_title}-item')"></i>

            <i class="dropdown-toggle ti ti-dots-vertical cursor-pointer" id="board-dropdown"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>

            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="board-dropdown">
                <!-- Delete -->
                <a class="dropdown-item delete-board waves-effect" href="javascript:void(0)" onclick="deleteBoard('${item.board_id}')">
                <i class="ti ti-trash ti-xs me-1"></i> <span class="align-middle">Delete</span>
                </a>

                <!-- Rename -->
                <a class="dropdown-item waves-effect" href="javascript:void(0)">
                <i class="ti ti-edit ti-xs me-1"></i> <span class="align-middle">Rename</span>
                </a>

                <!-- Archive -->
                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                onclick="archiveBoard(this)">
                <i class="ti ti-archive ti-xs me-1"></i> <span class="align-middle">Archive</span>
                </a>
                <!-- New button to archive all cards -->
                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                onclick="archiveAllCards(this)">
                <i class="ti ti-archive ti-xs me-1"></i> <span class="align-middle">Archive All
                    Cards</span>
                </a>
                <!-- Move Board -->
                <a class="dropdown-item waves-effect move-board-trigger" href="javascript:void(0)"
                onclick="moveBoard(this)">
                <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Move Board</span>
                </a>

                <!-- Copy Board -->
                <a class="dropdown-item waves-effect"  data-bs-toggle="modal" data-bs-target="#copyboardModal" onclick="copyBoardList('${item.board_title}')">
                <i class="ti ti-copy"></i> <span class="align-middle">Copy Board</span>
                </a>

                <!-- Move all card in this list -->
                <div class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                    <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Move all card in this
                    list</span>
                </a>
                <div class="dropdown-menu">
                <form >

                  <div class="mb-4">
                    <label class="form-check-label">Move all From</label>
                    <input type="text" class="form-control" id="move-from" placeholder="Move from ${item.board_title}" value="${item.board_title}">
                  </div>
                  <div class="mb-4">
                    <label class="form-check-label">Move all To</label>
                    <input type="text" class="form-control" id="move-to" placeholder="Please enter board where you want to move all card">
                  </div>
                  <div class="mb-4 w-100">
                    <button type="button" class="btn btn-primary btn-sm me-4" id="moveAllCard">Move...</button>
                  </div>
                </form>
              </div>
            </div>
            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                <i class="ti ti-arrows-sort ti-xs me-1"></i> <span class="align-middle">Sort by...</span>
              </a>
              <div class="dropdown-menu">
                <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="toggleTicketSort('${item.board_title}-task', 'name')">
                  <i class="ti ti-calendar ti-xs me-1"></i> <span class="align-middle">Sort by Name</span>
                </a>
                <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="toggleTicketSort('${item.board_title}-task', 'date')">
                  <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by created date (newest first)</span>
                </a>
                <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="toggleTicketSort('${item.board_title}-task', 'date')">
                  <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by created date (oldest first)</span>
                </a>
              </div>
            </div>
            <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="watchedCard('watched-${item.board_title}-card')" id="watched-${item.board_title}-card-anchor">
              <i class="ti ti-eye ti-xs me-1"></i> <span class="align-middle">Watch</span>
            </a>
            <a class="dropdown-item waves-effect" href="javascript:void(0)" id="">
              <i class="ti ti-layout-list ti-xs"></i> <span class="align-middle">Automation</span>
            </a>
            <div class="dropdown-submenu">
              <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                <i class="ti ti-pencil ti-xs"></i> <span class="align-middle">When a card is added to the list.</span>
              </a>
              <div class="dropdown-menu" style="width: 420px;">
                <div class="modal-dialog" style="width: 100%;">
       <div class="modal-content p-2 w-100">
        <div class="modal-header d-flex justify-content-between w-100">
          <h5 class="text-center">New Rule</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body w-100">
          
          <div class="mb-4">
            <label class="form-label">When</label>
            <div class="border p-3">
            <span
                    class="avatar-initial rounded bg-label-primary "><i class="ti ti-layout"></i> 
                    <strong>Cards & lists</strong>
                          </span>
              <div>
                When a card is added to the list 
                <select class="listSelect form-select d-inline w-auto m-3">
                
                </select>
               
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Then</label>
            
          </div>
          <button type="button" class="btn btn-primary w-100 mt-2" data-bs-toggle="modal" data-bs-target="#AutomationactionModalLabel">
            + Add action
          </button>
          <button type="button" class="btn btn-light w-100 mt-2" id="addNewRule"> Add new rule </button>
        </div>
        <div class="modal-footer"w-100>
        
        </div>
      </div>
    </div>
                </div>
                </div>
                <!--Every day,sort list by.. -->
                <div class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                    <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Every day,sort list by..</span>
                </a>
                <div class="dropdown-menu"  style="width: 420px;">
                <div class="modal-dialog" style="width: 100%;">
                  <div class="modal-content p-2 w-100">
                    <div class="modal-header d-flex justify-content-between w-100">
                      <h5 class="text-center">New Rule</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body w-100">
                      <div class="mb-4">
                        <label class="form-label">When</label>
                        <div class="border p-3">
                          <strong>Calendar</strong>
                          <div>Everyday</div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Then</label>
                        <div class="border p-3">
                          <div>
                            Sort the list
                             <select class="listSelect form-select d-inline w-auto m-3" >
                             </select>
                            by
                            <select id="dueDate" class="form-select d-inline w-auto m-3">
                              <option value="">Due Date</option>
                              <option value="time">Time</option>
                              <option value="age">Age</option>
                              <option value="duedate">duedate</option>
                              <option value="name">name</option>
                              <option value="date">date</option>
                              <option value="label">label</option>
                            </select>
                            <select id="boardOrder" class="form-select d-inline w-auto m-3">
                              <option value="">Order</option>
                              <option value="ascending">Ascending</option>
                              <option value="descending">Descending</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button type="button" class="btn btn-primary w-100" id="start">Add new rule</button>
                    </div>
                    <div class="modal-footer"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="dropdown-submenu w-100">
              <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                <i class="ti ti-arrows-up-down ti-xs"></i> <span class="align-middle">Every Monday, sort list by..</span>
              </a>
              <div class="dropdown-menu" style="width: 420px;">
                <div class="modal-dialog" style="width: 100%;">
                  <div class="modal-content p-2 w-100">
                    <div class="modal-header d-flex justify-content-between w-100">
                      <h5 class="text-center">New Rule</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body w-100">
                      <div class="mb-4">
                        <label class="form-label">When</label>
                        <div class="border p-3">
                          <strong>Calendar</strong>
                          <div>
                            Every
                            <select id="positionSelect1" class="form-select d-inline w-auto m-3">
                              <option value="">Day</option>
                              <option value="monday">Monday</option>
                              <option value="thuesday">Tuesday</option>
                              <option value="wednesday">Wednesday</option>
                              <option value="thursday">Thursday</option>
                              <option value="friday">Friday</option>
                              <option value="saturday">Saturday</option>
                              <option value="sunday">Sunday</option>
                            </select>
                            at
                            <input type="time" id="timeInput" class="form-control d-inline w-auto m-3">
                          </div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Then</label>
                        <div class="border p-3">
                          <div>
                            Sort the list
                             <select class="listSelect form-select d-inline w-auto m-3" >
                             </select>
                            by
                            <select id="dueDate" class="form-select d-inline w-auto m-3">
                              <option value="time">Time</option>
                              <option value="age">Age</option>
                              <option value="duedate">duedate</option>
                              <option value="name">name</option>
                              <option value="date">date</option>
                              <option value="label">label</option>
                            </select>
                            <select id="boardOrder" class="form-select d-inline w-auto m-3">
                              <option value="">Order</option>
                              <option value="ascending">Ascending</option>
                              <option value="descending">Descending</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <button type="button" class="btn btn-primary w-100" id="addActionButton" onclick>Add new rule</button>
                    </div>
                    <div class="modal-footer"></div>
                  </div>
                </div>
              </div>
            </div>
            <a class="dropdown-item delete-board waves-effect" href="javascript:void(0)" id="create-rule-automation" data-bs-toggle="modal" data-bs-target="#createRule">
              <i class="ti ti-arrow-up-right ti-xs me-1"></i> <span class="align-middle">Create a rule</span>
            </a>
            <div class="dropdown-item">
              <i class="ti ti-palette ti-xs"></i>
              <span class="align-middle">Card Bg</span>
              <div class="d-flex flex-wrap mt-2" style="width: 140px;">
                <div class="color-box" style="background: #ff5733;" onclick="changeBgColor('#ff5733', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #33ff57;" onclick="changeBgColor('#33ff57', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #3357ff;" onclick="changeBgColor('#3357ff', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #f4d03f;" onclick="changeBgColor('#f4d03f', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #8e44ad;" onclick="changeBgColor('#8e44ad', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #1abc9c;" onclick="changeBgColor('#1abc9c', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #e74c3c;" onclick="changeBgColor('#e74c3c', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #2c3e50;" onclick="changeBgColor('#2c3e50', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #d35400;" onclick="changeBgColor('#d35400', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #16a085;" onclick="changeBgColor('#16a085', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #ed0cf5;" onclick="changeBgColor('#ed0cf5', '${item.board_title}-task')"></div>
                <div class="color-box" style="background: #f9fafa;" onclick="makeDefault('${item.board_title}-task')"></div>
              </div>
            </div>
          </div>
        </div>
        <button class="kanban-title-button btn" id="add-${item.board_title}-item">+ Add New Item</button>
      </header>
      <main class="kanban-drag px-3">
        <div id="${item.board_title}-task" style="display: block;">
          <div id="content-inprogress">Dropped in ${item.board_title}</div>
        </div>
        <form class="new-item-form" id="add-new-${item.board_title}-form"></form>
        <div id="backdrop"></div>
      </main>
    </div>`;

      // Add the content to the container
      kanbanboardContainer.insertAdjacentHTML("beforeend", kanbanboardContent);

      // move all card

      document
        .getElementById("moveAllCard")
        .addEventListener("click", function() {
          const moveFrom = document
            .getElementById(ELEMENT_IDS.MOVE_FROM)
            .value.trim();
          const moveTo = document
            .getElementById(ELEMENT_IDS.MOVE_TO)
            .value.trim();

          moveAllCard(moveFrom, moveTo);
        });

      let intervalId;
      const startButton = document.getElementById("start");
      if (startButton) {
        startButton.addEventListener("click", function() {
          const timeSelect = document.getElementById("timeSelect");
          if (!intervalId) {
            intervalId = setInterval(
              () =>
                toggleTicketSort(`${item.board_title}-task`, timeSelect.value),
              8640000
            ); // Runs every 24 hours
          }
        });
      }
    });
  })
  .catch(error => {
    console.error("Fetching board  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  });

// Add event listeners
function addEventListeners() {
  document.addEventListener("click", function(event) {
    if (event.target && event.target.id === "create-rule-automation") {
      createRuleModal();
    }
  });
}

// Delete board function
const deleteBoard = async boardId => {
  try {
    // Send DELETE request to the API
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.DELETE_BOARD}/${boardId}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      console.log("board deleted successfully");
      window.location.reload();
    }
  } catch (error) {
    console.error("Delete board  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  }
};

// Toggle ticket sort function
function toggleTicketSort(elementId, sortType) {
  if (sortType === "name") {
    toggleTicketSortByName(elementId);
  } else if (sortType === "date") {
    toggleTicketSortByDate(elementId);
  }
}

// Sort by name
function toggleTicketSortByName(elementId) {
  let todoTask = document.getElementById(elementId);
  let kanbanItems = Array.from(todoTask.getElementsByClassName("kanban-item"));

  kanbanItems.sort((a, b) => {
    let nameA = a.querySelector(".kanban-text").innerText.trim().toLowerCase();
    let nameB = b.querySelector(".kanban-text").innerText.trim().toLowerCase();

    return isAscending
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  kanbanItems.forEach(item => todoTask.appendChild(item));
  isAscending = !isAscending;
}

// Sort by date
function toggleTicketSortByDate(elementId) {
  let todoTask = document.getElementById(elementId);
  let kanbanItems = Array.from(todoTask.getElementsByClassName("kanban-item"));

  kanbanItems.sort((a, b) => {
    let dateA = new Date(a.dataset.createdAt || 0);
    let dateB = new Date(b.dataset.createdAt || 0);

    return isDateAscending ? dateA - dateB : dateB - dateA;
  });

  kanbanItems.forEach(item => todoTask.appendChild(item));
  isDateAscending = !isDateAscending;
}

// Watched card function
function watchedCard(watched) {
  const checkedCard = document.getElementById(watched);
  const watchedAnchor = document.getElementById(`${watched}-anchor`);
  const isWatched = localStorage.getItem(`watched-${watched}`);

  if (isWatched) {
    checkedCard.innerHTML = "";
    if (watchedAnchor)
      watchedAnchor.innerHTML = watchedAnchor.innerHTML.replace(
        /<i class=\"ti ti-check ti-xs me-1\"><\/i>/g,
        ""
      );
    localStorage.removeItem(`watched-${watched}`);
  } else {
    checkedCard.innerHTML = `<i class="ti ti-eye ti-xs me-1"></i>`;
    if (watchedAnchor)
      watchedAnchor.innerHTML += `<i class="ti ti-check ti-xs me-1"></i>`;
    localStorage.setItem(`watched-${watched}`, true);
  }
}
function moveBoard() {
  console.log("The moveBoard function has been executed!");
  // Add your logic for moving the board here
}
moveBoard(); // Call the function to run it

// Sorting state variables
let isAscending = true;
let isDateAscending = true;

// Export functions to window object
window.newRule = newRule;
window.deleteBoard = deleteBoard;
window.toggleTicketSort = toggleTicketSortByName;
window.toggleTicketSort = toggleTicketSortByDate;
window.watchedCard = watchedCard;
window.addEventListener = addEventListeners;
window.toggleTicketSortByName = toggleTicketSortByName;
window.toggleTicketSortByDate = toggleTicketSortByDate;
window.moveAllCard = moveAllCard;

window.archiveBoard = archiveBoard;
window.archiveAllCards = archiveAllCards;
window.moveBoard = moveBoard;
window.changeBgColor = changeBgColor;
window.makeDefault = makeDefault;
window.createRuleModal = createRuleModal;
window.copyCardStatus = copyCardStatus;
