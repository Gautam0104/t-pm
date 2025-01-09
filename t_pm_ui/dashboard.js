
// Logout Button Click
document.getElementById('logoutButton').addEventListener('click', async () => {
    // try {
    //     const response = await fetch(`${baseURL}/auth/logout`, {
    //         method: 'POST'
    //     });
    //     if (response.ok) {

    //         localStorage.setItem('sessionIs', 'false');
    //         document.getElementById('dashboardMessage').textContent = '';
    //         document.getElementById('logoutButton').style.display = 'none';
    //         alert('Logout successful!');
    //     } else {
    //         alert('Logout failed!');
    //     }
    // } catch (error) {
    //     console.error('Error:', error);
    // }
    localStorage.removeItem('sessionIs');
});

// Check Session Expiration
setInterval(() => {
    const sessionExpireTime = localStorage.getItem('sessionExpireTime');
    if (sessionExpireTime && new Date() > new Date(sessionExpireTime)) {
        // alert('Session expired. Please log in again.');
        localStorage.removeItem('sessionExpireTime');
        localStorage.removeItem('sessionIs');
        // window.location.reload();
        window.location.href = 'auth-login-cover.html';
    }
}, 1000);


// Project table data filter
const filterInput = document.getElementById('filterInput');
const tableBody = document.getElementById('tableBody');

filterInput.addEventListener('keyup', () => {
    const filterValue = filterInput.value.toLowerCase();
    const rows = tableBody.getElementsByTagName('tr');

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (let cell of cells) {
            if (cell.textContent.toLowerCase().includes(filterValue)) {
                match = true;
                break;
            }
        }

        row.style.display = match ? '' : 'none';
    }
});

function openModal() {
    const modalElement = document.getElementById('shareProject');
    const modal = new bootstrap.Modal(modalElement);

    modal.show();
}

//redirect to projects & ticket name file
function router() {
    window.location.href = "todo.html"
}


// project data

// API Endpoint
const usersapiUrl = 'https://advanced-serval-instantly.ngrok-free.app/users';

