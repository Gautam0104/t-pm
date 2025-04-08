// import { ELEMENT_IDS } from "./constants.js";

function toggleTodo(elementId, elementHeader, elementButton) {
  const taskHeader = document.getElementById(elementHeader);
  const addtaskButton = document.getElementById(elementButton);
  const todoTab = document.getElementById(elementId);
  document.getElementById("add-todo-item").style.display = "none";
  if (todoTab.style.display === "block") {
    todoTab.style.display = "none";
    taskHeader.classList.add("horizontal-layout");
  } else {
    todoTab.style.display = "block";
    taskHeader.classList.remove("horizontal-layout");
    document.getElementById("add-todo-item").style.display = "block";
  }
}

// Function to change and store background color
function changeBgColor(color, elementId) {
  localStorage.setItem("card-bg-color-" + elementId, color); // Store color per element
  applyBgColor(elementId); // Apply immediately
}

// Function to apply stored background color on page load
function applyBgColor(elementId) {
  let cardBG = document.getElementById(elementId);
  if (!cardBG) return; // Prevent errors if element doesn't exist

  let storedColor = localStorage.getItem("card-bg-color-" + elementId);

  if (storedColor) {
    cardBG.style.backgroundColor = storedColor;
  }

  // Ensure consistent styling
  cardBG.style.borderRadius = "10px";
  cardBG.style.padding = "10px";
  cardBG.style.marginBottom = "10px";
}

// Ensure colors are applied when the page loads
window.addEventListener("load", function() {
  let elementIds = ["todo-task", "yourElementId2"]; // Add IDs of all elements needing persistence
  if (localStorage.getItem("card-bg-color-todo-task")) {
    elementIds.forEach(applyBgColor);
  }
});
window.addEventListener("load", function() {
  let elementIds = ["inprogress-task", "yourElementId2"]; // Add IDs of all elements needing persistence
  if (localStorage.getItem("card-bg-color-todo-task")) {
    elementIds.forEach(applyBgColor);
  }
});
window.addEventListener("load", function() {
  let elementIds = ["rejected-task", "yourElementId2"]; // Add IDs of all elements needing persistence
  if (localStorage.getItem("card-bg-color-todo-task")) {
    elementIds.forEach(applyBgColor);
  }
});
window.addEventListener("load", function() {
  let elementIds = ["for-approval-task", "yourElementId2"]; // Add IDs of all elements needing persistence
  if (localStorage.getItem("card-bg-color-todo-task")) {
    elementIds.forEach(applyBgColor);
  }
});
window.addEventListener("load", function() {
  let elementIds = ["approved-task", "yourElementId2"]; // Add IDs of all elements needing persistence
  if (localStorage.getItem("card-bg-color-todo-task")) {
    elementIds.forEach(applyBgColor);
  }
});

function makeDefault(cardId) {
  localStorage.removeItem("card-bg-color-todo-task");
  let cardBG = document.getElementById(`${cardId}`);
  cardBG.style.borderRadius = "10px";
  cardBG.style.padding = "10px";
  cardBG.style.marginBottom = "10px";
  cardBG.style.backgroundColor = "#fff";
}
// document.addEventListener("DOMContentLoaded", function () {
//   new Sortable(document.getElementById("kanban-wrapper-container"), {
//     group: "kanban-boards",
//     animation: 150,
//     handle: ".kanban-board-header", // Only allows dragging by header
//     ghostClass: "sortable-ghost",
//     onEnd: function (evt) {
//       console.log("Moved from index", evt.oldIndex, "to", evt.newIndex);
//     }
//   });
// });

