import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";

const API_BASE_URL = ENV.API_BASE_URL;
export function loadMirrorModal(ticketId) {
  const boardSelect = document.getElementById(ELEMENT_IDS.MIRROR_BOARD_SELECT);
  const listSelect = document.getElementById(ELEMENT_IDS.MIRROR_LIST_SELECT);
  const mirrorBtn = document.getElementById(ELEMENT_IDS.MIRROR_BTN);

  // Fetch boards from API
  function loadBoards() {
    fetch(`${API_BASE_URL}${API_ROUTES.PROJECT_DATA}`)
      .then(response => response.json())
      .then(data => {
        boardSelect.innerHTML = ""; // Clear loading text
        data.forEach(board => {
          const option = document.createElement("option");
          option.value = board.project_id;
          option.textContent = board.project_name;
          boardSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error fetching boards:", error);
        boardSelect.innerHTML =
          "<option disabled>Error loading boards</option>";
      });
  }

  // Fetch lists when a board is selected
  function loadLists(boardName) {
    listSelect.innerHTML = "<option disabled>Loading...</option>";

    fetch(`${API_BASE_URL}${API_ROUTES.GET_BOARDS}/?board_name=${boardName}`)
      .then(response => response.json())
      .then(data => {
        listSelect.innerHTML = "";
        data.forEach(list => {
          const option = document.createElement("option");
          option.value = list.board_id;
          option.textContent = list.board_title;
          listSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error("Error fetching lists:", error);
        listSelect.innerHTML = "<option disabled>Error loading lists</option>";
      });
  }

  // Event listener for board selection change
  boardSelect.addEventListener("change", () => {
    const boardName =
      boardSelect.options[boardSelect.selectedIndex].textContent;
    loadLists(boardName);
  });

  // Mirror button click (Handle submission)
  mirrorBtn.addEventListener("click", () => {
    const selectedBoard = boardSelect.value;
    const selectedList =
      listSelect.options[listSelect.selectedIndex].textContent;
    const position = document.getElementById("positionInput").value;

    if (!selectedBoard || !selectedList) {
      alert("Please select a board and list.");
      return;
    }

    const mirrorData = {
      new_project_id: selectedBoard,
      new_ticket_status: selectedList
      //position: parseInt(position)
    };

    fetch(`${API_BASE_URL}${API_ROUTES.TICKETS_MIRRORING}/${ticketId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mirrorData)
    })
      .then(response => response.json())
      .then(result => {
        console.log("Mirror card created:", result);
      })
      .catch(error => {
        console.error("Error creating mirror card:", error);
      });
  });

  // Load boards on modal open
  loadBoards();
}
