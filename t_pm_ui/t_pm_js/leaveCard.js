import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
const API_BASE_URL = ENV.API_BASE_URL;
export async function leaveCard(ticketId) {
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
    console.error("Leave card  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  }
}

window.leaveCard = leaveCard;
