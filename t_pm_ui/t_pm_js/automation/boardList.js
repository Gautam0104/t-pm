import { API_ROUTES } from "../../apiRoutesHeader.js";
import { ELEMENT_IDS } from "../element_id.js";

export async function fetchLists() {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.GET_BOARDS}`);

    // Debugging: Check response status
    if (!response.ok) {
      console.error("Failed to fetch lists. Status:", response.status);
      return;
    }

    const lists = await response.json();

    const select = document.getElementById(ELEMENT_IDS.SELECT_LIST);
    if (!select) {
      console.error("listSelect element not found");
      return;
    }

    select.innerHTML = '<option value="">Select List</option>';

    lists.forEach(list => {
      const option = document.createElement(ELEMENT_IDS.OPTION);
      option.value = list.board_title;
      option.textContent = list.board_title;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
}
