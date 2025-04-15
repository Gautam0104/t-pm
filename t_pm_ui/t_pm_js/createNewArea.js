import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
const API_BASE_URL = ENV.API_BASE_URL;
var urlParams = new URLSearchParams(window.location.search);
var project_name = urlParams.get("pname");
const formShow = document.getElementById(ELEMENT_IDS.FROM_SHOW);
const formHide = document.getElementById(ELEMENT_IDS.FROM_HIDE);
const addBoardDiv = document.getElementById("kanban-add-board-div");
const addBoardInput = document.getElementById(
  ELEMENT_IDS.KANBAN_BOARD_ADD_INPUT
);
const createNewBoardForm = document.getElementById(
  ELEMENT_IDS.CREATE_NEW_BOARD
);
const copyBoardDialog = document.getElementById(
  ELEMENT_IDS.COPY_BOARD_MODAL_CONTENT
);

// Toggle form visibility
formShow.addEventListener("click", () => toggleFormVisibility(false));
formHide.addEventListener("click", () => toggleFormVisibility(true));

function toggleFormVisibility(hide) {
  addBoardDiv.classList.toggle("d-none", hide);
  addBoardInput.classList.toggle("d-none", hide);
}

// Function to create a new board
async function createBoard(boardTitle) {
  const boardName = project_name;
  if (!boardName) {
    console.error("Project name is not defined.");
    return;
  }
  if (!boardTitle.trim()) return;
  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.ADD_NEW_BOARD}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardTitle, boardName })
    });
    if (response.ok) {
      window.location.reload();
    }
  } catch (error) {
    console.error("Create board  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  }
}

// Handle board creation form submission
createNewBoardForm.addEventListener("click", async function(e) {
  e.preventDefault();
  createBoard(addBoardInput.value);
});

// Function to show Copy Board modal
function copyBoardList(cardStatus) {
  copyBoardDialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h4>Copy Board</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form id="boardNameForm">
          <div class="mb-3">
            <label for="boardName" class="form-label">Board Name</label>
            <input type="text" class="form-control" id="boardName" placeholder="Enter board name" required>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="submitBoardName('${cardStatus}')">Copy</button>
      </div>
    </div>`;
}

// Function to submit board name and copy board
async function submitBoardName(status) {
  const boardTitle = document.getElementById(ELEMENT_IDS.BOARD_NAME).value;
  if (!boardTitle.trim()) return;
  try {
    await createBoard(boardTitle);
    copyCardStatus(status, boardTitle);
  } catch (error) {
    console.error("Copy board  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  }
}

// Function to copy card status
export function copyCardStatus(status, ticketStatus) {
  let currentStatus = status;
  let newStatus = ticketStatus;
  fetch(`localhost:3000/copy-board`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentStatus, newStatus })
  })
    .then(response => response.json())
    .then(data => {
      responseElement.innerHTML = ` ${data.message}`;
      responseElement.style.color = "green";
    })
    .catch(error => {
      console.error("Copy card status  error:", error);
      res.status(500).json({
        message: "'An error occurred. Please try again later.', 'error'"
      });
    });
}

window.copyBoardList = copyBoardList;
window.submitBoardName = submitBoardName;
window.copyCardStatus = copyCardStatus;
