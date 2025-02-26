function openjoinCardModal(ticketTitle, ticketId) {
  const joinCardForm = document.getElementById("join-card-form");
  const joinCardContent = ` <div class="mb-4">
                    <label class="form-check-label" for="">Title</label>
                    <textarea class="form-control" rows="2" id="join-card-title"
                      placeholder="Add Content" required="">${ticketTitle}</textarea>
                  </div>
                  <div class="mb-4"><button type="submit" class="btn btn-primary btn-sm me-4" onclick="joinCard('${ticketId}')">Join
                      Card</button><button type="button"
                      class="btn btn-label-secondary btn-sm cancel-add-item waves-effect waves-light"
                      id="cancel-form-4">Cancel</button>
                  </div>`;

  joinCardForm.innerHTML = joinCardContent;
}

function handleJoinCard() {
  fetch(`${API_BASE_URL}/get-join-cards`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      data.map(item => {
        const joinedCardAvtar = document.getElementById(
          `joined-member-${item.ticket_id}`
        );

        const joinhtmlContent = `<div class="d-flex">
            <div class="avatar me-1 flex-shrink-0" id="joined-user" onclick="joineUserDetail(event,'${item.joined_username}')">
              <span class="avatar-initial bg-label-primary rounded-circle">${item
                .joined_username[0]}${item.joined_username[1]}</span>
            </div>
            <div class="avatar me-3 flex-shrink-0" onclick="joinNewUser(event)">
              <span class="avatar-initial bg-label-primary rounded-circle"><i class="ti ti-plus"></i></span>
            </div>
          </div>`;
        if (joinedCardAvtar) {
          joinedCardAvtar.innerHTML = joinhtmlContent;
          const joinedUser = document.getElementById("joined-user");
        } else {
          // Error handling in case the element is not found.
          console.error("Element with ID 'joinCardAvtar' not found.");
        }
      });
    });
}

setTimeout(function() {
  handleJoinCard();
}, 1200);

// join card

async function joinCard(ticket_id) {
  const joined_username = localStorage.getItem("logged-username");
  try {
    const response = await fetch(`${API_BASE_URL}/add-join-card`, {
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
      console.log("card joined successfully");
      location.reload();
    }
  } catch (error) {
    console.log("error", error);
  }
}

function joineUserDetail(event, user) {
  event.stopPropagation();
  alert(user + " joined the card");
}

function joinNewUser(event) {
  event.stopPropagation();
  alert("new user data");
}
