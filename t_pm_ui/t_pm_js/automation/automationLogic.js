import { API_ROUTES } from "../../apiRoutesHeader.js";
async function moveCardAutomation(ticketId, currentTicketStatus, ticketStatus) {
  const payload = { ticketId, ticketStatus };

  try {
    const response = await fetch(
      `${API_BASE_URL}/update-ticket-status-automation`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      console.log("Ticket Updated");
      location.reload();
    } else {
      console.error("Failed to update ticket");
    }
  } catch (error) {
    console.error("Error connecting to the server:", error);
  }
}

async function copycardAutomation(ticketId, currentTicketStatus, ticketStatus) {
  // only pass the new status
  const payload = { ticketStatus };
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.COPY_ROW_AUTOMATION}/${ticketId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      console.log("Ticket copied");
      location.reload();
    } else {
      console.log("Something went wrong");
    }
  } catch (error) {
    messageElement.textContent = "Error connecting to the server.";
    messageElement.className = "message error";
    console.error("Error:", error);
  }
}

function markduedate(ticket_id, duedate) {
  const ticket_eta = duedate;
  const messageBox = document.getElementById("message");

  if (!ticket_id || !ticket_eta) {
    messageBox.textContent = "Please fill in both fields.";
    messageBox.style.color = "red";
    return;
  }

  fetch(`${API_BASE_URL}${API_ROUTES.AUTOMATION_TICKET_ETA}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticket_id, ticket_eta })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        messageBox.textContent = "Error: " + data.error;
        messageBox.style.color = "red";
      } else {
        Swal.fire({
          title: "Due date marked",
          text: "card due date mark successfully",
          icon: "success",
          confirmButtonText: "Ok!"
        }).then(function() {
          location.reload();
        });
      }
    })
    .catch(error => {
      messageBox.textContent = "Failed to connect to API.";
      messageBox.style.color = "red";
      console.error("Request Error:", error);
    });
}

function removeDuedate(ticket_id) {
  const ticket_eta = "";
  const messageBox = document.getElementById("message");

  if (!ticket_id) {
    messageBox.textContent = "Please fill in both fields.";
    messageBox.style.color = "red";
    return;
  }

  fetch(`${API_BASE_URL}/automation-ticket-eta`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticket_id, ticket_eta })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        messageBox.textContent = "Error: " + data.error;
        messageBox.style.color = "red";
      } else {
        messageBox.textContent = "Success: " + data.message;
        messageBox.style.color = "green";
        window.location.reload();
      }
    })
    .catch(error => {
      messageBox.textContent = "Failed to connect to API.";
      messageBox.style.color = "red";
      console.error("Request Error:", error);
    });
}
async function removeAllChecklists(id) {
  try {
    // Send DELETE request to the API
    const response = await fetch(`${API_BASE_URL}/remove-checklist/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("You successfully removed all checklist of given id's card");
      window.location.reload(); // Refresh the page after successful delete
    } else {
      console.log("Oops, something went wrong");
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}