// copy board
function copyBoard(element) {
  const board = element.closest(".kanban-board");
  const container = document.getElementById(
    ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
  );

  // Ask user for new board name
  let newBoardName = prompt("Enter a name for the copied board:");
  if (!newBoardName) return; // Exit if user cancels

  // Clone the board
  const clonedBoard = board.cloneNode(true);

  // Generate a unique ID for the cloned board
  const newBoardId = `board-${Date.now()}`;
  clonedBoard.setAttribute("data-id", newBoardId);
  clonedBoard.id = newBoardId;

  // Update header title
  clonedBoard.querySelector(".kanban-title-board").textContent = newBoardName;

  // Clear the task container in the cloned board
  let taskContainer = clonedBoard.querySelector(".kanban-drag");
  taskContainer.innerHTML = "";

  // Clone and update tasks
  const tasks = board.querySelectorAll(".kanban-item");
  tasks.forEach(task => {
    const clonedTask = task.cloneNode(true);
    taskContainer.appendChild(clonedTask);
  });

  // Insert the copied board right after the original
  if (board.nextElementSibling) {
    container.insertBefore(clonedBoard, board.nextElementSibling);
  } else {
    container.appendChild(clonedBoard); // If last board, add it at the end
  }

  // Save the new board to localStorage
  saveBoardToLocalStorage(newBoardId, newBoardName, taskContainer);
}

function saveBoardToLocalStorage(boardId, boardName, taskContainer) {
  const boardData = {
    id: boardId,
    title: boardName,
    tasks: Array.from(taskContainer.children).map(task => task.innerHTML)
  };

  let savedBoards = JSON.parse(localStorage.getItem("kanbanBoards")) || [];
  savedBoards.push(boardData);
  localStorage.setItem("kanbanBoards", JSON.stringify(savedBoards));
}

