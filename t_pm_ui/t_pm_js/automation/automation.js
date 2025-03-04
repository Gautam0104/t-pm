function retrieveAutomation(ticketId) {
  fetch(`${API_BASE_URL}/automation-data`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const automationButtonArea = document.getElementById(
        `automation-button-ul-${ticketId}`
      );
      let automationLength = data.length;

      data.map(item => {
        if (automationLength > 0 && item.ticket_id === ticketId) {
          automationButtonArea.style.display = "block";
        }
        const automationButtonAreaContent = `<li class="nav-item dropdown">
          <button class="nav-link  d-flex align-items-center border-0  w-100" id="automationButton" onclick="${item.button_action}">
                 <i class="fas fa-arrow-right me-2"></i> ${item.button_title}
             </button>
          </li>`;
        if (item.ticket_id === ticketId) {
          automationButtonArea.innerHTML += automationButtonAreaContent;
        }
      });
    });
}

function editAutomation(ticketId) {
  fetch(`${API_BASE_URL}/automation-data/${ticketId}`)
    .then(response => {
      const contentType = response.headers.get("Content-Type");
      console.log("Response Headers:", response.headers);

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      // Check if content-type is JSON
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        throw new Error("Expected JSON, but received: " + contentType);
      }
    })
    .then(data => {
      console.log("API Response Data:", data); // Log to see if it's an array or an object
      const editAutomationModal = document.getElementById(
        "edit-automation-modal-content"
      );

      if (Array.isArray(data)) {
        // Loop through and display the data as array
        data.forEach(item => {
          const modalContent = `<ul class="nav flex-column py-2 overflow-auto">
                                    <li class="nav-item w-100 rounded d-flex justify-content-between" style="background-color: #e4dcdc;">
                                        <button class="nav-link d-flex align-items-center border-0  w-100" id="add-button-dropdown">
                                        <i class="fas fa-arrow-right me-2"></i> ${item.button_title}
                                        </button>
                                        <button class="nav-link" id="add-button-dropdown" data-bs-dismiss="modal" aria-label="Close" onclick="deleteAutomationButton('${item.id}')">
                                        <span class=" w-px-40 h-px-40 rounded-circle d-flex justify-content-center align-items-center"
                                              style="background-color: #d1c3c3;">
                                          <i class="ti ti-trash rounded-circle ti-md"></i>
                                        </span>
                                        </button>
                                    </li>
                                  </ul>`;
          editAutomationModal.innerHTML += modalContent;
        });
      } else {
        console.error("Expected an array, but got:", data);
        editAutomationModal.innerHTML =
          "<p>Unexpected data format. Expected an array of items.</p>";
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      document.getElementById("edit-automation-modal-content").innerHTML =
        "<p>Error occurred. Please check the console for details.</p>";
    });

  // Initialize and show the Bootstrap modal dynamically
  let modalElementauto = document.getElementById("editautomationModal");
  let modal = new bootstrap.Modal(modalElementauto);
  modal.show();
}

async function deleteAutomationButton(id) {
  try {
    // Send DELETE request to the API
    const response = await fetch(`${API_BASE_URL}/automation-data/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("You successfully deleted an automation button");
      window.location.reload(); // Refresh the page after successful delete
    } else {
      console.log("Oops, something went wrong");
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}
