// Logout Button Click
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch(`${baseURL}/auth/logout`, {
            method: 'POST'
        });
        if (response.ok) {
            localStorage.removeItem('sessionExpireTime');
            document.getElementById('dashboardMessage').textContent = '';
            document.getElementById('logoutButton').style.display = 'none';
            alert('Logout successful!');
        } else {
            alert('Logout failed!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Check Session Expiration
setInterval(() => {
    const sessionExpireTime = localStorage.getItem('sessionExpireTime');
    if (sessionExpireTime && new Date() > new Date(sessionExpireTime)) {
        // alert('Session expired. Please log in again.');
        localStorage.removeItem('sessionExpireTime');
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

//redirect to projects & ticket name file
function router() {
    window.location.href = "todo.html"
}


// project data

// API Endpoint
const usersapiUrl = 'http://localhost:3000/users';

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
        console.log(data)
    })

    .catch(error => {
        console.error('Error fetching user data:', error);
    });



// API Endpoint
const apiUrl = 'http://localhost:3000/projects';


// Fetch Project Data from API
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.querySelector('#initailbody');
        // tableBody.innerHTML = ''; // Clear existing rows

        // Populate Table Rows with User Data
        data.forEach(element => {

            const row = `
            <tr>
              
              <td></td>
              <td>${element.project_name}</td>
              <td onclick="router()" style="cursor:pointer">${element.project_leader_fname}</td>
              <td>
                    <ul class="list-unstyled m-0 avatar-group d-flex align-items-center">
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                        class="avatar avatar-xs pull-up" title="Lilian Fuller">
                        <img src="../assets/img/avatars/5.png" alt="Avatar" class="rounded-circle" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                        class="avatar avatar-xs pull-up" title="Sophia Wilkerson">
                        <img src="../assets/img/avatars/6.png" alt="Avatar" class="rounded-circle" />
                        </li>
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top"
                        class="avatar avatar-xs pull-up" title="Christina Parker">
                        <img src="../assets/img/avatars/7.png" alt="Avatar" class="rounded-circle" />
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
        //  console.log(data)
    })

    .catch(error => {
        console.error('Error fetching user data:', error);
    });