function loadBoardsFromLocalStorage() {
  const container = document.getElementById(
    ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
  );
  const savedBoards = JSON.parse(localStorage.getItem("kanbanBoards")) || [];

  savedBoards.forEach(boardData => {
    const board = document.createElement("div");
    board.classList.add("kanban-board");
    board.setAttribute("data-id", boardData.id);
    board.id = boardData.id;

    const header = document.createElement("header");
    header.classList.add("kanban-board-header");
    header.innerHTML = `
<div class="kanban-title-board">${boardData.title}</div>
<div class="dropdown">
    <i class="ti ti-arrows-horizontal" onclick="toggleTodo('${boardData.id}-task','${boardData.id}-header')"></i>
    <i class="dropdown-toggle ti ti-dots-vertical cursor-pointer" id="board-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
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
        <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="archiveBoard(this)">
            <i class="ti ti-archive ti-xs me-1"></i> <span class="align-middle">Archive</span>
        </a>
        <!-- Archive All Cards -->
        <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="archiveAllCards(this)">
            <i class="ti ti-archive ti-xs me-1"></i> <span class="align-middle">Archive All Cards</span>
        </a>
        <!-- Move Board -->
        <a class="dropdown-item waves-effect move-board-trigger" href="javascript:void(0)" onclick="moveBoard(this)">
            <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Move Board</span>
        </a>
        <!-- Copy Board -->
        <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="copyBoard(this)">
            <i class="ti ti-copy"></i> <span class="align-middle">Copy Board</span>
        </a>
        <!-- Sort By -->
        <div class="dropdown-submenu">
            <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                <i class="ti ti-arrows-sort ti-xs me-1"></i> <span class="align-middle">Sort by...</span>
            </a>
            <div class="dropdown-menu">
                <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="toggleTicketSortByName('${boardData.id}-task')">
                    <i class="ti ti-calendar ti-xs me-1"></i> <span class="align-middle">Sort by Name</span>
                </a>
                <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="toggleTicketSortByDate('${boardData.id}-task')">
                    <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by Date (Newest first)</span>
                </a>
                <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="toggleTicketSortByDate('${boardData.id}-task')">
                    <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by Date (Oldest first)</span>
                </a>
            </div>
        </div>
        <!-- Watch -->
        <a class="dropdown-item waves-effect" href="javascript:void(0)" onclick="watchedCard('watched-${boardData.id}-card')" id="watched-${boardData.id}-card-anchor">
            <i class="ti ti-eye ti-xs me-1"></i> <span class="align-middle">Watch</span>
        </a>
        <!-- Color Picker -->
        <div class="dropdown-item">
            <i class="ti ti-palette ti-xs"></i>
            <span class="align-middle">Card Bg</span>
            <div class="d-flex flex-wrap mt-2" style="width: 140px;">
                ${[
                  "#ff5733",
                  "#33ff57",
                  "#3357ff",
                  "#f4d03f",
                  "#8e44ad",
                  "#1abc9c",
                  "#e74c3c",
                  "#2c3e50",
                  "#d35400",
                  "#16a085",
                  "#ed0cf5",
                  "#f9fafa"
                ]
                  .map(
                    color => `
                        <div class="color-box" style="background: ${color};"
                            onclick="changeBgColor('${color}','${boardData.id}-task')">
                        </div>
                    `
                  )
                  .join("")}
            </div>
        </div>
    </div>
</div>
<!-- Add New Item Button -->
<button class="kanban-title-button btn" id="add-new-${boardData.id}">+ Add New Item</button>
`;
    board.appendChild(header);

    // Create Main Kanban Section
    const main = document.createElement("main");
    main.classList.add("kanban-drag");

    // Create Task Container
    const taskContainer = document.createElement("div");
    taskContainer.id = `${boardData.id}-task`;

    // Add "Dropped in" Message
    const contentMessage = document.createElement("div");
    contentMessage.id = `content-${boardData.id}`;
    contentMessage.textContent = `Dropped in ${boardData.title}`;
    taskContainer.appendChild(contentMessage);

    // Append Existing Tasks
    if (boardData.tasks && Array.isArray(boardData.tasks)) {
      boardData.tasks.forEach(taskHTML => {
        const task = document.createElement("div");
        task.classList.add("kanban-item");
        task.innerHTML = taskHTML;
        taskContainer.appendChild(task);
      });
    }

    // Append Task Container
    main.appendChild(taskContainer);

    // Add Form for New Items
    const newItemForm = document.createElement("form");
    newItemForm.classList.add("new-item-form");
    newItemForm.id = `add-new-${boardData.id}-form`;
    main.appendChild(newItemForm);

    // Add Backdrop
    const backdrop = document.createElement("div");
    backdrop.id = "backdrop";
    main.appendChild(backdrop);

    // Append Main Section to Board
    board.appendChild(main);
    container.appendChild(board);
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll(".move-board-trigger").forEach(button => {
    button.addEventListener("mouseenter", function() {
      showMoveBoardDropdown(this);
    });
  });
});
document.addEventListener("DOMContentLoaded", function() {
  enableDragAndDrop();
});

function enableDragAndDrop() {
  const taskContainers = document.querySelectorAll(".kanban-drag");

  taskContainers.forEach(container => {
    container.addEventListener("dragover", function(e) {
      e.preventDefault(); // Allow dropping
    });

    container.addEventListener("drop", function(e) {
      e.preventDefault();
      const draggedCard = document.querySelector(".dragging");

      if (draggedCard) {
        const oldBoard = draggedCard
          .closest(".kanban-board")
          .getAttribute("data-id");
        const newBoard = container
          .closest(".kanban-board")
          .getAttribute("data-id");

        if (oldBoard !== newBoard) {
          console.log(`Moved task from ${oldBoard} to ${newBoard}`);
        }

        // Move card visually
        container.appendChild(draggedCard);
        draggedCard.classList.remove("dragging");

        // Update the task's board ID
        draggedCard.setAttribute("data-board-id", newBoard);

        // 🔥 Save board state after task move
        saveBoardsState();
      }
    });
  });

  document.querySelectorAll(".kanban-item").forEach(card => {
    card.setAttribute("draggable", "true");

    card.addEventListener("dragstart", function() {
      this.classList.add("dragging");
    });

    card.addEventListener("dragend", function() {
      this.classList.remove("dragging");
    });
  });
}

// 🔹 Function to Copy a Board and Assign Unique Card IDs
function copyBoard(element) {
  const board = element.closest(".kanban-board");
  const container = document.getElementById(
    ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
  );

  let newBoardName = prompt("Enter a name for the copied board:");
  if (!newBoardName) return;

  const clonedBoard = board.cloneNode(true);
  const newBoardId = `board-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  clonedBoard.setAttribute("data-id", newBoardId);
  clonedBoard.id = newBoardId;

  clonedBoard.querySelector(".kanban-title-board").textContent = newBoardName;

  let taskContainer = clonedBoard.querySelector(".kanban-drag");
  taskContainer.innerHTML = "";

  const tasks = board.querySelectorAll(".kanban-item");
  let newTasks = [];
  tasks.forEach(task => {
    const clonedTask = task.cloneNode(true);
    const newTaskId = `task-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    clonedTask.setAttribute("data-id", newTaskId);
    clonedTask.id = newTaskId;
    taskContainer.appendChild(clonedTask);
    newTasks.push({ id: newTaskId, content: clonedTask.innerHTML });
  });

  if (board.nextElementSibling) {
    container.insertBefore(clonedBoard, board.nextElementSibling);
  } else {
    container.appendChild(clonedBoard);
  }

  saveBoardToLocalStorage(newBoardId, newBoardName, newTasks);
}

