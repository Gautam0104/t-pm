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
                            '<i class="ti ti-user ti-md text-info me-2"></i><span class=" me-1">Team Member</span>';
                        break;

                    default:
                        roleText =
                            `<i class="ti ti-user ti-md text-info me-2"></i><span class=" me-1">${user.role_name}</span>`;
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
                };
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
                            <a class="dropdown-item" href="javascript:void(0);"tabindex="0"
                                aria-controls="DataTables_Table_0" type="button" data-bs-toggle="modal" data-bs-target="#pricingModal" onclick="fetchuserhistory(${element.user_id})"><i class="ti ti-eye me-1"></i>
                                View</a>
                            <a class="dropdown-item" href="javascript:void(0);"tabindex="0"
                                aria-controls="DataTables_Table_0" type="button" data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasUpdateUser" onclick="editUser(${element.user_id})"><i class="ti ti-pencil me-1"></i>
                                Edit</a>
                            <a class="dropdown-item" onclick="deleteUser(${element.user_id})" style="cursor:pointer;"><i class="ti ti-trash me-1"></i>
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

// get role
const userRole = async () => {
    return await fetch(`${API_BASE_URL}/GetRoles`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok ");
            }
            return response.json();
        })
        .then(data => {
            const roleSelect = document.getElementById("user-role");
            data.map(role => {
                const roleOption = `
                                <option value="${role.role_id}">${role.role_name}</option>
                                `;
                roleSelect.innerHTML += roleOption;
            });
        });
};
userRole();
// create new user
const registerForm = document.getElementById("addNewUserForm");
const messageDiv = document.getElementById("message");

function showMessage(message, isError = false) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${isError ? "error" : "success"}`;
    messageDiv.style.display = "block";
}

registerForm.addEventListener("click", async e => {
    e.preventDefault();

    const username = document.getElementById("add-user-email").value;
    const password = document.getElementById("add-user-password").value;
    const first_name = document.getElementById("add-user-first-name").value;
    const last_name = document.getElementById("add-user-last-name").value;
    const role_id = document.getElementById("user-role").value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                password,
                first_name,
                last_name,
                role_id
            })
        });
        // const result = await response.text();
        if (response.ok) {
            Swal.fire({
                title: "User created Successfully",
                text: "A new user created successfully.",
                icon: "success",
                confirmButtonText: "Ok!"
            }).then(() => {
                window.location.reload();
            });
            // registerForm.reset();
        } else {
            Swal.fire({
                title: "Oops!",
                text: "something went wrong. Try again!",
                icon: "error",
                confirmButtonText: "Retry!"
            });
        }
    } catch (error) {
        showMessage("Error registering user.", true);
    }
});

const deleteUser = async user_id => {
    //console.log(id);

    try {
        // Send DELETE request to the API
        const response = await fetch(`${API_BASE_URL}/deleteUser/${user_id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            Swal.fire({
                title: "User Deleted Successfully",
                text: "A user is delete from your projects",
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
        console.error(error);
    }
};

const editUser = async user_id => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${user_id}`);
        if (!response.ok) throw new Error("Failed to fetch user details");

        const user = await response.json();

        user.map(ele => {
            const updateUserForm = document.getElementById("update-user");
            const formContent = `
                                <div class="mb-6">
                                    <label class="form-label" for="add-user-fullname">Full Name</label>
                                    <input type="text" class="form-control" id="update-user-first-name" 
                                        name="userFullname" aria-label="John Doe" value="${ele.first_name}" />
                                </div>
                                <div class="mb-6">
                                    <label class="form-label" for="add-user-fullname">Last Name</label>
                                    <input type="text" class="form-control" id="update-user-last-name"
                                        name="userFullname" aria-label="John Doe" value="${ele.last_name}" />
                                </div>
                                <div class="mb-6">
                                    <label class="form-label" for="add-user-email">Username</label>
                                    <input type="text" id="update-user-email" class="form-control" 
                                        aria-label="john.doe@example.com" name="userEmail" value="${ele.username}" />
                                </div>
                                <div class="mb-6">
                                    <label class="form-label" for="user-role">User Role</label>
                                    <select id="update-user-role" class="form-select" name="userRole">
                                        
                                    </select>
                                </div>
                                <button type="button" class="btn btn-primary me-3" data-bs-dismiss="offcanvas" id="updateUserForm">Update User</button>
                                <button type="reset" class="btn btn-label-danger" data-bs-dismiss="offcanvas">Cancel</button>`;

            updateUserForm.innerHTML = formContent;

            fetch(`${API_BASE_URL}/GetRoles`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok ");
                    }
                    return response.json();
                })
                .then(data => {
                    const updateroleSelect = document.getElementById("update-user-role");
                    data.map(role => {
                        const roleOption = `
                                <option value="${role.role_id}">${role.role_name}</option>
                                `;
                        updateroleSelect.innerHTML += roleOption;
                    });
                });

            document
                .getElementById("updateUserForm")
                .addEventListener("click", async e => {
                    e.preventDefault();

                    const userId = ele.user_id;
                    const role_id = document.getElementById("update-user-role").value;
                    const username = document
                        .getElementById("update-user-email")
                        .value.trim();
                    const first_name = document
                        .getElementById("update-user-first-name")
                        .value.trim();
                    const last_name = document
                        .getElementById("update-user-last-name")
                        .value.trim();
                    const messageElement = document.getElementById("message");

                    if (!userId || !role_id || !username) {
                        messageElement.textContent = "Please fill in all required fields.";
                        messageElement.className = "message error";
                        return;
                    }

                    const payload = { role_id, username, first_name, last_name };

                    try {
                        const response = await fetch(
                            `${API_BASE_URL}/updateUser/${userId}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(payload)
                            }
                        );

                        if (response.ok) {
                            Swal.fire({
                                title: "User Updated Successfully",
                                text: "A user is update from your projects",
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
                        messageElement.textContent = "Error connecting to the server.";
                        messageElement.className = "message error";
                        console.error("Error:", error);
                    }
                });
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        const messageElement = document.getElementById("message");
        if (messageElement) {
            messageElement.textContent = "Error fetching user details.";
            messageElement.className = "message error";
        }
    }
};


