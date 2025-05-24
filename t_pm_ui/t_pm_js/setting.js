import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";

const API_BASE_URL = ENV.API_BASE_URL;

// Setting  tab

// back to edit tab
document.getElementById(ELEMENT_IDS.BACK_TO_EDIT).addEventListener('click', function () {
    var updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_SETTING).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_SHARE).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_ABOUT).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_AUTOMATION).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_POWER_UP).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_ACTIVITY).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_ARCHIVE).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_CUSTOM).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  
  document.getElementById(ELEMENT_IDS.BACK_TO_EDIT_LABEL).addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });


    // Workspace  update
  document.getElementById(ELEMENT_IDS.CHANGE_WORKSPACE_BTN).addEventListener("click", function () {
    const dropdown = document.getElementById(ELEMENT_IDS.WORKSPACE_DROPDOWN);
    const selectedText = dropdown.options[dropdown.selectedIndex].text;

    if (dropdown.selectedIndex > 0) {
      document.getElementById(ELEMENT_IDS.SELECTED_WORKSPACE_DISPLAY).textContent = selectedText;
    }
  });
   
   // comment permission update
  document.getElementById(ELEMENT_IDS.SAVE_COMMENT_PERMISSION_BTN).addEventListener("click", function () {
    const selectedRadio = document.querySelector('input[name="commentPermission"]:checked');
    if (selectedRadio) {
      document.getElementById(ELEMENT_IDS.COMMENT_PERMISSION_DISPLAY).textContent = selectedRadio.value;
    }
  });
  // Voting permission update
  document.getElementById(ELEMENT_IDS.SAVE_VOTING_PERMISSION_BTN).addEventListener("click", function () {
    const selectedVote = document.querySelector('input[name="votingPermission"]:checked');
    if (selectedVote) {
      document.getElementById(ELEMENT_IDS.VOTING_PERMISSION_DISPLAY).textContent = selectedVote.value;
    }
  });

  // Add/Remove member permission update
  document.getElementById(ELEMENT_IDS.SAVE_ADD_PERMISSION_BTN).addEventListener("click", function () {
    const selectedAdd = document.querySelector('input[name="addPermission"]:checked');
    if (selectedAdd) {
      document.getElementById(ELEMENT_IDS.ADD_REMOVE_PERMISSION_DISPLAY).textContent = selectedAdd.value;
    }
  });

  // Utility function to get selected radio value
  function getSelectedRadio(name) {
    const radios = document.getElementsByName(name);
    for (const radio of radios) {
      if (radio.checked) return radio.value;
    }
    return null;
  }
// Collect and send data
async function postPermissionsData() {
  const permissions = {
    commenting: getSelectedRadio("commentPermission"),
    voting: getSelectedRadio("votingPermission"),
    memberControl: getSelectedRadio("addPermission"),
    workspaceEditing: document.getElementById(ELEMENT_IDS.WORKSPACE_EDITING_ADMINS).checked,
    cardCovers: document.getElementById(ELEMENT_IDS.CARD_COVER_CHECKBOX).checked,
    completeCard: document.getElementById(ELEMENT_IDS.COMPLETE_CARD_CHECKBOX).checked
  };

  try {
    // PUT request for updating permissions
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.SETTINGS}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permissions),
    });

    if (!response.ok) {
      throw new Error("Failed to update permissions");
    }

    const data = await response.json();
  } catch (error) {
    console.error("Error updating permissions:", error);
  }
}

// Bind function to button(s) and checkboxes
document.getElementById(ELEMENT_IDS.SAVE_COMMENT_PERMISSION_BTN).addEventListener("click", postPermissionsData);
document.getElementById(ELEMENT_IDS.SAVE_VOTING_PERMISSION_BTN).addEventListener("click", postPermissionsData);
document.getElementById(ELEMENT_IDS.SAVE_ADD_PERMISSION_BTN).addEventListener("click", postPermissionsData);
document.getElementById(ELEMENT_IDS.WORKSPACE_EDITING_ADMINS).addEventListener("change", postPermissionsData);
document.getElementById(ELEMENT_IDS.CARD_COVER_CHECKBOX).addEventListener("change", postPermissionsData);
document.getElementById(ELEMENT_IDS.COMPLETE_CARD_CHECKBOX).addEventListener("change", postPermissionsData);