// Fetch Project Data from API
fetch(usersapiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const listContent = document.querySelector('#list-content');
        // tableBody.innerHTML = ''; // Clear existing rows

        // Populate List Content with User Data
        data.forEach(element => {

            const content = `
                     <li class="d-flex flex-wrap mb-4" >  
                     <div class="avatar me-4">
                        <img src="../assets/img/avatars/1.png" alt="avatar" class="rounded-circle" />
                      </div>
                      <div class="d-flex justify-content-between flex-grow-1">
                        <div class="me-2">
                          <p class="mb-0 text-heading">${element.first_name} <span class="badge bg-label-success me-1">Admin</span></p>
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
        //console.log(data)
    })

    .catch(error => {
        console.error('Error fetching user data:', error);
    });



// API Endpoint
const apiUrl = 'https://advanced-serval-instantly.ngrok-free.app/projects';


// Fetch Project Data from API
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const modifiedResults = data.map(project => {
            let statusText = '';
            switch (project.project_status) {
                case 1:
                    statusText = '<span class="badge bg-label-primary me-1">Active</span>';
                    break;
                case 2:
                    statusText = '<span class="badge bg-label-success me-1">Complete</span>';
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
            return {
                project_id: project.project_id,
                project_name: project.project_name,
                project_Leader_id: project.project_leader_id,
                project_leader_fname: project.first_name,
                project_leader_lname: project.last_name,
                description: project.description,
                status: statusText,
                total_eta: project.total_eta,
                created_at: project.created_at,
                updated_at: project.updated_at
            };
        });
        const tableBody = document.querySelector('#initailbody');
        // tableBody.innerHTML = ''; // Clear existing rows

        // Populate Table Rows with User Data
        modifiedResults.forEach(element => {

            const row = `
            <tr>
              
              <td></td>
              <td>
                <ul class="list-unstyled m-0 avatar-group d-flex align-items-center">
              <li class="avatar avatar-xs pull-up" title="Christina Parker">
                       <img src="../assets/img/icons/dash_icon/active.png"
                              alt="">
                        </li>
              <li class="mx-3">
                        ${element.project_name}
                        </li>
              </ul>
              </td>
              <td onclick="router()" style="cursor:pointer">${element.project_leader_fname}</td>
              <td>
                    <ul class="list-unstyled m-0 avatar-group d-flex align-items-center">
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                        class="avatar avatar-xs pull-up" title="Lilian Fuller">
                        <img src="../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                        class="avatar avatar-xs pull-up" title="Sophia Wilkerson">
                        <img src="../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                        class="avatar avatar-xs pull-up" title="Christina Parker">
                        <img src="../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                        class="avatar avatar-xs pull-up" title="Add team member" onclick="openModal()">
                        <i class="ti ti-plus me-0 me-sm-1 ti-xs border rounded-circle bg-dark"
                            style="color: #fff;"></i>
                        </li>
                    </ul>
               </td>
               <td>${element.total_eta}</td>
               <td>2hour</td>
               <td>${element.status}
               </td>
              
                        <td>
                          <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                              <i class="ti ti-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">
                              <a class="dropdown-item" href="javascript:void(0);"><i class="ti ti-pencil me-1"></i>
                                Edit</a>
                              <a class="dropdown-item" href="javascript:void(0);"><i class="ti ti-trash me-1"></i>
                                Delete</a>
                            </div>
                          </div>
                </td>
            </tr>
          `;
            tableBody.innerHTML += row;

        });
        //console.log(data)
    })

    .catch(error => {
        console.error('Error fetching user data:', error);
    });


const countUrl = 'https://advanced-serval-instantly.ngrok-free.app/projects'
// Fetch and count data active projects and completed tasks
const activeProjectsCountElement = document.getElementById('active-projects-counts');
const completeProjectsCountElement = document.getElementById('complete-projects-counts');
const totalProjectsCountElement = document.getElementById('total-projects-counts');

// Fetch Project Data from API
fetch(countUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Filter projects with "active" status
        const activeProjects = data.filter(project => project.project_status === 1);

        // Update the active projects count in the DOM
        activeProjectsCountElement.textContent = activeProjects.length;

        // Filter projects with "completed" status
        const completeProjects = data.filter(project => project.project_status === 2);

        // Update the completed projects count in the DOM
        completeProjectsCountElement.textContent = completeProjects.length;

        // count total projects and tickets
        const totalProjects = data.filter(project => project.project_id).length;
        totalProjectsCountElement.textContent = totalProjects;
    })
    .catch(error => {
        console.error('Error fetching projects:', error);
        activeProjectsCountElement.textContent = 'Error';
    });



const createprojectURl = 'https://advanced-serval-instantly.ngrok-free.app'
const createProject = async () => {
    const project_name = document.getElementById('project-name').value;
    const project_leader_id = 1;
    const description = document.getElementById('project-des').value;
    const status = document.getElementById('project-status').value;
    const total_eta = document.getElementById('project-eta').value;


    try {
        const response = await fetch(`${createprojectURl}/project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ project_name, project_leader_id, description, status, total_eta }),
        });

        // const data = await response.json();

        if (response.ok) {

            Swal.fire({
                title: 'Project created Successfully',
                text: 'A new project created',
                icon: 'success',
                confirmButtonText: 'Ok!'
            }).then(function () {
                // Redirect to dashboard.html
                window.location.href = 'dashboard.html';
            })


        } else {
            // messageElement.style.color = 'red';
            Swal.fire({
                title: 'Oops!',
                text: 'something went wrong. Try again!',
                icon: 'error',
                confirmButtonText: 'Retry!'
            });

        }
    } catch (error) {
        messageElement.style.color = 'red';
        // messageElement.textContent = 'An error occurred.';
        console.error(error);
    }

}