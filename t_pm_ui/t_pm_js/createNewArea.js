const addBoardInput = document.getElementById("kanban-add-board-input");
const addBoardDiv = document.getElementById("kanban-add-board-div");
const formShow = document.getElementById("form-show");
const formHide = document.getElementById("form-hide");

formShow.addEventListener("click", function() {
  addBoardDiv.classList.remove("d-none");
  addBoardInput.classList.remove("d-none");
});
formHide.addEventListener("click", function() {
  addBoardDiv.classList.add("d-none");
  addBoardInput.classList.add("d-none");
});

const createnewAreForm = document.getElementById("create-new-board");

const createBoard = async () => {
  const boardTitle = document.getElementById("kanban-add-board-input").value;

  try {
    const response = await fetch(`${API_BASE_URL}/addnewboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardTitle
      })
    });
    if (response.ok) {
      console.log("new board added  successfully");
      window.location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
};
createnewAreForm.addEventListener("click", async function(e) {
  e.preventDefault();
  const boardTitle = document.getElementById("kanban-add-board-input").value;

  try {
    const response = await fetch(`${API_BASE_URL}/addnewboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardTitle
      })
    });
    if (response.ok) {
      console.log("new board added  successfully");
      window.location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
});

function CopyBardlist(cardStatus) {
  const copyBoarddialog = document.getElementById("copy-board-modal-content");
  copyBoarddialog.innerHTML = `<div class="modal-content">
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

async function submitBoardName(status) {
  const boardTitle = document.getElementById("boardName").value;

  try {
    const response = await fetch(`${API_BASE_URL}/addnewboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        boardTitle
      })
    });
    if (response.ok) {
      console.log("new board added  successfully");
      const ticketStatus = document.getElementById("boardName").value;
      try {
        const response = await fetch(
          `${API_BASE_URL}/copy-row/status/${status}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ticketStatus
            })
          }
        );
        if (response.ok) {
          console.log("card copied successfully");
        }
      } catch (error) {
        console.log("error", error);
      }
      window.location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
}
