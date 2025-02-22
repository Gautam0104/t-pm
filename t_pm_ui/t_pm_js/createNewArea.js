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

async function submitBoardName() {
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
        const response = await fetch(`${API_BASE_URL}/copy-row/473`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ticketStatus
          })
        });
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