// 🔹 Function to Save Board State Including Unique Task IDs
function saveBoardToLocalStorage(boardId, boardName, tasks) {
  const boardData = {
    id: boardId,
    title: boardName,
    tasks: tasks
  };

  let savedBoards = JSON.parse(localStorage.getItem("kanbanBoards")) || [];
  savedBoards.push(boardData);
  localStorage.setItem("kanbanBoards", JSON.stringify(savedBoards));
}

// 🔹 Save all board states including task positions
function saveBoardsState() {
  let savedBoards = [];

  document.querySelectorAll(".kanban-board").forEach(board => {
    const boardId = board.getAttribute("data-id");
    const boardName = board.querySelector(".kanban-title-board").textContent;

    const tasks = Array.from(
      board.querySelectorAll(".kanban-item")
    ).map(task => {
      let taskId =
        task.getAttribute("data-id") ||
        `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      task.setAttribute("data-id", taskId);

      return { id: taskId, boardId: boardId, content: task.innerHTML };
    });

    savedBoards.push({ id: boardId, title: boardName, tasks });
  });

  localStorage.setItem("kanbanBoards", JSON.stringify(savedBoards));
}

// 🔹 Load boards while keeping unique task IDs and appending cards
function loadBoardsFromLocalStorage() {
  const container = document.getElementById(
    ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
  );
  let savedBoards = JSON.parse(localStorage.getItem("kanbanBoards")) || [];

  savedBoards.forEach(boardData => {
    let existingBoard = document.querySelector(
      `.kanban-board[data-id="${boardData.id}"]`
    );

    if (!existingBoard) {
      existingBoard = document.createElement("div");
      existingBoard.classList.add("kanban-board");
      existingBoard.setAttribute("data-id", boardData.id);
      existingBoard.id = boardData.id;

      const header = document.createElement("header");
      header.classList.add("kanban-board-header");
      header.innerHTML = `<div class="kanban-title-board">${boardData.title}</div>`;
      existingBoard.appendChild(header);

      const main = document.createElement("main");
      main.classList.add("kanban-drag");
      existingBoard.appendChild(main);

      container.appendChild(existingBoard);
    }

    const taskContainer = existingBoard.querySelector(".kanban-drag");

    let existingTasks = new Set(
      [...taskContainer.querySelectorAll(".kanban-item")].map(task =>
        task.getAttribute("data-id")
      )
    );

    boardData.tasks.forEach(taskData => {
      if (!existingTasks.has(taskData.id)) {
        const task = document.createElement("div");
        task.classList.add("kanban-item");
        task.setAttribute("draggable", "true");
        task.setAttribute("data-id", taskData.id);
        task.innerHTML = taskData.content;
        taskContainer.appendChild(task);
      }
    });
  });

  enableDragAndDrop();
}

// 🔹 Function to Append a Board Without Clearing Others
function appendBoardToPage(boardData, container) {
  const board = document.createElement("div");
  board.classList.add("kanban-board");
  board.setAttribute("data-id", boardData.id);
  board.id = boardData.id;

  const header = document.createElement("header");
  header.classList.add("kanban-board-header");
  header.innerHTML = `<div class="kanban-title-board">${boardData.title}</div>`;

  board.appendChild(header);

  const main = document.createElement("main");
  main.classList.add("kanban-drag");

  boardData.tasks.forEach(taskData => {
    const task = document.createElement("div");
    task.classList.add("kanban-item");
    task.setAttribute("draggable", "true");
    task.setAttribute("data-id", taskData.id);
    task.innerHTML = taskData.content;
    main.appendChild(task);
  });

  board.appendChild(main);
  container.appendChild(board);
}

function showMoveBoardDropdown(element) {
  const board = element.closest(".kanban-board");
  const container = document.getElementById(
    ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
  );
  const boards = Array.from(container.children);

  // Remove any existing dropdown before adding a new one
  document.querySelectorAll(".move-board-dropdown").forEach(el => el.remove());

  // Create a new dropdown menu dynamically
  let dropdown = document.createElement("div");
  dropdown.classList.add("dropdown-menu", "move-board-dropdown", "show");
  dropdown.style.position = "absolute";
  dropdown.style.left = "100%";
  dropdown.style.top = "0";
  dropdown.style.zIndex = "1050";
  dropdown.style.minWidth = "150px";

  // Populate dropdown with board positions
  boards.forEach((_, index) => {
    let option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.href = "javascript:void(0)";
    option.textContent = `Move to position ${index + 1}`;
    option.onclick = function() {
      moveToPosition(board, index);
      dropdown.remove(); // Remove dropdown after selection
    };
    dropdown.appendChild(option);
  });

  // Append dropdown next to the hovered element
  element.parentElement.appendChild(dropdown);

  // Hide dropdown when mouse leaves
  dropdown.addEventListener("mouseleave", function() {
    dropdown.remove();
  });
}

// Move board to selected position
function moveToPosition(board, newIndex) {
  const container = document.getElementById(
    ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
  );
  const boards = Array.from(container.children);
  boards.splice(boards.indexOf(board), 1); // Remove board from its current position

  if (newIndex >= 0 && newIndex <= boards.length) {
    container.insertBefore(board, boards[newIndex]);
  }
}

function archiveAllCards(element) {
  const board = element.closest(".kanban-board");
  if (!board) return;

  const cards = board.querySelectorAll(".kanban-item");
  cards.forEach(card => {
    archiveCard(card);
  });
}

function archiveCard(card) {
  if (!card) return;

  // Optionally, save the archived state to the backend or local storage
  const cardId = card.getAttribute("id");
  let archivedCards = JSON.parse(localStorage.getItem("archivedCards")) || [];
  archivedCards.push(cardId);
  localStorage.setItem("archivedCards", JSON.stringify(archivedCards));

  // Remove the card from the DOM
  card.remove();
}

function archiveBoard(element) {
  const board = element.closest(".kanban-board");
  if (!board) return;

  // Archive all cards within the board
  archiveAllCards(board);

  // Optionally, save the archived state to the backend or local storage
  const boardId = board.getAttribute("data-id");
  let archivedBoards = JSON.parse(localStorage.getItem("archivedBoards")) || [];
  archivedBoards.push(boardId);
  localStorage.setItem("archivedBoards", JSON.stringify(archivedBoards));

  // Remove the board from the DOM
  board.remove();
}
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".kanban-add-new-board"); // Select the form
  const parentDiv = form.parentElement; // Get its parent div

  if (parentDiv) {
    parentDiv.appendChild(form); // Move the form to the end of the div
  }
});

document.getElementById("form-show").addEventListener("click", function() {
  document
    .getElementById(ELEMENT_IDS.KANBAN_BOARD_ADD_INPUT)
    .classList.remove("d-none");
  document
    .getElementById(ELEMENT_IDS.KANBAN_BOARD_ADD_DIV)
    .classList.remove("d-none");
});

document.getElementById("form-hide").addEventListener("click", function() {
  document.getElementById("kanban-add-board-input").classList.add("d-none");
  document.getElementById("kanban-add-board-div").classList.add("d-none");
});
