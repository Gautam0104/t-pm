// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely


// get tickets
var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
var creator_id = urlParams.get("user_id");
console.log(project_id);

fetch(`${API_BASE_URL}/ticket/${project_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.map(element => {
            const cardItem = document.getElementById('todo-task');
            const cardContent = `                                                <div class="kanban-item" data-eid="in-progress-1" data-comments="12"
                                                    data-badge-text="UX" data-badge="success" data-due-date="5 April"
                                                    data-attachments="4" data-assigned="1.png,1.png"
                                                    data-members="Thunder,Thunder" onclick="openCanvase(${element.ticket_id})">
                                                    <div
                                                        class="d-flex justify-content-between flex-wrap align-items-center mb-2">
                                                        <div class="item-badges">
                                                            <div class="badge bg-label-success"> UX</div>
                                                        </div>
                                                        <div class="dropdown kanban-tasks-item-dropdown"><i
                                                                class="dropdown-toggle ti ti-dots-vertical"
                                                                id="kanban-tasks-item-dropdown"
                                                                data-bs-toggle="dropdown" aria-haspopup="true"
                                                                aria-expanded="false"></i>
                                                            <div class="dropdown-menu dropdown-menu-end"
                                                                aria-labelledby="kanban-tasks-item-dropdown"><a
                                                                    class="dropdown-item waves-effect"
                                                                    href="javascript:void(0)">Copy
                                                                    task link</a><a class="dropdown-item waves-effect"
                                                                    href="javascript:void(0)">Duplicate task</a><a
                                                                    class="dropdown-item delete-task waves-effect"
                                                                    onclick="handleDelete(${element.ticket_id})">Delete</a></div>
                                                        </div>
                                                    </div><span class="kanban-text">${element.title}</span>
                                                    <div
                                                        class="d-flex justify-content-between align-items-center flex-wrap mt-2">
                                                        <div class="d-flex"> <span
                                                                class="d-flex align-items-center me-2"><i
                                                                    class="ti ti-paperclip me-1"></i><span
                                                                    class="attachments">4</span></span> <span
                                                                class="d-flex align-items-center ms-2"><i
                                                                    class="ti ti-message-2 me-1"></i><span> 12
                                                                </span></span></div>
                                                        <div
                                                            class="avatar-group d-flex align-items-center assigned-avatar">
                                                            <div class="avatar avatar-xs" data-bs-toggle="tooltip"
                                                                data-bs-placement="top" aria-label="Thunder" 
                                                                data-bs-original-title="Thunder"><img
                                                                    src="../assets/img/avatars/1.png" alt="Avatar"
                                                                    class="rounded-circle  pull-up"></div>
                                                            <div class="avatar avatar-xs" data-bs-toggle="tooltip"
                                                                data-bs-placement="top" aria-label="Thunder"
                                                                data-bs-original-title="Thunder"><img
                                                                    src="../assets/img/avatars/1.png" alt="Avatar"
                                                                    class="rounded-circle  pull-up"></div>
                                                        </div>
                                                    </div>
                                                </div>  
                               `;

            cardItem.innerHTML += cardContent;
        })

    })
// Get query parameters from the URL
// const urlParams = new URLSearchParams(window.location.search);
// const project_id = urlParams.get("id");



const openCanvase = (ticket_id) => {
    console.log(ticket_id);
    const offcanvas = document.querySelector('.offcanvas');
    const backdropWrapper = document.getElementById('backdrop');
    offcanvas.classList.add('show');




    const backdropContent = `<div class="offcanvas-backdrop fade show"></div>`;
    backdropWrapper.innerHTML = backdropContent;

    // Fetch Ticket Data from API
    fetch(`${API_BASE_URL}/ticketbyid/${ticket_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            data.map(element => {
                const ticketForm = document.getElementById('ticket-form');
                const formContent = `<div class="mb-5">
                                  <label class="form-label" for="title">Title</label>
                                  <input type="text" id="ticket-title" class="form-control" placeholder="Enter Title" value="${element.title}">
                                </div>
                                <div class="mb-5">
                                  <label class="form-label" for="due-date">Due Date</label>
                                  <input type="hidden" id="due-date" class="form-control flatpickr-input" placeholder="Enter Due Date"><input class="form-control form-control input" placeholder="Enter Due Date" tabindex="0" type="text" readonly="readonly">
                                </div>
                                <div class="mb-5">
                                  <label class="form-label" for="label"> Label</label>
                                  <div class="position-relative">
                                  <select class="form-control" id="label" data-select2-id="label" tabindex="-1" aria-hidden="true">
                                    <option>UX</option>
                                    <option>Images</option>
                                    <option>Info</option>
                                    <option>Code Review</option>
                                    <option>App</option>
                                    <option>Charts &amp; Maps</option>
                                  </select>
                                 
                                  </div>
                                </div>
                                <div class="mb-5">
                                  <label class="form-label">Assigned</label>
                                  <div class="assigned d-flex flex-wrap"><div class="avatar avatar-xs me-1" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Thunder" data-bs-original-title="Thunder"><img src="../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle "></div> <div class="avatar avatar-xs" data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Thunder" data-bs-original-title="Thunder"><img src="../assets/img/avatars/1.png" alt="Avatar" class="rounded-circle "></div><div class="avatar avatar-xs ms-1"><span class="avatar-initial rounded-circle bg-label-secondary"><i class="ti ti-plus ti-xs text-heading"></i></span></div></div>
                                </div>
                                <div class="mb-5">
                                  <label class="form-label" for="attachments">Attachments</label>
                                  <div>
                                    <input type="file" class="form-control" id="attachments">
                                  </div>
                                </div>
                                <div class="mb-5">
                                  <label class="form-label">Description</label>
                                  <textarea class="form-control" name="" id="">${element.description}</textarea>
                                </div>
                                <div>
                                  <div class="d-flex flex-wrap">
                                    <button type="button" class="btn btn-primary me-4 waves-effect waves-light" data-bs-dismiss="offcanvas" onclick="handleUpdate(${element.ticket_id})">
                                      Update
                                    </button> 
                                    <button type="button" class="btn btn-label-danger waves-effect" data-bs-dismiss="offcanvas" onclick="handleDelete(${element.ticket_id})">
                                      Delete
                                    </button>
                                  </div>
                                </div>`;

                ticketForm.innerHTML = formContent;
            })


        });
}