//Function to fetch and update settings dynamically
async function fetchAndUpdateSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.SETTINGS}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    const settings = await response.json();

    // Safely update UI elements dynamically
    const commentRadio = document.querySelector(`input[name="commentPermission"][value="${settings.commenting}"]`);
    if (commentRadio) commentRadio.checked = true;

    const votingRadio = document.querySelector(`input[name="votingPermission"][value="${settings.voting}"]`);
    if (votingRadio) votingRadio.checked = true;

    const addPermissionRadio = document.querySelector(`input[name="addPermission"][value="${settings.memberControl}"]`);
    if (addPermissionRadio) addPermissionRadio.checked = true;

    const workspaceEditingCheckbox = document.getElementById(ELEMENT_IDS.WORKSPACE_EDITING_ADMINS);
    if (workspaceEditingCheckbox) workspaceEditingCheckbox.checked = settings.workspace_editing === 1;

    const cardCoversCheckbox = document.getElementById(ELEMENT_IDS.CARD_COVER_CHECKBOX);
    if (cardCoversCheckbox) cardCoversCheckbox.checked = settings.card_covers === 1;

    const completeCardCheckbox = document.getElementById(ELEMENT_IDS.COMPLETE_CARD_CHECKBOX);
    if (completeCardCheckbox) completeCardCheckbox.checked = settings.complete_card ===1;

    // Safely update display elements
    const commentDisplay = document.getElementById(ELEMENT_IDS.COMMENT_PERMISSION_DISPLAY);
    if (commentDisplay) commentDisplay.textContent = settings.commenting;

    const votingDisplay = document.getElementById(ELEMENT_IDS.VOTING_PERMISSION_DISPLAY);
    if (votingDisplay) votingDisplay.textContent = settings.voting;

    const addRemoveDisplay = document.getElementById(ELEMENT_IDS.ADD_REMOVE_PERMISSION_DISPLAY);
    if (addRemoveDisplay) addRemoveDisplay.textContent = settings.memberControl;

  } catch (error) {
    console.error("Error fetching settings:", error);
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", fetchAndUpdateSettings);

// setting project name dropdown

document.addEventListener("DOMContentLoaded", function () {
  const workspaceDropdown = document.getElementById(ELEMENT_IDS.WORKSPACE_DROPDOWN);
  const selectedWorkspaceDisplay = document.getElementById(ELEMENT_IDS.SELECTED_WORKSPACE_DISPLAY);
  const changeWorkspaceBtn = document.getElementById(ELEMENT_IDS.CHANGE_WORKSPACE_BTN);

  // Get the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get("pname"); // Get the 'pname' parameter

  // Fetch workspaces from an API
  fetch(`${API_BASE_URL}${API_ROUTES.PROJECT_DATA}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }
      return response.json();
    })
    .then(data => {
      // Populate the dropdown with projects
      data.forEach(project => {
        const option = document.createElement("option");
        option.value = project.project_id;
        option.textContent = project.project_name;

        // Pre-select the option if it matches the 'pname' parameter
        if (project.project_name === projectName) {
          option.selected = true;
          selectedWorkspaceDisplay.textContent = project.project_name; 
        }

        workspaceDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error loading workspaces:", error);
    });

  workspaceDropdown.addEventListener("change", function () {
    const selectedOption = workspaceDropdown.options[workspaceDropdown.selectedIndex];
    selectedWorkspaceDisplay.textContent = selectedOption.textContent;
  });

  // Redirect to the selected project's page on button click
  changeWorkspaceBtn.addEventListener("click", function () {
    const selectedOption = workspaceDropdown.options[workspaceDropdown.selectedIndex];
    if (selectedOption && selectedOption.value !== "Select") {
      // Get the current URL parameters
      const urlParams = new URLSearchParams(window.location.search);

      // Update the pname parameter with the selected project name
      urlParams.set("pname", selectedOption.textContent);

      // Update the id parameter with the selected project ID
      urlParams.set("id", selectedOption.value);

      // Redirect to the updated URL
      window.location.href = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    } else {
      console.error("No project selected");
    }
  });
});


// Unarchive tab
  document.addEventListener("DOMContentLoaded", function () {
    const archivedCardsContainer = document.getElementById(ELEMENT_IDS.ARCHIVE_CARD_CONTAINER);

    async function fetchArchivedCards() {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.ARCHIVED_CARDS}`, {  
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch archived cards");
        }

        const archivedCards = await response.json();

        // Clear the container
        archivedCardsContainer.innerHTML = "";

        // Render each archived card
        archivedCards.forEach(card => {
          const cardElement = document.createElement("div");
          cardElement.classList.add("card", "mb-3", "p-3", "shadow-sm");
          cardElement.innerHTML = `
        <img src="${card.images}" class="img-fluid rounded mb-2" style="max-height: 150px; object-fit: cover;">
        <h6>${card.title}</h6>
        <p>${card.description || "No description available"}</p>
        <button class="btn btn-sm btn-primary" onclick="restoreCard('${card.card_id}')">Restore</button>
      `;
          archivedCardsContainer.appendChild(cardElement);
        });
      } catch (error) {
        console.error("Error fetching archived cards:", error);
        archivedCardsContainer.innerHTML = "<p class='text-danger'>Failed to load archived cards.</p>";
      }
    }

    // Restore a card
    window.restoreCard = async function (cardId) {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.RESTORE_CARD}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cardId }),
        });

        if (!response.ok) {
          throw new Error("Failed to restore card");
        }

        console.log(`Card ${cardId} restored successfully`);
        fetchArchivedCards(); // Refresh the archived cards list
      } catch (error) {
        console.error("Error restoring card:", error);
      }
    }

    // Fetch archived cards when the tab is shown
    document.querySelector('[data-bs-target="#tab-archived"]').addEventListener("shown.bs.tab", fetchArchivedCards);
  });


  // archive list
  document.addEventListener("DOMContentLoaded", function () {
    const archivedBoardsContainer = document.getElementById(ELEMENT_IDS.ARCHIVE_BOARD_CONTAINER);
  
    async function fetchArchivedBoards() {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.ARCHIVED_BOARD}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch archived boards");
  
        const archivedBoards = await response.json();
        archivedBoardsContainer.innerHTML = "";
  
        archivedBoards.forEach(board => {
          const boardElement = document.createElement("div");
          boardElement.classList.add("card", "mb-3", "p-3", "shadow-sm");
          boardElement.innerHTML = `
            <h6>${board.board_id}</h6>
            <p>Project Name: ${board.project_name}</p>
            <button class="btn btn-sm btn-primary" onclick="restoreBoard('${board.board_id}', '${board.project_id}')">Restore</button>
          `;
          archivedBoardsContainer.appendChild(boardElement);
        });
      } catch (error) {
        console.error("Error fetching archived boards:", error);
        archivedBoardsContainer.innerHTML = "<p class='text-danger'>Failed to load archived boards.</p>";
      }
    }
  
    // Restore Board Function
    window.restoreBoard = async function (boardId, projectId) {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ROUTES.RESTORE_BOARD}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ boardId, projectId }),
        });
  
        if (!response.ok) throw new Error("Failed to restore board");
  
        console.log(`Board ${boardId} restored successfully`);
        fetchArchivedBoards();
      } catch (error) {
        console.error("Error restoring board:", error);
      }
    }
  
    // Load when archived boards tab is shown
    document.querySelector('#archived-boards-tab').addEventListener("shown.bs.tab", fetchArchivedBoards);
  });
  

  // Share tab
  
  document.addEventListener("DOMContentLoaded", function () {
    // Set the current URL to the board link input
    const boardLinkInput = document.getElementById(ELEMENT_IDS.BOARD_LINK);
    boardLinkInput.value = window.location.href;

    // Attach event listeners
    const qrBtn = document.getElementById(ELEMENT_IDS.QR_BTN);
    const exportJSONBtn = document.getElementById(ELEMENT_IDS.EXPORT_JSON_BTN);
    const exportCSVBtn = document.getElementById(ELEMENT_IDS.EXPORT_CSV_BTN);
    const copyLinkBtn = document.getElementById(ELEMENT_IDS.COPY_LINK_BTN);

    if (qrBtn) qrBtn.addEventListener("click", showQRCode);
    if (exportJSONBtn) exportJSONBtn.addEventListener("click", exportJSON);
    if (exportCSVBtn) exportCSVBtn.addEventListener("click", exportCSV);
    if (copyLinkBtn) copyLinkBtn.addEventListener("click", copyBoardLink);
  });
  document.getElementById(ELEMENT_IDS.PRINT_BTN).addEventListener("click", function () {
    window.print();
  });
  // Copy link to clipboard
  function copyBoardLink() {
    const input = document.getElementById(ELEMENT_IDS.BOARD_LINK);
    navigator.clipboard.writeText(input.value)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Link copied!',
        text: 'The board link has been copied to clipboard.',
        timer: 1500,
        showConfirmButton: false
      });
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Failed to copy the link.',
      });
    });
}

  // Export CSV data
  async function exportCSV() {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.GET_TICKETS}`); GET_TICKETS
      const data = await response.json();

      if (!Array.isArray(data)) data = [data]; 

      const keys = Object.keys(data[0]);
      const csvRows = [keys.join(",")];

      data.forEach(item => {
        const values = keys.map(k => `"${(item[k] ?? "").toString().replace(/"/g, '""')}"`);
        csvRows.push(values.join(","));
      });

      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);

      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "board_data.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
     
      console.error(error);
    }
  }

  async function exportJSON() {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.GET_TICKETS}`);
      const data = await response.json();

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", dataStr);
      link.setAttribute("download", "board_data.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      
      console.error(error);
    }
  }

  // Show QR Code in a modal
  function showQRCode() {
    const modal = new bootstrap.Modal(document.getElementById(ELEMENT_IDS.QR_MODAL));
    const qrContainer = document.getElementById(ELEMENT_IDS.QR_CODE_CONTAINER);
    qrContainer.innerHTML = ""; // Clear previous QR
    new QRCode(qrContainer, {
      text: document.getElementById(ELEMENT_IDS.BOARD_LINK).value,
      width: 200,
      height: 200,
    });
    modal.show();
  }

  function applyCollapseState(collapsed) {
    const cards = document.querySelectorAll(".kanban-item");
    const buttonText = document.querySelector('[data-action="collapse-cards"] span');
  
    if (collapsed) {
      cards.forEach(card => (card.style.display = "none"));
      if (buttonText) buttonText.textContent = "Open all the lists";
    } else {
      cards.forEach(card => (card.style.display = "block"));
      if (buttonText) buttonText.textContent = "Collapse all the lists";
    }
    localStorage.setItem("kanbanCardsCollapsed", collapsed ? "true" : "false");
    // console.log("Collapse state saved to localStorage:", localStorage.getItem("kanbanCardsCollapsed"));
  }
  
  document.querySelector('[data-action="collapse-cards"]').addEventListener("click", function () {
    const cards = document.querySelectorAll(".kanban-item");
    const areCardsCollapsed = Array.from(cards).every(card => card.style.display === "none");
    
    applyCollapseState(!areCardsCollapsed);
  });
  
  // On page load, restore collapse state after a delay to ensure cards are loaded
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      const collapsed = localStorage.getItem("kanbanCardsCollapsed") === "true";
      applyCollapseState(collapsed);
    }, 3000); 
  });
 

  // activity tab
  document.addEventListener("DOMContentLoaded", function () {
    const commentTab = document.getElementById(ELEMENT_IDS.ACTIVITY_COMMENT_CONTAINER);
  
  
    fetch(`${API_BASE_URL}${API_ROUTES.GET_COMMENT}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        data.forEach(comment => {
          const isoDate = `${comment.changed_at}`;
          const date = new Date(isoDate);
          const formattedDate = date.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          });
  
          const commentContent = `
            <div class="media mb-4 d-flex align-items-center">
              <div class="avatar me-3 flex-shrink-0">
                <span class="avatar-initial bg-label-success rounded-circle">
                  ${comment.changed_by[0] + comment.changed_by[1]}
                </span>
              </div>
              <div class="media-body">
                <p class="mb-0">${comment.change_description}</p>
                <small class="text-muted">${formattedDate}</small>
                <p class="mb-0">${comment.title}</p>
              </div>
            </div>
          `;
  
          commentTab.innerHTML += commentContent;
        });
      })
      .catch(error => {
        console.error("Error fetching comments:", error);
      });
  });

