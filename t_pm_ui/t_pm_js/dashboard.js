import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";
// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely

// Project table data filter
const filterInput = document.getElementById(ELEMENT_IDS.FILTER_INPUT);
const tableBody = document.getElementById(ELEMENT_IDS.TABLE_BODY);

filterInput.addEventListener("keyup", () => {
  const filterValue = filterInput.value.toLowerCase();
  const rows = tableBody.getElementsByTagName("tr");

  for (let row of rows) {
    const cells = row.getElementsByTagName("td");
    let match = false;

    for (let cell of cells) {
      if (cell.textContent.toLowerCase().includes(filterValue)) {
        match = true;
        break;
      }
    }

    row.style.display = match ? "" : "none";
  }
});

function openModal() {
  const modalElement = document.getElementById(ELEMENT_IDS.SHARE_PROJECT);
  const modal = new bootstrap.Modal(modalElement);

  modal.show();
}

// project data

// Fetch Project Data from API
fetch(`${API_BASE_URL}${API_ROUTES.GET_USERS}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const modifiedRole = data.map(user => {
      let roleText = "";
      switch (user.role_id) {
        case 1:
          roleText = '<span class="badge bg-label-success me-1">Admin</span>';
          break;
        case 2:
          roleText =
            '<span class="badge bg-label-primary me-1">Project Manager</span>';
          break;
        case 3:
          roleText =
            '<span class="badge bg-label-info me-1">Team Member</span>';
          break;
        default:
          statusText =
            '<span class="badge bg-label-danger me-1">Unknown</span>';
      }
      return {
        role: roleText,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name
      };
    });
    const listContent = document.querySelector("#list-content");
    // tableBody.innerHTML = ''; // Clear existing rows
    const memberCount = document.getElementById("numofmember");
    memberCount.innerHTML = `${data.length} Members`;
    // Populate List Content with User Data
    modifiedRole.forEach(element => {
      const content = `
                     <li class="d-flex flex-wrap mb-4" >  
                     <div class="avatar me-4">
                        <img src="../assets/img/avatars/1.png" alt="avatar" class="rounded-circle" />
                      </div>
                      <div class="d-flex justify-content-between flex-grow-1">
                        <div class="me-2">
                          <p class="mb-0 text-heading">${element.first_name} ${element.role}
                          <p class="small mb-0">${element.username}</p>
                        </div>
                        <div class="dropdown">
                          <button type="button" class="btn btn-text-secondary dropdown-toggle p-2 text-secondary"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            <span class="me-2 d-none d-sm-inline-block">Role</span>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                              <a class="dropdown-item" href="javascript:void(0);">Owner</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="javascript:void(0);">Can Edit</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="javascript:void(0);">Can Comment</a>
                            </li>
                            <li>
                              <a class="dropdown-item" href="javascript:void(0);">Can View</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      </li>
                   
          `;
      listContent.innerHTML += content;
    });
    
  })
  .catch(error => {
    console.error("Error fetching user data:", error);
  });

// Fetch Project Data from API
fetch(`${API_BASE_URL}${API_ROUTES.PROJECT_DATA}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    const modifiedResults = data.map(project => {
      // Determine project status
      const statusMap = {
        1: '<span class="badge bg-label-primary me-1">Active</span>',
        2: '<span class="badge bg-label-success me-1">Complete</span>',
        3: '<span class="badge bg-label-info me-1">Scheduled</span>',
        4: '<span class="badge bg-label-warning me-1">Pending</span>'
      };
      const statusText =
        statusMap[project.project_status] ||
        '<span class="badge bg-label-danger me-1">Unknown</span>';

      // Determine project type icon
      const typeMap = {
        project: '<img src="../assets/img/icons/dash_icon/active.png" alt="">',
        ticket: '<img src="../assets/img/icons/dash_icon/ticket.png" alt="">'
      };
      const projectType =
        typeMap[project.project_type] ||
        '<img src="../assets/img/icons/dash_icon/active.png" alt="">';

      return {
        project_id: project.project_id,
        project_name: project.project_name,
        project_leader_id: project.project_leader_id,
        project_leader_fname: project.first_name,
        project_leader_lname: project.last_name,
        description: project.description,
        status: statusText,
        total_eta: project.total_eta,
        created_at: project.created_at,
        updated_at: project.updated_at,
        project_type: projectType
      };
    });

    const tableBody = document.querySelector("#initailbody");
    tableBody.innerHTML = ""; // Clear existing rows

    // Populate table rows with user data
    modifiedResults.forEach(element => {
      const isoDate = `${element.total_eta}`;

      // Convert to a Date object
      const date = new Date(isoDate);

      // Extract date components
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();

      // Extract time components
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      // Combine date and time
      const formattedEta = `${hours}:${minutes}:${seconds} , ${day}/${month}/${year} `;
      const row = `
        <tr>
          <td></td>
          <td>
            <ul class="list-unstyled m-0 avatar-group d-flex align-items-center">
              <li class="avatar avatar-xs pull-up" title="Project Type">
                ${element.project_type}
              </li>
              <li class="mx-3">${element.project_name}</li>
            </ul>
          </td>
          <td style="cursor:pointer">
            <a class="dropdown-item" href="todo.html?id=${element.project_id}&user_id=${element.project_leader_id}&pname=${element.project_name}">
              ${element.project_leader_fname}
            </a>
          </td>
          <td>
            <ul class="list-unstyled m-0 avatar-group d-flex align-items-center">
              <li data-bs-toggle="tooltip" class="avatar avatar-xs pull-up" title="Team Member">
                <img src="../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle" />
              </li>
              <li data-bs-toggle="tooltip" class="avatar avatar-xs pull-up" title="Add team member" onclick="openModal()">
                <i class="ti ti-plus me-0 me-sm-1 ti-xs border rounded-circle bg-dark" style="color: #fff;"></i>
              </li>
            </ul>
          </td>
          <td>${formattedEta}</td>
          <td>2 hours</td>
          <td>${element.status}</td>
          <td>
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="ti ti-dots-vertical"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateProject" onclick="editProject(${element.project_id})">
                  <i class="ti ti-pencil me-1"></i> Edit
                </a>
                <a class="dropdown-item" onclick="handleDelete(${element.project_id})">
                  <i class="ti ti-trash me-1"></i> Delete
                </a>
              </div>
            </div>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  })
  .catch(error => {
    console.error("Error fetching project data:", error);
  });

// Fetch and count data active projects and completed tasks
const activeProjectsCountElement = document.getElementById(
  ELEMENT_IDS.ACTIVE_PROJECTS_COUNTS
);
const completeProjectsCountElement = document.getElementById(
  ELEMENT_IDS.COMPLETE_PROJECTS_COUNTS
);
const totalProjectsCountElement = document.getElementById(
  ELEMENT_IDS.TOTAL_PROJECTS_COUNTS
);

// Fetch Project Data from API
fetch(`${API_BASE_URL}${API_ROUTES.PROJECT_DATA}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    // Filter projects with "active" status
    const activeProjects = data.filter(project => project.project_status === 1);

    // Update the active projects count in the DOM
    activeProjectsCountElement.textContent = activeProjects.length;

    // Filter projects with "completed" status
    const completeProjects = data.filter(
      project => project.project_status === 2
    );

    // Update the completed projects count in the DOM
    completeProjectsCountElement.textContent = completeProjects.length;

    // count total projects and tickets
    const totalProjects = data.filter(project => project.project_id).length;
    totalProjectsCountElement.textContent = totalProjects;
  })
  .catch(error => {
    console.error("Error fetching projects:", error);
    activeProjectsCountElement.textContent = "Error";
  });

//Delete Project

const handleDelete = async project_id => {
  try {
    // Send DELETE request to the API
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.DELETE_PROJECT}/${project_id}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      Swal.fire({
        title: "Projet Deleted Successfully",
        text: "A project is delete from your projects",
        icon: "success",
        confirmButtonText: "Ok!"
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        title: "Oops!",
        text: "something went wrong. Try again!",
        icon: "error",
        confirmButtonText: "Retry!"
      });
    }
  } catch (error) {
    console.error("Delete project  error:", error);
    res.status(500).json({
      message: "'An error occurred. Please try again later.', 'error'"
    });
  }
};