const handleUpdate = async (ticket_id) => {
    const title = document.getElementById('ticket-title').value;
    const description = "this is discription";
    const status = "Backlog";
    const priority = "Medium";
    const created_by = creator_id;
    const due_date = "2025-01-13"


    try {
        const response = await fetch(`${API_BASE_URL}/updateticket/${ticket_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id,
                title,
                description,
                status,
                priority,
                created_by,
                due_date


            }),
        });
        if (response.ok) {
            const offcanvas = document.querySelector('.offcanvas');
            const backdropWrapper = document.getElementById('backdrop');
            offcanvas.classList.remove('show');
            backdropWrapper.innerHTML = '';
            console.log('ticket updated successfully')
            window.location.reload();
        }
    }
    catch (error) {
        console.log('error', error);

    }
}

//Delete Ticket

const handleDelete = async (ticket_id) => {
    console.log('Project id is : ' + ticket_id);
    // if (!recordId) {
    //     messageDiv.textContent = 'Please enter a valid ID.';
    //     messageDiv.className = 'message error';
    //     return;
    // }

    try {
        // Send DELETE request to the API
        const response = await fetch(`${API_BASE_URL}/deleteticket/${ticket_id}`, {
            method: 'DELETE',
        });
        window.location.reload();
        // Parse the response
        // const data = await response.json();

        if (response.ok) {

            Swal.fire({
                title: "Ticket Deleted Successfully",
                text: "A Ticket is delete from your tickets",
                icon: "success",
                confirmButtonText: "Ok!",
            })
        } else {
            Swal.fire({
                title: "Oops!",
                text: "something went wrong. Try again!",
                icon: "error",
                confirmButtonText: "Retry!",
            });
        }
    } catch (error) {
        console.error(error);
        // messageDiv.textContent = 'Could not connect to the server.';
        // messageDiv.className = 'message error';
    }

}

const closeCanvase = () => {
    const offcanvas = document.querySelector('.offcanvas');
    const backdropWrapper = document.getElementById('backdrop');
    offcanvas.classList.remove('show');
    backdropWrapper.innerHTML = '';
}
