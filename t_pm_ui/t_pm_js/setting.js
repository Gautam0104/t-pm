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

  document.getElementById('back-to-edit-about').addEventListener('click', function () {
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
    };
  
    try {
      // POST request
      const response = await fetch("${API_BASE_URL}/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissions),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save permissions");
      }
  
      const data = await response.json();
    } catch (error) {
      console.error("Error posting permissions:", error);
    }
  }

  // Bind function to button(s)
  document.getElementById("saveCommentPermissionBtn").addEventListener("click", postPermissionsData);
  document.getElementById("saveVotingPermissionBtn").addEventListener("click", postPermissionsData);
  document.getElementById("saveAddPermissionBtn").addEventListener("click", postPermissionsData);
  document.getElementById("workspaceEditingAdmins").addEventListener("change", postPermissionsData);
  document.getElementById("cardCoversCheckbox").addEventListener("change", postPermissionsData);

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