//filter data

fetch(`${API_BASE_URL}${API_ROUTES.PROJECT_DATA}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const modifiedResults = data.map(project => {
      let statusValue = "";
      let statusText = "";
      switch (project.project_status) {
        case 1:
          statusValue = "Active";
          statusText = '<span class="badge bg-label-primary me-1">Active</span>';
          break;
        case 2:
          statusValue = "Complete";
          statusText = '<span class="badge bg-label-success me-1">Complete</span>';
          break;
        case 3:
          statusValue = "Scheduled";
          statusText = '<span class="badge bg-label-info me-1">Scheduled</span>';
          break;
        case 4:
          statusValue = "Pending";
          statusText = '<span class="badge bg-label-warning me-1">Pending</span>';
          break;
        default:
          statusValue = "Unknown";
          statusText = '<span class="badge bg-label-danger me-1">Unknown</span>';
      }

      let projectTpe = "";
      switch (project.project_type) {
        case "project":
          projectTpe = '<img src="../assets/img/icons/dash_icon/active.png" alt="">';
          break;
        case "ticket":
          projectTpe = '<img src="../assets/img/icons/dash_icon/ticket.png" alt="">';
          break;
        default:
          projectTpe = '<img src="../assets/img/icons/dash_icon/active.png" alt="">';
      }

      return {
        project_id: project.project_id,
        project_name: project.project_name,
        project_leader_id: project.project_leader_id,
        project_leader_fname: project.first_name,
        project_leader_lname: project.last_name,
        description: project.description,
        statusText,
        statusValue,
        total_eta: project.total_eta,
        created_at: project.created_at,
        updated_at: project.updated_at,
        project_type: projectTpe
      };
    });

    const projectName = document.getElementById("projectName");
    const projectLeader = document.getElementById("projectLeader");
    const projectStatus = document.getElementById("projectStatus");

    const projectStatusSet = new Set();
    const projectLeaderSet = new Set();
    const projectNameSet = new Set();

    modifiedResults.forEach(element => {
      if (!projectStatusSet.has(element.statusValue)) {
        projectStatusSet.add(element.statusValue);
        projectStatus.innerHTML += `<option value="${element.statusValue.toLowerCase()}">${element.statusValue}</option>`;
      }

      if (!projectLeaderSet.has(element.project_leader_fname)) {
        projectLeaderSet.add(element.project_leader_fname);
        projectLeader.innerHTML += `<option value="${element.project_leader_fname.toLowerCase()}">${element.project_leader_fname}</option>`;
      }

      if (!projectNameSet.has(element.project_name)) {
        projectNameSet.add(element.project_name);
        projectName.innerHTML += `<option value="${element.project_name.toLowerCase()}">${element.project_name}</option>`;
      }
    });

    // Populate table here...
  })
  .catch(error => {
    console.error("Error fetching user data:", error);
  });

function filterTable() {
  const selectedStatus = projectStatus.value;
  const selectedLeader = projectLeader.value;
  const selectedName = projectName.value;
  const searchValue = filterInput.value.toLowerCase();

  const rows = document.querySelectorAll("#initailbody tr");

  rows.forEach(row => {
    const statusCell = row.querySelector("td:nth-child(7)");
    const leaderCell = row.querySelector("td:nth-child(3)");
    const nameCell = row.querySelector("td:nth-child(2) .mx-3");

    const matchesStatus =
      !selectedStatus || statusCell.textContent.toLowerCase().includes(selectedStatus);
    const matchesLeader =
      !selectedLeader || leaderCell.textContent.toLowerCase().includes(selectedLeader);
    const matchesName =
      !selectedName || nameCell.textContent.toLowerCase().includes(selectedName);
    const matchesSearch =
      !searchValue || row.textContent.toLowerCase().includes(searchValue);

    row.style.display = matchesStatus && matchesLeader && matchesName && matchesSearch ? "" : "none";
  });
}

projectStatus.addEventListener("change", filterTable);
projectLeader.addEventListener("change", filterTable);
projectName.addEventListener("change", filterTable);
filterInput.addEventListener("keyup", filterTable);


window.openModal = openModal;
window.handleDelete = handleDelete;
