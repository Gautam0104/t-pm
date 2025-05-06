import { API_ROUTES } from "../apiRoutesHeader.js";

const API_BASE_URL = ENV.API_BASE_URL;

const moveallcarModal = document.getElementById("moveallcardcontent");

const content = ` <div class="modal-header">
                  <h4 class="text-center">Move all card</h4>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                 <form >

                    <div class="mb-4">
                    <label class="form-check-label">Move all To</label>
                    <input
                      type="text"
                      class="form-control"
                      id="move-to"
                      placeholder="Please enter board where you want to move all card" />
                  </div>
                  <div class="mb-4 w-100">
                    <button type="button" class="btn btn-primary btn-sm me-4" id="moveAllCard">Move...</button>
                  </div>
                </form>
                </div>`;

moveallcarModal.innerHTML = content;
document.getElementById("moveAllCard").addEventListener("click", function() {
  const moveTo = document.getElementById("move-to").value.trim();
  const moveFrom = window.moveFromBoard;
  console.log(moveFrom);
  moveAllCard(moveFrom, moveTo);
});

async function moveAllCard(currentStatus, newStatus) {
  const payload = { currentStatus, newStatus };

  console.log(
    "API URL:",
    `${API_BASE_URL}${API_ROUTES.UPDATE_TICKET_BY_STATUS}`
  );
  console.log("Payload being sent:", payload);

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.UPDATE_TICKET_BY_STATUS}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      location.reload();
    } else {
      const errorResponse = await response.json().catch(() => ({}));
      console.error("Failed to update ticket:", errorResponse);
    }
  } catch (error) {
    console.error("Move all card error:", error);
  }
}
