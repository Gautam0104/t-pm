import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";

const API_BASE_URL = ENV.API_BASE_URL;

// Setting  tab

// back to edit tab
document.getElementById('back-to-edit').addEventListener('click', function () {
    var updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById('back-to-edit-settings').addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById('back-to-edit-share').addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById('back-to-edit-about').addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById('back-to-edit-automation').addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });

  document.getElementById('back-to-edit-power-up').addEventListener('click', function () {
    const updateTab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-update"]'));
    updateTab.show();
  });




    // Workspace  update
  document.getElementById("changeWorkspaceBtn").addEventListener("click", function () {
    const dropdown = document.getElementById("workspaceDropdown");
    const selectedText = dropdown.options[dropdown.selectedIndex].text;

    if (dropdown.selectedIndex > 0) {
      document.getElementById("selectedWorkspaceDisplay").textContent = selectedText;
    }
  });
   
   // comment permission update
  document.getElementById("saveCommentPermissionBtn").addEventListener("click", function () {
    const selectedRadio = document.querySelector('input[name="commentPermission"]:checked');
    if (selectedRadio) {
      document.getElementById("commentPermissionDisplay").textContent = selectedRadio.value;
    }
  });
  // Voting permission update
  document.getElementById("saveVotingPermissionBtn").addEventListener("click", function () {
    const selectedVote = document.querySelector('input[name="votingPermission"]:checked');
    if (selectedVote) {
      document.getElementById("votingPermissionDisplay").textContent = selectedVote.value;
    }
  });

  // Add/Remove member permission update
  document.getElementById("saveAddPermissionBtn").addEventListener("click", function () {
    const selectedAdd = document.querySelector('input[name="addPermission"]:checked');
    if (selectedAdd) {
      document.getElementById("addRemovePermissionDisplay").textContent = selectedAdd.value;
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
    workspaceEditing: document.getElementById("workspaceEditingAdmins").checked,
    cardCovers: document.getElementById("cardCoversCheckbox").checked,
    completeCard: document.getElementById("completeCardCheckbox").checked
  };

  try {
    // PUT request for updating permissions
    const response = await fetch(`${API_BASE_URL}/settings`, {
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
document.getElementById("saveCommentPermissionBtn").addEventListener("click", postPermissionsData);
document.getElementById("saveVotingPermissionBtn").addEventListener("click", postPermissionsData);
document.getElementById("saveAddPermissionBtn").addEventListener("click", postPermissionsData);
document.getElementById("workspaceEditingAdmins").addEventListener("change", postPermissionsData);
document.getElementById("cardCoversCheckbox").addEventListener("change", postPermissionsData);
document.getElementById("completeCardCheckbox").addEventListener("change", postPermissionsData);

// Function to fetch and update settings dynamically
async function fetchAndUpdateSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
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

    const workspaceEditingCheckbox = document.getElementById("workspaceEditingAdmins");
    if (workspaceEditingCheckbox) workspaceEditingCheckbox.checked = settings.workspaceEditing;

    const cardCoversCheckbox = document.getElementById("cardCoversCheckbox");
    if (cardCoversCheckbox) cardCoversCheckbox.checked = settings.cardCovers;

    const completeCardCheckbox = document.getElementById("completeCardCheckbox");
    if (completeCardCheckbox) completeCardCheckbox.checked = settings.completeCard;

    // Safely update display elements
    const commentDisplay = document.getElementById("commentPermissionDisplay");
    if (commentDisplay) commentDisplay.textContent = settings.commenting;

    const votingDisplay = document.getElementById("votingPermissionDisplay");
    if (votingDisplay) votingDisplay.textContent = settings.voting;

    const addRemoveDisplay = document.getElementById("addRemovePermissionDisplay");
    if (addRemoveDisplay) addRemoveDisplay.textContent = settings.memberControl;

  } catch (error) {
    console.error("Error fetching settings:", error);
  }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", fetchAndUpdateSettings);

  // Unarchive tab


  document.addEventListener("DOMContentLoaded", function () {
    const archivedCardsContainer = document.getElementById("archived-cards-container");

    async function fetchArchivedCards() {
      try {
        const response = await fetch(`${API_BASE_URL}/archived-cards`, {
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
        const response = await fetch(`${API_BASE_URL}/restore-card`, {
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


  // Share tab
  
  document.addEventListener("DOMContentLoaded", function () {
    // Set the current URL to the board link input
    const boardLinkInput = document.getElementById("boardLink");
    boardLinkInput.value = window.location.href;

    // Attach event listeners
    const qrBtn = document.getElementById("qrBtn");
    const exportJSONBtn = document.getElementById("exportJSONBtn");
    const exportCSVBtn = document.getElementById("exportCSVBtn");
    const copyLinkBtn = document.getElementById("copyLinkBtn");

    if (qrBtn) qrBtn.addEventListener("click", showQRCode);
    if (exportJSONBtn) exportJSONBtn.addEventListener("click", exportJSON);
    if (exportCSVBtn) exportCSVBtn.addEventListener("click", exportCSV);
    if (copyLinkBtn) copyLinkBtn.addEventListener("click", copyBoardLink);
  });
  document.getElementById("printBtn").addEventListener("click", function () {
    window.print();
  });
  // Copy link to clipboard
  function copyBoardLink() {
    const input = document.getElementById("boardLink");
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
      const response = await fetch(`${API_BASE_URL}/tickets`);
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
      const response = await fetch(`${API_BASE_URL}/tickets`);
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
    const modal = new bootstrap.Modal(document.getElementById("qrModal"));
    const qrContainer = document.getElementById("qrCodeContainer");
    qrContainer.innerHTML = ""; // Clear previous QR
    new QRCode(qrContainer, {
      text: document.getElementById("boardLink").value,
      width: 200,
      height: 200,
    });
    modal.show();
  }

 