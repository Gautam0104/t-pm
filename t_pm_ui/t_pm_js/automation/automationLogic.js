import { API_ROUTES } from "../../apiRoutesHeader.js";
import { ELEMENT_IDS } from "../element_id.js";

export async function moveCardAutomation(
  ticketId,
  currentTicketStatus,
  ticketStatus
) {
  const payload = { ticketId, ticketStatus };

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.AUTOMATION_TICKET_STATUS}`,
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
    console.log("error  : ", error);
  }
}

export async function copycardAutomation(
  ticketId,
  currentTicketStatus,
  ticketStatus
) {
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
    console.error("Automation rule error:", err);
    res.status(500).json({ message: "Error creating rule." });
  }
}

export function markduedate(ticket_id, duedate) {
  const ticket_eta = duedate;
  const messageBox = document.getElementById(ELEMENT_IDS.MESSAGE);

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
          text: "Card due date marked successfully",
          icon: "success",
          confirmButtonText: "Ok!"
        }).then(function() {
          location.reload();
        });
      }
    })
    .catch(error => {
      console.error("Automation rule error:", err);
      res.status(500).json({ message: "Error creating rule." });
    });
}
export function addduedateAutomation(ticket_id, duedate, days) {
  const ticket_eta = duedate + ` ${days}`;
  const messageBox = document.getElementById(ELEMENT_IDS.MESSAGE);

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
          text: "Card due date marked successfully",
          icon: "success",
          confirmButtonText: "Ok!"
        }).then(function() {
          location.reload();
        });
      }
    })
    .catch(error => {
      console.error("Automation rule error:", error);
      res
        .status(500)
        .json({ message: "Error creating in due date automation." });
    });
}

export function removeDuedate(ticket_id) {
  const ticket_eta = "";
  const messageBox = document.getElementById(ELEMENT_IDS.MESSAGE);

  if (!ticket_id) {
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
        messageBox.textContent = "Success: " + data.message;
        messageBox.style.color = "green";
        window.location.reload();
      }
    })
    .catch(error => {
      console.error("Automation rule error:", err);
      res.status(500).json({ message: "Error creating rule." });
    });
}

export async function removeAllChecklists(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.AUTOMATION_REMOVE_CHECKLIST}/${id}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      console.log("You successfully removed all checklists of given card ID");
      window.location.reload();
    } else {
      console.log("Oops, something went wrong");
      window.location.reload();
    }
  } catch (error) {
    console.error("Automation rule error:", err);
    res.status(500).json({ message: "Error creating remove all checklists." });
  }
}

export function addLabelAutomation(ticketId, selectedColor) {
  let labelBox = document.getElementById(`label-color-box-${ticketId}`);

  if (!labelBox) {
    // Create label box if it does not exist
    labelBox = document.createElement("div");
    labelBox.id = `label-color-box-${ticketId}`;
    labelBox.classList.add("label-container");

    // Append it to the ticket container
    const ticketElement = document.getElementById(`ticket-${ticketId}`);
    if (ticketElement) {
      ticketElement.appendChild(labelBox);
    }
  }

  // Add the label color inside the label box
  labelBox.innerHTML = `<div class="label-color" style="background-color: ${selectedColor}; width: 20px; height: 5px; border-radius: 10px; margin-bottom:10px;"></div>`;

  // Store the selected color in localStorage
  localStorage.setItem(`labelColor-${ticketId}`, selectedColor);
}

//  Function to restore labels after tickets are loaded
export function loadSavedLabels() {
  const interval = setInterval(() => {
    const tickets = document.querySelectorAll("[id^='ticket-']");
    if (tickets.length > 0) {
      tickets.forEach(ticket => {
        const ticketId = ticket.id.replace("ticket-", ""); // Extract ticketId
        const savedColor = localStorage.getItem(`labelColor-${ticketId}`);

        if (savedColor) {
          addLabelAutomation(ticketId, savedColor);
        }
      });
      clearInterval(interval); // Stop checking once labels are restored
    }
  }, 300); // Check every 300ms until tickets exist
}

//  Ensure labels are restored on page load
document.addEventListener("DOMContentLoaded", loadSavedLabels);
