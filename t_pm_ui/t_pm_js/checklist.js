document.addEventListener("DOMContentLoaded", function() {
setTimeout(function(){
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
},1000)
});

const createChecklist = async (ticketId, ticketTitle) => {
  const checkList = document.getElementById("checklist-name").value;

  console.log("Creating checklist for:", checkList, ticketId, ticketTitle);

  try {
    const response = await fetch(`${API_BASE_URL}/create-checklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ticketId,
        checkList,
        ticketTitle
      })
    });
    if (response.ok) {
      console.log("Checklist created successfully");
    } else {
      console.error("Failed to create checklist:", response.status);
    }
  } catch (error) {
    console.error("Error creating checklist:", error);
  }
};

const DEBUG_MODE = false; // Change to false to disable console logs

const getChecklist = async (ticket_id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-checklist/${ticket_id}`);

    if (response.status === 404) {
      // Silently handle 404s to avoid console errors
      if (DEBUG_MODE) console.log(`No checklist found for ticket ID: ${ticket_id}`);
      return; // Exit the function
    }

    if (!response.ok) {
      if (DEBUG_MODE) console.error("Failed to fetch checklist:", response.status);
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const data = await response.json();
    if (DEBUG_MODE) console.log("Fetched checklist data:", data);

    const headerTitle = document.getElementById("modal-header-title");
    const checklisTitle = document.getElementById("checklist-title");
    const checklistContainer = document.getElementById(`checklist-container-${ticket_id}`);

    if (checklistContainer) {
      checklistContainer.innerHTML = ""; // Clear previous content
      const itemLength = data.length;
      data.map(item => {
        const checklistContent = `
          <div class="d-flex mt-2" id="checklist-box" draggable="false" style="cursor:pointer" onclick="checklistModal(event)" data-bs-toggle="modal" data-bs-target="#checklistModal">
            <i class="ti ti-checkbox me-1"></i>
            <span>0/${itemLength}</span>
          </div>`;
        checklistContainer.innerHTML += checklistContent;
      });
      checklisTitle.innerHTML = `<span>${data[0]?.checklist || 'No checklist found'}</span>`;
      headerTitle.innerHTML = `<h5 class="modal-title" id="exampleModalLabel1">${data[0]?.ticket_title || 'No title'}</h5>`;
    } else {
      if (DEBUG_MODE) console.error(`Element not found: checklist-container-${ticket_id}`);
    }
  } catch (error) {
    if (DEBUG_MODE) console.error("Error fetching checklist:", error);
  }
};

// Fetch all tickets and get checklists for each one
setTimeout(() => {
  fetch(`${API_BASE_URL}/tickets`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      data.map(item => {
        getChecklist(item.ticket_id);
      });
    })
    .catch(error => {
      if (DEBUG_MODE) console.error("Error fetching tickets:", error);
    });
}, 1000);

function checklistModal(event) {
  event.stopPropagation(); // Prevents the event from bubbling up
}
