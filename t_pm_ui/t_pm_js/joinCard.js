import { API_ROUTES } from "../apiRoutesHeader.js";
const API_BASE_URL = ENV.API_BASE_URL;

function openjoinCardModal(ticketTitle, ticketId) {
  const joinCardForm = document.getElementById("join-card-form");
  const joinCardContent = `
    <div class="mb-4">
      <label class="form-check-label" for="">Title</label>
      <textarea class="form-control" rows="2" id="join-card-title" placeholder="Add Content" required="">${ticketTitle}</textarea>
    </div>
    <div class="mb-4">
      <button type="button" class="btn btn-primary btn-sm me-4" onclick="joinCard('${ticketId}')">Join Card</button>
      <button type="button" class="btn btn-label-secondary btn-sm cancel-add-item waves-effect waves-light" data-bs-dismiss="modal">Cancel</button>
    </div>`;
  joinCardForm.innerHTML = joinCardContent;
}

async function joinCard(ticket_id) {
  const joined_username = localStorage.getItem("logged-username");
  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.ADD_JOIN_CARD}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ticket_id,
        joined_username
      })
    });
    if (response.ok) {
      console.log("Card joined successfully");
      location.reload();
    } else {
      throw new Error("Failed to join card");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to join card. Please try again.",
      icon: "error",
      confirmButtonText: "Retry"
    });
  }
}

function handleJoinCard() {
  fetch(`${API_BASE_URL}${API_ROUTES.GET_JOIN_CARDS}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      data.forEach(item => {
        const joined_username = localStorage.getItem("logged-username");
        const joinedCardAvtar = document.getElementById(`joined-member-${item.ticket_id}`);
        const joinhtmlContent = `
          <div class="d-flex">
            <div class="avatar me-1 flex-shrink-0" id="joined-user" onclick="joineUserDetail(event,'${item.joined_username}')">
              <span class="avatar-initial bg-label-primary rounded-circle">${item.joined_username[0]}${item.joined_username[1]}</span>
            </div>
            <div class="avatar me-3 flex-shrink-0" onclick="joinNewUser(event,'${item.ticket_id}')">
              <span class="avatar-initial bg-label-primary rounded-circle"><i class="ti ti-plus"></i></span>
            </div>
          </div>`;
        if (joinedCardAvtar) {
          joinedCardAvtar.innerHTML = joinhtmlContent;
        } else {
          console.error("Element with ID 'joined-member-${item.ticket_id}' not found.");
        }
      });
    })
    .catch(error => {
      console.error("Error fetching join cards:", error);
    });
}

function joineUserDetail(event, user) {
  event.stopPropagation();
  alert(user + " joined the card");
}

function joinNewUser(event, tickId) {
  event.stopPropagation();
  const modalElement = document.getElementById("joinUsers");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  const joinuserModal = document.getElementById("join-user-modal");
  const modalBody = `
    <div class="modal-body">
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      <div class="text-center">
        <h4 class="mb-2">Users</h4>
        <p>You can join any user on this card</p>
      </div>
      <h5 class="ms-4 ms-md-0" id="numofmember">4 Members</h5>
      <ul class="p-0 m-0 mx-4 mx-md-0" id="list-content">
        <li class="d-flex flex-wrap mb-4">
          <div class="avatar me-4">
            <img src="../assets/img/avatars/1.png" alt="avatar" class="rounded-circle">
          </div>
          <div class="d-flex justify-content-between flex-grow-1">
            <div class="me-2">
              <p class="mb-0 text-heading">Thunder <span class="badge bg-label-success me-1">Admin</span></p>
              <p class="small mb-0">Thunder</p>
            </div>
            <div class="dropdown">
              <button type="button" class="btn btn-text-secondary dropdown-toggle p-2 text-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="me-2 d-none d-sm-inline-block">Join</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="javascript:void(0);">Click join on this card</a>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li class="d-flex flex-wrap mb-4">
          <div class="avatar me-4">
            <img src="../assets/img/avatars/1.png" alt="avatar" class="rounded-circle">
          </div>
          <div class="d-flex justify-content-between flex-grow-1">
            <div class="me-2">
              <p class="mb-0 text-heading">Aman <span class="badge bg-label-info me-1">Team Member</span></p>
              <p class="small mb-0">Aman</p>
            </div>
            <div class="dropdown">
              <button type="button" class="btn btn-text-secondary dropdown-toggle p-2 text-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="me-2 d-none d-sm-inline-block">Join</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="javascript:void(0);">Click join on this card</a>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li class="d-flex flex-wrap mb-4">
          <div class="avatar me-4">
            <img src="../assets/img/avatars/1.png" alt="avatar" class="rounded-circle">
          </div>
          <div class="d-flex justify-content-between flex-grow-1">
            <div class="me-2">
              <p class="mb-0 text-heading">Gautam <span class="badge bg-label-info me-1">Team Member</span></p>
              <p class="small mb-0">Gautam</p>
            </div>
            <div class="dropdown">
              <button type="button" class="btn btn-text-secondary dropdown-toggle p-2 text-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="me-2 d-none d-sm-inline-block">Join</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="javascript:void(0);">Click join on this card</a>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li class="d-flex flex-wrap mb-4">
          <div class="avatar me-4">
            <img src="../assets/img/avatars/1.png" alt="avatar" class="rounded-circle">
          </div>
          <div class="d-flex justify-content-between flex-grow-1">
            <div class="me-2">
              <p class="mb-0 text-heading">Utkarsh <span class="badge bg-label-info me-1">Team Member</span></p>
              <p class="small mb-0">Utkarsh</p>
            </div>
            <div class="dropdown">
              <button type="button" class="btn btn-text-secondary dropdown-toggle p-2 text-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="me-2 d-none d-sm-inline-block">Join</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="javascript:void(0);">Click join on this card</a>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>`;
  joinuserModal.innerHTML = modalBody;
}

window.openjoinCardModal = openjoinCardModal;
window.joinCard = joinCard;
window.joineUserDetail = joineUserDetail;
window.joinNewUser = joinNewUser;
window.handleJoinCard = handleJoinCard;
