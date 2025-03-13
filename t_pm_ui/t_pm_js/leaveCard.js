import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
function cardjoinVerification(ticketId) {
  fetch(`${API_BASE_URL}${API_ROUTES.GET_JOIN_CARDS}/${ticketId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const loggedUsername = localStorage.getItem(ELEMENT_IDS.LOGGED_USERNAME);
      data.map(item => {
        const joinCardButton = document.getElementById(ELEMENT_IDS.JOIN_BUTTON);
        const leaveCardButton = document.getElementById(ELEMENT_IDS.LEAVE_BUTTON);
        if (item.joined_username === loggedUsername) {
          
          leaveCardButton.style.display = "block";
          joinCardButton.style.display = "none";
        } else {
         
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
