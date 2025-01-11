// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely
//get ticket

const taskTitle = document.getElementById('title');
const taskDes = document.getElementById('des');
const taskpri = document.getElementById('priority');
// Fetch Project Data from API
fetch(`${API_BASE_URL}/tickets`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.map(element => {
            taskTitle.innerHTML = `<h4>Title:</h4>${element.title}`
            taskDes.innerHTML = `<h4>Description:</h4>${element.description}`
            taskpri.innerHTML = `<h4>Priority:</h4>${element.priority}`
        })


    });
