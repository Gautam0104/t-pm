//todo js file

// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely

// Get query parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");
console.log(projectId);

const projectName = document.getElementById("name");
const projectLeader = document.getElementById("leader");
const projectDescription = document.getElementById("description");
const projectStatus = document.getElementById("status");
const projectETA = document.getElementById("eta");

// Fetch Project Data from API
fetch(`${API_BASE_URL}/project/${projectId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        let statusText = "";
        switch (data.project_status) {
            case 1:
                statusText = '<span class="badge bg-label-primary me-1">Active</span>';
                break;
            case 2:
                statusText =
                    '<span class="badge bg-label-success me-1">Complete</span>';
                break;
            case 3:
                statusText = '<span class="badge bg-label-info me-1">Scheduled</span>';
                break;
            case 4:
                statusText = '<span class="badge bg-label-warning me-1">Pending</span>';
                break;
            default:
                statusText = '<span class="badge bg-label-danger me-1">Unknown</span>';
        }
        projectName.innerText = data.project_name;
        projectLeader.innerText = data.first_name;
        projectDescription.innerText = data.description;
        projectStatus.innerHTML = statusText;
        projectETA.innerText = data.total_eta;

        // console.log(data)
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });
