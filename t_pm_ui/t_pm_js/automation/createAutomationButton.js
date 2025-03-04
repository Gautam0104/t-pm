export async function sendAutomationData(ticketId, buttonTitle, buttonAction) {
  try {
    const response = await fetch(`${API_BASE_URL}/automation-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ticketId, buttonTitle, buttonAction })
    });

    if (response.ok) {
      console.log("Set due date card automation button added successfully");
      location.reload();
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
