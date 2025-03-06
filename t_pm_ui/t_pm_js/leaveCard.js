import { API_ROUTES } from "../apiRoutesHeader";
function cardjoinVerification(ticketId) {
  fetch(`${API_BASE_URL}${API_ROUTES.GET_JOIN_CARDS}/${ticketId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const loggedUsername = localStorage.getItem("logged-username");
      data.map(item => {
        const joinCardButton = document.getElementById("join-button");
        const leaveCardButton = document.getElementById("leave-button");
        if (item.joined_username === loggedUsername) {
          console.log("you all ready joined this card");
          leaveCardButton.style.display = "block";
          joinCardButton.style.display = "none";
        } else {
          console.log("you can join this card");
          leaveCardButton.style.display = "none";
          joinCardButton.style.display = "block";
        }
      });
    });
}

async function leaveCard(ticketId) {
  try {
    // Send DELETE request to the API
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.DELETE_JOIN_CARD}/${ticketId}`,
      {
        method: "DELETE"
      }
    );

    // Parse the response
    // const data = await response.json();

    if (response.ok) {
      console.log("you successfully leave this card");

      window.location.reload();
    } else {
      console.log("oops something went wrong");
    }
  } catch (error) {
    console.error(error);
  }
}

window.leaveCard = leaveCard;
window.cardjoinVerification = cardjoinVerification;
