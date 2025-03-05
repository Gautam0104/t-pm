
import { API_ROUTES } from "../../apiRoutesHeader.js";

export async function sendAutomationData(ticketId, buttonTitle, buttonAction) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.AUTOMATION_DATA}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticketId, buttonTitle, buttonAction }),
    });

    if (response.ok) {
      console.log("Set due date card automation button added successfully");
      location.reload();
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
