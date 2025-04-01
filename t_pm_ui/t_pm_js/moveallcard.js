const API_BASE_URL = ENV.API_BASE_URL;

export async function moveAllCard(currentStatus, newStatus) {
  const payload = { currentStatus, newStatus };

  try {
    const response = await fetch(`${API_BASE_URL}/update-ticket-by-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log("Ticket Updated");
      location.reload();
    } else {
      console.error("Failed to update ticket");
    }
  } catch (error) {
    console.error("Move all card  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  }
}
