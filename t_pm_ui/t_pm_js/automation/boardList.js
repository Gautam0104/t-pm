export async function fetchLists() {
  try {
    const response = await fetch(`${API_BASE_URL}/getboards`);

    // Debugging: Check response status
    if (!response.ok) {
      console.error("Failed to fetch lists. Status:", response.status);
      return;
    }

    const lists = await response.json();

    const select = document.getElementById("listSelect");
    if (!select) {
      console.error("listSelect element not found");
      return;
    }

    select.innerHTML = '<option value="">Select List</option>';

    lists.forEach(list => {
      const option = document.createElement("option");
      option.value = list.board_title;
      option.textContent = list.board_title;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
}
