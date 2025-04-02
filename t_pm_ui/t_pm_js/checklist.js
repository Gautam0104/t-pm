import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
const API_BASE_URL = ENV.API_BASE_URL;
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    const checkbox = document.querySelector(".form-check-input");
    const progressBar = document.querySelector(".progress-bar");
    const checklistTitle = document.querySelector("#checklist-title");
    const progressText = document.querySelector(".col-1 span"); // Selecting the span showing progress percentage

    if (checkbox) {
      checkbox.addEventListener("change", function() {
        if (this.checked) {
          animateProgress(0, 100);
          progressBar.style.width = "100%";
          progressBar.setAttribute("aria-valuenow", "100");
          checklistTitle.style.textDecoration = "line-through";
        } else {
          animateProgress(100, 0);
          progressBar.style.width = "0%";
          progressBar.setAttribute("aria-valuenow", "0");
          checklistTitle.style.textDecoration = "none";
        }
      });
    }

    function animateProgress(start, end) {
      let current = start;
      const step = start < end ? 1 : -1; // Determines the increment or decrement direction
      const interval = setInterval(() => {
        current += step;
        progressText.textContent = `${current}%`;
        if (current === end) {
          clearInterval(interval);
        }
      }, 5); // Smooth transition effect
    }
  }, 1000);
});

const createChecklist = async (ticketId, ticketTitle) => {
  const checkList = document.getElementById(ELEMENT_IDS.CHECKLIST_NAME).value;

  console.log("Creating checklist for:", checkList, ticketId, ticketTitle);

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.CREATE_CHECKLIST}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticketId,
          checkList,
          ticketTitle
        })
      }
    );
    if (response.ok) {
      console.log("Checklist created successfully");
      location.reload();
    } else {
      console.error("Failed to create checklist:", response.status);
    }
  } catch (error) {
    console.error("Error creating checklist:", error);
  }
};

const DEBUG_MODE = false; // Change to false to disable console logs

export const getChecklist = async ticket_id => {
  try {
    // Attempt to fetch the checklist
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.GET_CHECKLIST}/${ticket_id}`
    );

    if (response.status === 404) {
      // Handle 404 gracefully: No checklist found, return null
      if (DEBUG_MODE)
        console.log(`No checklist found for ticket ID: ${ticket_id}`);
      return null; // Avoid further processing
    }

    if (!response.ok) {
      // Handle network errors other than 404 (like 500)
      if (DEBUG_MODE)
        console.error(`Failed to fetch checklist. Status: ${response.status}`);
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      );
    }

    const data = await response.json();

    if (DEBUG_MODE) console.log("Fetched checklist data:", data);

    const checklistContainer = document.getElementById(
      `checklist-container-${ticket_id}`
    );
    if (checklistContainer) {
      checklistContainer.innerHTML = ""; // Clear previous content
      data.forEach(item => {
        const checklistContent = `
          <div class="d-flex mt-2" id="checklist-box" draggable="false" style="cursor:pointer" 
               onclick="checklistModal(event)" data-bs-toggle="modal" data-bs-target="#checklistModal">
            <i class="ti ti-checkbox me-1"></i>
            <span>0/${data.length}</span>
          </div>`;
        checklistContainer.innerHTML += checklistContent;
      });
    }
  } catch (error) {
    // Handle errors silently or log them based on DEBUG_MODE
    if (DEBUG_MODE)
      console.error("Error fetching checklist:", error.message || error);
    return null;
  }
};

// Fetch all tickets and get checklists for each one
setTimeout(() => {
  fetch(`${API_BASE_URL}${API_ROUTES.GET_CHECKLISTS}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        getChecklist(item.ticket_id);
      });
    })
    .catch(error => {
      console.error("Error fetching checklists:", error);
    });
}, 1000);

function checklistModal(event) {
  event.stopPropagation(); // Prevents the event from bubbling up
}

window.createChecklist = createChecklist;
window.checklistModal = checklistModal;
window.getChdecklist = getChecklist;