const fetchuserhistory = async (userId) => {
    // Clear the previous content
    const historytablebody = document.getElementById("role-history-data");
    historytablebody.innerHTML = '';  // Clear any existing rows

    // Fetch role history based on roleId
    await fetch(`${API_BASE_URL}/user-history/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(userHistory => {
            // Loop through each role history entry and append it to the table




            const modifieduserHistory = userHistory.map(user => {

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
                            '<i class="ti ti-user ti-md text-info me-2"></i><span class=" me-1">Team Member</span>';
                        break;

                    default:
                        roleText =
                            `<i class="ti ti-user ti-md text-info me-2"></i><span class=" me-1">${user.role_name}</span>`;
                }

                return {
                    user_id: user.user_id,
                    role_id: roleText,
                    username: user.username,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    updated_at: user.updated_at
                };
            });
            modifieduserHistory.map(userHistory => {
                const isoDateupdate_history = `${userHistory.updated_at}`;

                // Convert to a Date object
                const dateupdate_history = new Date(isoDateupdate_history);

                // Extract date components
                const day1 = dateupdate_history.getDate().toString().padStart(2, "0");
                const month1 = (dateupdate_history.getMonth() + 1)
                    .toString()
                    .padStart(2, "0"); // Months are 0-based
                const year1 = dateupdate_history.getFullYear();

                // Extract time components
                const hours1 = dateupdate_history.getHours().toString().padStart(2, "0");
                const minutes1 = dateupdate_history
                    .getMinutes()
                    .toString()
                    .padStart(2, "0");
                const seconds1 = dateupdate_history
                    .getSeconds()
                    .toString()
                    .padStart(2, "0");

                // Combine date and time
                const formattedDateTimeupdate_history = `${day1}/${month1}/${year1} , ${hours1}:${minutes1}:${seconds1}`;
                // Create table row content
                const historybodyContent = ` 
                           <tr>
                             <td>${userHistory.username}</td>
                             <td>${userHistory.first_name}</td>
                             <td>${userHistory.last_name}</td>
                             <td>${userHistory.role_id}</td>
                             <td>${formattedDateTimeupdate_history}</td>
                           </tr>`;

                // Append the new row to the table body
                historytablebody.innerHTML += historybodyContent;
            })

        })
        .catch(error => {
            console.error("Error fetching role history:", error);
        });
};