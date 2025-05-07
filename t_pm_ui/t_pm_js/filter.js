import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
// Sample data for demonstration
const cards = [
  { title: "Task 1", assignedTo: "User A", status: "complete", dueDate: "2023-10-01", labels: ["urgent"] },
  { title: "Task 2", assignedTo: "User B", status: "incomplete", dueDate: "2023-10-05", labels: [] },
  // Add more card objects as needed
];

// Function to populate filter options dynamically
function populateFilters() {
  const memberFilter = document.getElementById('filter-assigned-to-me');
  const labelFilter = document.querySelector('.form-select');

  // Populate members (assuming you have a unique list of members)
  const members = [...new Set(cards.map(card => card.assignedTo))];
  members.forEach(member => {
    const option = document.createElement('option');
    option.value = member;
    option.textContent = member;
    memberFilter.appendChild(option);
  });

  // Populate labels (assuming you have a unique list of labels)
  const labels = [...new Set(cards.flatMap(card => card.labels))];
  labels.forEach(label => {
    const option = document.createElement('option');
    option.value = label;
    option.textContent = label;
    labelFilter.appendChild(option);
  });
}

// Function to filter cards based on selected filters
function filterCards() {
  const keyword = document.querySelector('input[placeholder="Enter a keyword..."]').value.toLowerCase();
  const assignedTo = document.getElementById('filter-assigned-to-me').checked ? document.getElementById('filter-assigned-to-me').value : null;
  const statusComplete = document.getElementById('filter-complete').checked;
  const statusIncomplete = document.getElementById('filter-incomplete').checked;

  const filteredCards = cards.filter(card => {
    const matchesKeyword = card.title.toLowerCase().includes(keyword);
    const matchesAssignedTo = assignedTo ? card.assignedTo === assignedTo : true;
    const matchesStatus = (statusComplete && card.status === "complete") || (statusIncomplete && card.status === "incomplete");

    return matchesKeyword && matchesAssignedTo && matchesStatus;
  });

  // Update the displayed cards based on filteredCards
  console.log(filteredCards); // Replace this with your logic to display the filtered cards
}

// Event listeners for filter inputs
document.addEventListener('DOMContentLoaded', () => {
  populateFilters();

  document.querySelector('input[placeholder="Enter a keyword..."]').addEventListener('input', filterCards);
  document.getElementById('filter-assigned-to-me').addEventListener('change', filterCards);
  document.getElementById('filter-complete').addEventListener('change', filterCards);
  document.getElementById('filter-incomplete').addEventListener('change', filterCards);
});


// Function to fetch card statuses from the database
async function fetchCardStatuses() {
  try {
    const response = await fetch(`${API_BASE_URL}/category`); 
    const data = await response.json();

    
    const statusContainer = document.querySelector('.status-container'); // Add a container for dynamic checkboxes
    statusContainer.innerHTML = ''; // Clear existing checkboxes

    data.forEach(status => {
      const div = document.createElement('div');
      div.classList.add('form-check');
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" id="filter-${status.status.toLowerCase()}" value="${status.id}">
        <label class="form-check-label" for="filter-${status.status.toLowerCase()}">${status.status}</label>
      `;
      statusContainer.appendChild(div);
    });
  } catch (error) {
    console.error('Error fetching card statuses:', error);
  }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', fetchCardStatuses);
