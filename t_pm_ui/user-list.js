// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely

// user list

const userData = async () => {
    return await fetch(`${API_BASE_URL}/users`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok ");
            }
            return response.json();
        })
        .then(users => {
            //console.log(users);
            const tbody = document.getElementById("user-tbody");
            const modifiedResults = users.map(user => {
                console.log(user);

                let statusText = "";
                switch (user.user_status) {
                    case 1:
                        statusText =
                            '<span class="badge bg-label-success me-1">Active</span>';
                        break;
                    case 2:
                        statusText =
                            '<span class="badge bg-label-secondary me-1">Inactive</span>';
                        break;
                    case 3:
                        statusText =
                            '<span class="badge bg-label-warning me-1">Pending</span>';
                        break;
                    default:
                        statusText =
                            '<span class="badge bg-label-danger me-1">Unknown</span>';
                }
                let roleText = "";
                switch (user.role_id) {
                    case 1:
                        roleText =
                            '<i class="ti ti-user ti-md text-success me-2"></i><span class=" me-1">Admin</span>';
                        break;
                    case 2:
                        roleText =
                            '<i class="ti ti-user ti-md text-secondary me-2"></i><span class=" me-1">Project Manager</span>';
                        break;
                    case 3:
                        roleText =
                            '<i class="ti ti-user ti-md text-info me-2"></i><span class=" me-1">Team Membar</span>';
                        break;
                    default:
                        roleText =
                            '<i class="ti ti-user ti-md text-danger me-2"></i><span class=" me-1">Unknown</span>';
                }

                return {
                    user_id: user.user_id,
                    role_id: roleText,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    user_status: statusText,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
            });
            console.log(modifiedResults);

            modifiedResults.map(element => {
                const row = ` 
                         
                <tr>
                    <td><input type="checkbox" class="form-check-input"></td>
                    <td><div class="d-flex justify-content-start align-items-center user-name">
                    <div class="avatar-wrapper"><div class="avatar avatar-sm me-4">
                    <img src="../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle">
                    </div>
                    </div>
                    <div class="d-flex flex-column">
                    <a href="app-user-view-account.html" class="text-heading text-truncate">
                    <span class="fw-medium">${element.first_name} ${element.last_name}</span>
                    </a>
                    <small>${element.username}</small>
                    </div>
                    </div>
                    </td>
                    <td>${element.role_id}</td>
                    <td>Plan</td>
                    <td>Billing</td>
                    <td>${element.user_status}</td>
                    <td>
                        <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                            <i class="ti ti-dots-vertical"></i>
                            </button>
                            <div class="dropdown-menu">
                            <a class="dropdown-item" href="javascript:void(0);"><i class="ti ti-pencil me-1"></i>
                                Edit</a>
                            <a class="dropdown-item"><i class="ti ti-trash me-1"></i>
                                Delete</a>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
                tbody.innerHTML += row;
            });
        });
};

userData();

// Project table data filter
const filterInput = document.getElementById("filterInput");
const tableBody = document.getElementById("user-tbody");

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

// create new user
const registerForm = document.getElementById('addNewUserForm');
const messageDiv = document.getElementById('message');


function showMessage(message, isError = false) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.style.display = 'block';
}

registerForm.addEventListener('click', async (e) => {
    e.preventDefault();

    const username = document.getElementById('add-user-email').value;
    const password = document.getElementById('add-user-password').value;
    const first_name = document.getElementById('add-user-first-name').value;
    const last_name = document.getElementById('add-user-last-name').value;
    const role_id = document.getElementById('user-role').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, first_name, last_name, role_id }),
        });
        // const result = await response.text();
        if (response.ok) {
            Swal.fire({
                title: "User created Successfully",
                text: "A new user created successfully.",
                icon: "success",
                confirmButtonText: "Ok!",
            })
            registerForm.reset();
        } else {
            // showMessage(result, true);
        }
    } catch (error) {
        showMessage('Error registering user.', true);
    }
});;
