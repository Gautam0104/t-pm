import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
const API_BASE_URL = ENV.API_BASE_URL;
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    const container = document.getElementById(
      ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER
    );

    if (!container) {
      console.error("Kanban container not found!");
      return;
    }

    // Initialize Sortable.js with a callback for saving the order after any move
    function initializeSortable() {
      return new Sortable(container, {
        group: "kanban-boards",
        animation: 150,
        handle: ".kanban-board-header",
        ghostClass: "sortable-ghost",
        onEnd: function() {
          saveOrder(); // Save new order after drag and drop
        }
      });
    }

    // Load saved order from localStorage
    // Frontend Code
    function loadOrder() {
      fetch(`${API_BASE_URL}${API_ROUTES.GET_KANBAN_ORDER}`)
        .then(response => response.json())
        .then(data => {
          const orderArray = data.order;

          // Reorder boards based on saved order
          orderArray.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
              container.appendChild(element); // Reattach boards in the correct order
            }
          });
        })
        .catch(error => {
          console.error("Loading order  error:", error);
          res.status(500).json({
            message: "'An error occurred. Please try again later.', 'error'"
          });
        });
    }

    // Save the current board order to the server
    function saveOrder() {
      const orderArray = Array.from(container.children).map(el => el.id);
      console.log("Saving order:", orderArray); // Debugging

      fetch(`${API_BASE_URL}${API_ROUTES.SAVE_KANBAN_ORDER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ order: orderArray })
      })
        .then(response => response.json())
        .then(data => {
          console.log("Order saved successfully:", data);
        })
        .catch(error => {
          console.error("Saving order  error:", error);
          res.status(500).json({
            message: "'An error occurred. Please try again later.', 'error'"
          });
        });
    }

    // Move board to selected position and save new order
    function moveToPosition(board, newIndex) {
      const boards = Array.from(container.children);

      if (newIndex >= 0 && newIndex < boards.length) {
        container.insertBefore(board, boards[newIndex]); // Insert at specified index
      } else {
        container.appendChild(board); // Append if index is out of bounds
      }

      saveOrder(); // Save new order in localStorage
    }

    // Initialize Sortable.js
    const sortable = initializeSortable();

    // Load saved order from localStorage
    loadOrder();

    // Expose moveToPosition function globally for manual movement
    window.moveToPosition = moveToPosition;
  }, 1000);
});

/**
 * Show move board dropdown menu
 */
function showMoveBoardDropdown(element) {
  const board = element.closest(".kanban-board");
  if (!board) return;

  const boardId = board.id; // Get board ID
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
  dropdown.style.background = "#fff";
  dropdown.style.border = "1px solid #ccc";
  dropdown.style.padding = "5px";
  dropdown.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.2)";

  // Populate dropdown with board positions
  boards.forEach((_, index) => {
    let option = document.createElement("a");
    option.classList.add("dropdown-item");
    option.href = "javascript:void(0)";
    option.textContent = `Move to position ${index + 1}`;
    option.style.display = "block";
    option.style.padding = "5px";
    option.style.cursor = "pointer";
    option.onclick = function() {
      moveToPosition(board, index); // Pass the board element instead of ID
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

// Attach event listeners for dropdown triggers
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    document.querySelectorAll(".move-board-trigger").forEach(button => {
      button.addEventListener("mouseenter", function() {
        showMoveBoardDropdown(this);
      });
    });
  }, 1000);
});
