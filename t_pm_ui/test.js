// Define the API URL
const apiUrl = 'https://advanced-serval-instantly.ngrok-free.app/projects';

// Function to fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(apiUrl, {
      method: 'GET', // HTTP method
      headers: {
        'Content-Type': 'application/json', // Specify JSON data
        // Add additional headers here if required by the API
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    console.log('Fetched data:', data);

    // Use the data in your frontend
    displayData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display the data (example)
function displayData(data) {
  const container = document.getElementById('data-container');
  container.innerHTML = JSON.stringify(data, null, 2); // Display as JSON
}

// Call the fetchData function
fetchData();