// Get the project ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id'); 
 
  const fetchCustomFields = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/custom-field/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch custom fields');
      return await response.json();
    } catch (error) {
      console.error("Error fetching custom fields:", error);
      return []; // fallback to empty if error
    }
  };

  const renderCustomFields = async () => {
    const container = document.getElementById(ELEMENT_IDS.CUSTOM_FIELD_CONTENT);
    container.innerHTML = ""; // Clear previous content
  
    const fields = await fetchCustomFields();
  
    fields.forEach(field => {
      const wrapper = document.createElement("div");
      wrapper.className = "border rounded p-3 mb-3";
  
      const title = document.createElement("div");
      title.className = "fw-bold mb-2";
      title.innerHTML = `${field.name} <span class="text-muted">(${field.type})</span>`;
      wrapper.appendChild(title);
  
      // If dropdown, show options as color badges
      if (field.type === "dropdown" && Array.isArray(field.options)) {
        const optionsContainer = document.createElement("div");
        optionsContainer.className = "mb-2";
  
        field.options.forEach(opt => {
          const badge = document.createElement("span");
          badge.className = "badge me-1 mb-1";
          badge.textContent = opt.label;
          badge.style.backgroundColor = opt.color;
          badge.style.color = "#fff";
          badge.style.padding = "5px 10px";
          badge.style.borderRadius = "5px";
          badge.style.fontSize = "0.8rem";
          optionsContainer.appendChild(badge);
        });
  
        wrapper.appendChild(optionsContainer);
      }
  
      // Buttons container
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "mt-2";
  
      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-outline-danger btn-sm";
      deleteButton.textContent = "Delete";
  
      
      buttonsContainer.appendChild(deleteButton);
  
      wrapper.appendChild(buttonsContainer);
  
      container.appendChild(wrapper);
    });
  
    // Add "Add New Custom Field" button at the bottom
    const addButton = document.createElement("button");
    addButton.className = "btn btn-outline-secondary w-100 mt-3";
    addButton.textContent = "Add New Custom Field";
    container.appendChild(addButton);
  };
  

  // Call this when the tab is shown or page is ready
  document.addEventListener("DOMContentLoaded", renderCustomFields);


  // Rendering automation rules

  document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById(ELEMENT_IDS.AUTOMATION_BUTTON);
    
    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES. AUTOMATION_DATA}`); 
      const data = await response.json();

      container.innerHTML = ''; 

      data.forEach(rule => {
        const cardHTML = `
          <div class="card mb-3 shadow-sm">
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
              <div>
                <h6 class="mb-1 fw-semibold">${rule.button_title}</h6>
                <small class="text-muted">Ticket Title: ${rule.ticket_title}</small>
              </div>
              <div class="mt-3 mt-md-0 d-flex gap-2 flex-wrap">
                <button class="btn btn-outline-danger btn-sm" onclick="deleteAutomation(${rule.id})">Delete</button>
              </div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
      });
    } catch (error) {
      console.error('Error fetching automation buttons:', error);
      container.innerHTML = `<div class="alert alert-danger">Failed to load automation rules.</div>`;
    }
  });

  
  async function deleteAutomation(id) {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        // Adjust z-index dynamically
        const swalModal = document.querySelector('.swal2-container');
        if (swalModal) {
          swalModal.style.zIndex = '2000'; // Set a higher z-index
        }
      }
    });
  
    if (confirmation.isConfirmed) {
      try {
        const response = await fetch(`/automation-data/${id}`, {
          method: 'DELETE',
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error || 'Failed to delete automation');
        }
  
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Automation deleted successfully!',
          timer: 1500,
          showConfirmButton: false,
        });
  
        const card = document.getElementById(`automation-card-${id}`);
        if (card) card.remove();
      } catch (error) {
        console.error('Delete error:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error deleting automation.',
        });
      }
    }
  }

  // Setting Watch Icon

  
  // Function to update the watch icon based on the watch status
  async function updateWatchIcon() {
    const watchLink = document.getElementById(ELEMENT_IDS.WATCH_ICON);
    const watchTabText = document.getElementById(ELEMENT_IDS.WATCH_TAB_TEXT);
    const watchTabButton = document.getElementById(ELEMENT_IDS.WATCH_TAB_BUTTON);
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (!projectId || !watchLink) {
      console.error('Missing project ID or DOM elements.');
      return;
    }
  
    // try {
    //   const response = await fetch(`${API_BASE_URL}/watch-boards-project/${projectId}`); 
      
      
  
    //   if (!response.ok) {
        
    //     return; // Exit silently without logging anything
    //   }
    //   const result = await response.json();
    //   const isWatched = Array.isArray(result) && result.some(item => item.project_id == projectId); 
    //   if (isWatched) {
    //     if (!watchLink.querySelector('.ti-eye')) {
    //       const eyeIcon = document.createElement('i');
    //       eyeIcon.className = 'ti ti-eye rounded-circle ti-md';
    //       watchLink.appendChild(eyeIcon);
    //     }
        
    //     watchTabText.textContent = 'Unwatch';
    //     watchTabButton.classList.remove('btn-outline-primary');
    //     watchTabButton.classList.add('btn-outline-primary');
    //   } else {
    //     const existingIcon = watchLink.querySelector('.ti-eye');
    //     if (existingIcon) existingIcon.remove();
  
    //     watchTabText.textContent = 'Watch';
    //     watchTabButton.classList.remove('btn-outline-primary');
    //     watchTabButton.classList.add('btn-outline-primary');
    //   }
    // } catch (error) {
    //   // Suppress errors and exit gracefully
    // }
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(updateWatchIcon, 2000); 
  });
  
  document.getElementById(ELEMENT_IDS. WATCH_TAB_BUTTON).addEventListener('click', async function () {
    const watchLink = document.getElementById(ELEMENT_IDS.WATCH_ICON);
    const watchTabText = document.getElementById(ELEMENT_IDS.WATCH_TAB_TEXT);
    const watchTabButton = document.getElementById(ELEMENT_IDS. WATCH_TAB_BUTTON);
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    const projectName = urlParams.get('pname');
  
    if (!projectId || !projectName) {
      console.error('Missing project ID or project name.');
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.WATCH_BOARDS_PROJECT}/${projectId}`);
      let isWatched = false;
  
      if (response.ok) {
        const result = await response.json();
        isWatched = Array.isArray(result) && result.some(item => item.project_id == projectId); 
      }
  
      if (!isWatched) {
        const postRes = await fetch(`${API_BASE_URL}${API_ROUTES.WATCH_BOARDS}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: projectName,
            ticket_id: null,
            project_id: projectId
          })
        });
  
        if (!postRes.ok) throw new Error('Failed to create watch');
  
        if (!watchLink.querySelector('.ti-eye')) {
          const eyeIcon = document.createElement('i');
          eyeIcon.className = 'ti ti-eye rounded-circle ti-md';
          watchLink.appendChild(eyeIcon);
        }
        iconElement.className = 'fa fa-eye-slash fa-lg';
        watchTabText.textContent = 'Unwatch';
        watchTabButton.classList.remove('btn-outline-primary');
        watchTabButton.classList.add('btn-outline-primary');
      } else {
        const deleteRes = await fetch(`${API_BASE_URL}${API_ROUTES.WATCH_BOARDS_PROJECT}/${projectId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
  
        if (!deleteRes.ok) throw new Error('Failed to delete watch');
  
        const existingIcon = watchLink.querySelector('.ti-eye');
        if (existingIcon) existingIcon.remove();
  
        watchTabText.textContent = 'Watch';
        watchTabButton.classList.remove('btn-outline-primary');
        watchTabButton.classList.add('btn-outline-primary');
      }
    } catch (error) {
      console.error('Error processing watch toggle:', error);
    }
  });
  
 
  document.addEventListener('DOMContentLoaded', updateWatchIcon);
  

// user settings tab

                            (async function () {
                              try {
                                
                                const userActivityTab = document.getElementById(ELEMENT_IDS.USER_ACTIVITY_TAB);
                                const ticketList = document.getElementById(ELEMENT_IDS.CARD_TABLE_BODY);

                                if (!userActivityTab || !ticketList) {
                                  console.warn("Required DOM elements not found.");
                                  return;
                                }

                                // Function to fetch and render user activity
                                const fetchUserActivity = async () => {
                                  const response = await fetch(`${API_BASE_URL}/get-user-activity/Thunder`);
                                  if (!response.ok) throw new Error("User activity fetch failed: " + response.statusText);

                                  const data = await response.json();
                                  data.forEach(comment => {
                                    const date = new Date(comment.changed_at);
                                    const formattedDate = date.toLocaleString("en-US", {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit"
                                    });

                                    const initials = (comment.changed_by || "")
                                      .split(" ")
                                      .map(word => word[0])
                                      .filter(Boolean)
                                      .join("")
                                      .substring(0, 2)
                                      .toUpperCase();

                                    const userActivityContent = `
                                      <div class="media mb-4 d-flex align-items-center text-start">
                                        <div class="avatar me-3 flex-shrink-0">
                                          <span class="avatar-initial bg-label-success rounded-circle">${initials}</span>
                                        </div>
                                        <div class="media-body">
                                          <p class="mb-0">${comment.change_description}</p>
                                          <small class="text-muted">${formattedDate}</small>
                                        </div>
                                      </div>
                                    `;
                                    userActivityTab.insertAdjacentHTML("beforeend", userActivityContent);
                                  });
                                };

                                // Function to fetch and render tickets
                                const fetchUserTickets = async () => {
                                  const response = await fetch(`${API_BASE_URL}/ticket-by-user/12`);
                                  if (!response.ok) throw new Error("Tickets fetch failed: " + response.statusText);

                                  const data = await response.json();
                                  data.forEach(ticket => {
                                    const ticketItem = `
                                      <tr>
                                        <td>${ticket.title}</td>
                                        <td>Todo</td>
                                        <td></td>
                                        <td></td>
                                        <td>Project and tickets</td>
                                      </tr>
                                    `;
                                    ticketList.insertAdjacentHTML("beforeend", ticketItem);
                                  });
                                };

                                // Call both functions
                                await fetchUserActivity();
                                await fetchUserTickets();

                              } catch (error) {
                                console.error("Error:", error);
                              }
                            })();
                          



  
  window.deleteAutomation = deleteAutomation;
 
  
  



  