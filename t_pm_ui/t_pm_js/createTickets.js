import { API_ROUTES } from "../apiRoutesHeader";
// Base URL of the API
var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
var user_id = urlParams.get("user_id");

// Reusable function to handle form submissions
async function createTicket(formId, inputId, ticket_status) {
  const form = document.getElementById(formId);
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById(inputId).value;
    const description = "";
    const status = "Backlog";
    const priority = "Medium";
    const created_by = user_id;
    const due_date = "2025-01-13";

    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.TICKET}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id,
          title,
          description,
          status,
          priority,
          created_by,
          due_date,
          ticket_status,
        }),
      });

      if (response.ok) {
        console.log("Ticket created successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  });
}

// Initialize forms after the DOM is loaded
setTimeout(function () {
  createTicket("add-new-todo-form", "ticket-title-todo", "todo");
  createTicket("add-new-inprogress-form", "ticket-title-inprogress", "inprogress");
  createTicket("add-new-for-approval-form", "ticket-title-for-approval", "for-approval");
  createTicket("add-new-rejected-form", "ticket-title-rejected", "rejected");
  createTicket("add-new-approved-form", "ticket-title-approved", "approved");
}, 1000);
