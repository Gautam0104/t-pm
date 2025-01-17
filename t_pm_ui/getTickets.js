// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely
function test() {
    console.log("test is working");
    // get tickets
}

var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
var creator_id = urlParams.get("user_id");
console.log(project_id);

fetch(`${API_BASE_URL}/project/${project_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const projectTitle = document.getElementById("project-title");
        const titleContent = `<input type="text" class="form-control" value = "${data.project_name}">`;

        projectTitle.innerHTML += titleContent;
    });
// Function to fetch and create elements
function fetchDataAndCreateElements() {
    return fetch(`${API_BASE_URL}/ticket/${project_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            data.forEach(element => {
                const cardItem = document.getElementById("todo-task");
                const cardItem2 = document.getElementById("inprogress-task");
                const cardItem3 = document.getElementById("for-approval-task");
                const cardItem4 = document.getElementById("rejected-task");
                const cardItem5 = document.getElementById("approved-task");

                // Create kanban card dynamically
                const card = document.createElement("div");
                card.className = `kanban-item dragg-from-todo ${element.ticket_id}`;
                card.draggable = true;
                card.id = `${element.ticket_id}`



                // Add card content
                card.innerHTML = `
                    <div class="d-flex justify-content-between ${element.ticket_id} flex-wrap align-items-center mb-2">
                    <div class="item-badges">
                        <div class="badge bg-label-success">${element.badge ||
                    "UX"}</div>
                    </div>
                    <div class="dropdown kanban-tasks-item-dropdown">
                        <i class="dropdown-toggle ti ti-dots-vertical" id="kanban-tasks-item-dropdown" 
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
                        <div class="dropdown-menu dropdown-menu-end" 
                            aria-labelledby="kanban-tasks-item-dropdown">
                            <a class="dropdown-item waves-effect" href="javascript:void(0)">Copy task link</a>
                            <a class="dropdown-item waves-effect" href="javascript:void(0)">Duplicate task</a>
                            <a class="dropdown-item delete-task waves-effect" href="javascript:void(0)">Delete</a>
                        </div>
                    </div>
                </div>
                <span class="kanban-text" >${element.title}</span>
                <div class="d-flex justify-content-between align-items-center flex-wrap mt-2" >
                    <div class="d-flex">
                        <span class="d-flex align-items-center me-2">
                            <i class="ti ti-paperclip me-1"></i>
                            <span class="attachments">${element.attachments ||
                    "0"}</span>
                        </span>
                        <span class="d-flex align-items-center ms-2">
                            <i class="ti ti-message-2 me-1"></i>
                            <span>${element.comments || "0"}</span>
                        </span>
                    </div>
                    <div class="avatar-group d-flex align-items-center assigned-avatar">
                        <div class="avatar avatar-xs" data-bs-toggle="tooltip" 
                            data-bs-placement="top" aria-label="Thunder" data-bs-original-title="Thunder">
                            <img src="../assets/img/avatars/1.png" alt="Avatar" 
                                class="rounded-circle pull-up">
                        </div>
                        <div class="avatar avatar-xs" data-bs-toggle="tooltip" 
                            data-bs-placement="top" aria-label="Thunder" data-bs-original-title="Thunder">
                            <img src="../assets/img/avatars/1.png" alt="Avatar" 
                                class="rounded-circle pull-up">
                        </div>
                    </div>
                </div>
                `;

                // Append card to the container
                switch (element.ticket_status) {
                    case "todo":
                        cardItem.appendChild(card);
                        break;
                    case "inprogress":
                        cardItem2.appendChild(card);
                        break;
                    case "for-approval":
                        cardItem3.appendChild(card);
                        break;
                    case "approved":
                        cardItem5.appendChild(card);
                        break;
                    case "rejected":
                        cardItem4.appendChild(card);
                        break;
                    default:
                        cardItem.appendChild(card);
                }
            });

            return document.querySelectorAll(".dragg-from-todo"); // Return the elements
        });
}

// Call the function and use the returned elements
fetchDataAndCreateElements()
    .then(trydraggElements => {
        const todoTask = document.getElementById("todo-task");
        const inprogressTask = document.getElementById("inprogress-task");
        const forApprovalTask = document.getElementById("for-approval-task");
        const rejectedTask = document.getElementById("rejected-task");
        const approvedTask = document.getElementById("approved-task");

        console.log("trydragg elements outside fetch:", trydraggElements);
        // Perform actions on the elements here
        trydraggElements.forEach(element => {
            element.addEventListener("click", function (e) {
                const offcanvas = document.querySelector(".offcanvas");
                // const backdropWrapper = document.getElementById("backdrop");
                offcanvas.classList.add("show");

                const backdropContent = `<div class="offcanvas-backdrop fade show"></div>`;
                // backdropWrapper.innerHTML = backdropContent;
                let selected = e.currentTarget.id;
                let ticket_id = selected
                console.log(e.currentTarget.id);
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
                            const offcanvasDiv = document.getElementById("offcanvas-div");
                            const offcanvasContent = `<div class="offcanvas-header border-bottom">
                                        <h5 class="offcanvas-title">Edit Task</h5>
                                        <button type="button" class="btn-close" id="offcanvase-close"
                                             aria-label="Close"></button>
                                    </div>
                                    <div class="offcanvas-body pt-0">
                                        <div class="nav-align-top">
                                            <ul class="nav nav-tabs mb-5 rounded-0" role="tablist">
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link active waves-effect" data-bs-toggle="tab"
                                                        data-bs-target="#tab-update" aria-selected="true" role="tab">
                                                        <i class="ti ti-edit ti-18px me-1_5"></i>
                                                        <span class="align-middle">Edit</span>
                                                    </button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link waves-effect" data-bs-toggle="tab"
                                                        data-bs-target="#tab-activity" aria-selected="false"
                                                        tabindex="-1" role="tab">
                                                        <i class="ti ti-chart-pie-2 ti-18px me-1_5"></i>
                                                        <span class="align-middle">Activity</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="tab-content p-0">
                                            <!-- Update item/tasks -->
                                            <div class="tab-pane fade show active" id="tab-update" role="tabpanel">
                                                <form id="ticket-form">
                                                    <div class="mb-5">
                                                        <label class="form-label" for="title">Title</label>
                                                        <textarea id="ticket-title" class="form-control" placeholder="Enter Title">${element.title}</textarea>

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
                                                        <textarea class="form-control" name="" id="ticket-description">${element.description}</textarea>
                                                      </div>
                                                      <div>
                                                        <div class="d-flex flex-wrap">
                                                          <button type="button" class="btn btn-primary me-4 waves-effect waves-light" data-bs-dismiss="offcanvas" id="update-button" >
                                                            Update
                                                          </button> 
                                                          <button type="button" class="btn btn-label-danger waves-effect"  id="delete-ticket">
                                                            Delete
                                                          </button>
                                                        </div>
                                                      </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>`;

                            offcanvasDiv.innerHTML = offcanvasContent;

                            const updateButton = document.getElementById('update-button');
                            const closeButton = document.getElementById('offcanvase-close');
                            const deleteButton = document.getElementById('delete-ticket')
                            //console.log(updateButton);
                            closeButton.addEventListener("click", function () {
                                selected = null;
                                console.log('selected is null now');
                                const offcanvas = document.querySelector(".offcanvas");
                                // const backdropWrapper = document.getElementById("backdrop");
                                offcanvas.classList.remove("show");
                                // backdropWrapper.innerHTML = "";
                            })
                            updateButton.addEventListener("click", async function () {

                                const ticketId = element.ticket_id;
                                const ticketTitle = document.getElementById('ticket-title').value;


                                const ticketDescription = document.getElementById('ticket-description').value;
                                //console.log(description);

                                const statusT = element.status;
                                const ticketPriority = element.priority
                                const ticketStatus = element.ticket_status;
                                // Check for undefined or empty values before sending the request
                                if (!ticketId || !ticketTitle || !ticketDescription || !statusT || !ticketPriority || !ticketStatus) {
                                    console.log("Ticket ID or Status is missing");
                                    return; // You could show an alert or handle the error here
                                }
                                fetch(`${API_BASE_URL}/updateticket`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        ticket_id: ticketId,
                                        title: ticketTitle,
                                        description: ticketDescription,
                                        status: statusT,
                                        priority: ticketPriority,
                                        ticket_status: ticketStatus
                                    })
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log("Success:", data);
                                        Swal.fire({
                                            title: "Ticket Updated Successfully",
                                            text: "A Ticket is update from your tickets",
                                            icon: "success",
                                            confirmButtonText: "Ok!"
                                        }).then(function () {
                                            window.location.reload();
                                        });
                                    })
                                    .catch(error => console.error("Error:", error));
                            })
                            console.log(deleteButton);

                            deleteButton.addEventListener("click", async function () {
                                // console.log("deleteButtonworking");
                                const ticket_id = element.ticket_id;
                                console.log("Project id is : " + ticket_id);
                                // if (!recordId) {
                                //     messageDiv.textContent = 'Please enter a valid ID.';
                                //     messageDiv.className = 'message error';
                                //     return;
                                // }

                                try {
                                    // Send DELETE request to the API
                                    const response = await fetch(`${API_BASE_URL}/deleteticket/${ticket_id}`, {
                                        method: "DELETE"
                                    });

                                    // Parse the response
                                    // const data = await response.json();

                                    if (response.ok) {
                                        Swal.fire({
                                            title: "Ticket Deleted Successfully",
                                            text: "A Ticket is delete from your tickets",
                                            icon: "success",
                                            confirmButtonText: "Ok!"
                                        }).then(function () {
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
                                    // messageDiv.textContent = 'Could not connect to the server.';
                                    // messageDiv.className = 'message error';
                                }

                            })
                        });
                    });


            });




            element.addEventListener("dragstart", e => {
                let selected = e.target;
                //console.log(selected.classList[2]);
                let ticket_id = selected.classList[2];
                // console.log(ticket_id);
                // let selectedData = [];
                function fetchselectedData() {
                    return fetch(`${API_BASE_URL}/ticketbyid/${ticket_id}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(
                                    "Network response was not ok " + response.statusText
                                );
                            }
                            return response.json();
                        })
                        .then(data => {
                            let selectedData = data[0];
                            return selectedData;
                        });
                }

                inprogressTask.addEventListener("dragover", function (e) {
                    e.preventDefault();
                    const contentInprogress = document.getElementById('content-inprogress');
                    contentDiv.style.opacity = "1";



                });
                forApprovalTask.addEventListener("dragover", function (e) {
                    e.preventDefault();
                    const contentApproval = document.getElementById('content-approval');
                    contentApproval.style.opacity = "1";


                });
                rejectedTask.addEventListener("dragover", function (e) {
                    e.preventDefault();
                    const contentRejected = document.getElementById('content-rejected');
                    contentRejected.style.opacity = "1";


                });
                approvedTask.addEventListener("dragover", function (e) {
                    e.preventDefault();
                    const contentApproved = document.getElementById('content-approved');
                    contentApproved.style.opacity = "1";


                });
                inprogressTask.addEventListener("drop", function (e) {
                    e.preventDefault();
                    inprogressTask.appendChild(selected);
                    selected.classList.remove("dragg-from-todo");
                    selected.classList.add("dragg-from-inprogress");
                    fetchselectedData()
                        .then(selectedData => {
                            const ticketId = selectedData.ticket_id;
                            const ticketStatus = "inprogress";

                            // Check for undefined or empty values before sending the request
                            if (!ticketId || !ticketStatus) {
                                console.log("Ticket ID or Status is missing");
                                return; // You could show an alert or handle the error here
                            }

                            fetch(`${API_BASE_URL}/updateticketStatus`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    ticket_id: ticketId,
                                    ticket_status: ticketStatus
                                })
                            })
                                .then(response => response.json())
                                .then(data => console.log("Success:", data))
                                .catch(error => console.error("Error:", error));
                        })
                        .catch(error => console.error("Error:", error));

                    selected = null;
                    const contentInprogress = document.getElementById('content-inprogress');
                    contentDiv.style.opacity = "0";
                });
                todoTask.addEventListener("drop", function (e) {
                    e.preventDefault();
                    todoTask.appendChild(selected);
                    selected.classList.remove("dragg-from-inprogress");
                    selected.classList.add("dragg-from-todo");
                    fetchselectedData()
                        .then(selectedData => {
                            const ticketId = selectedData.ticket_id;
                            const ticketStatus = "todo";

                            // Check for undefined or empty values before sending the request
                            if (!ticketId || !ticketStatus) {
                                console.log("Ticket ID or Status is missing");
                                return; // You could show an alert or handle the error here
                            }

                            fetch(`${API_BASE_URL}/updateticketStatus`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    ticket_id: ticketId,
                                    ticket_status: ticketStatus
                                })
                            })
                                .then(response => response.json())
                                .then(data => console.log("Success:", data))
                                .catch(error => console.error("Error:", error));
                        })
                        .catch(error => console.error("Error:", error));

                    selected = null;
                    const contentInprogress = document.getElementById('content-inprogress');
                    contentDiv.style.opacity = "0";
                });
                forApprovalTask.addEventListener("drop", function (e) {
                    e.preventDefault();
                    forApprovalTask.appendChild(selected);
                    fetchselectedData()
                        .then(selectedData => {
                            const ticketId = selectedData.ticket_id;
                            const ticketStatus = "for-approval";

                            // Check for undefined or empty values before sending the request
                            if (!ticketId || !ticketStatus) {
                                console.log("Ticket ID or Status is missing");
                                return; // You could show an alert or handle the error here
                            }

                            fetch(`${API_BASE_URL}/updateticketStatus`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    ticket_id: ticketId,
                                    ticket_status: ticketStatus
                                })
                            })
                                .then(response => response.json())
                                .then(data => console.log("Success:", data))
                                .catch(error => console.error("Error:", error));
                        })
                        .catch(error => console.error("Error:", error));
                    selected = null;
                    const contentApproval = document.getElementById('content-approval');
                    contentApproval.style.opacity = "1";
                });
                rejectedTask.addEventListener("drop", function (e) {
                    e.preventDefault();
                    rejectedTask.appendChild(selected);
                    fetchselectedData()
                        .then(selectedData => {
                            const ticketId = selectedData.ticket_id;
                            const ticketStatus = "rejected";

                            // Check for undefined or empty values before sending the request
                            if (!ticketId || !ticketStatus) {
                                console.log("Ticket ID or Status is missing");
                                return; // You could show an alert or handle the error here
                            }

                            fetch(`${API_BASE_URL}/updateticketStatus`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    ticket_id: ticketId,
                                    ticket_status: ticketStatus
                                })
                            })
                                .then(response => response.json())
                                .then(data => console.log("Success:", data))
                                .catch(error => console.error("Error:", error));
                        })
                        .catch(error => console.error("Error:", error));
                    selected = null;
                    const contentRejected = document.getElementById('content-rejected');
                    contentRejected.style.opacity = "1";
                });
                approvedTask.addEventListener("drop", function (e) {
                    e.preventDefault();
                    approvedTask.appendChild(selected);
                    fetchselectedData()
                        .then(selectedData => {
                            const ticketId = selectedData.ticket_id;
                            const ticketStatus = "approved";

                            // Check for undefined or empty values before sending the request
                            if (!ticketId || !ticketStatus) {
                                console.log("Ticket ID or Status is missing");
                                return; // You could show an alert or handle the error here
                            }

                            fetch(`${API_BASE_URL}/updateticketStatus`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    ticket_id: ticketId,
                                    ticket_status: ticketStatus
                                })
                            })
                                .then(response => response.json())
                                .then(data => console.log("Success:", data))
                                .catch(error => console.error("Error:", error));
                        })
                        .catch(error => console.error("Error:", error));
                    selected = null;
                    const contentApproved = document.getElementById('content-approved');
                    contentApproved.style.opacity = "1";
                });
            });
        });
    })
    .catch(error => console.error("Error:", error));
// Log all elements with class "try" after a delay
// let todoCardItems = [];
// setTimeout(() => {
//     const dragElements = document.querySelectorAll('.trydragg');
//     for (const dragElement of dragElements) {

//         let todoCardItems = dragElement;
//         return todoCardItems

//     }
// }, 500); // Adjust delay if necessary

// console.log(todoCardItems);

// console.log(todoCardItems);

for (const todoItem of todoCardItems) {
    console.log(todoItem);

    todoItem.addEventListener("dragstart", function (e) {
        // Corrected typo here
        let selected = e.target;
        console.log(todoItem);

        inprogressTask.addEventListener("dragover", function (e) {
            e.preventDefault();
        });
        inprogressTask.addEventListener("drop", function (e) {
            inprogressTask.appendChild(selected);
        });
    });
}
// Function to make an element draggable
function makeDraggable(element) {
    element.setAttribute("draggable", "true");

    // Add dragstart event
    element.addEventListener("dragstart", event => {
        event.dataTransfer.setData("text/plain", element.id); // Set the id of the dragged element
        element.classList.add("dragging");
    });

    // Add dragend event
    element.addEventListener("dragend", () => {
        element.classList.remove("dragging");
    });
}

const containers = document.querySelectorAll(".kanban-container");

containers.forEach(container => {
    container.addEventListener("dragover", event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move"; // Show move cursor
        const draggingElement = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(container, event.clientY);

        if (afterElement == null) {
            container.appendChild(draggingElement);
        } else {
            container.insertBefore(draggingElement, afterElement);
        }
    });

    container.addEventListener("drop", event => {
        event.preventDefault();
        const cardId = event.dataTransfer.getData("text/plain");
        const draggedElement = document.querySelector(`[data-eid='${cardId}']`);
        container.appendChild(draggedElement); // Append card to the drop container
    });
});

// Helper function to find the correct position for the dragged item
function getDragAfterElement(container, y) {
    const draggableElements = [
        ...container.querySelectorAll(".kanban-item:not(.dragging)")
    ];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}
// Get query parameters from the URL
// const urlParams = new URLSearchParams(window.location.search);
// const project_id = urlParams.get("id");

const openCanvase = (ticket_id) => {
    console.log(ticket_id);
    const offcanvas = document.querySelector(".offcanvas");
    const backdropWrapper = document.getElementById("backdrop");
    offcanvas.classList.add("show");

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
                const ticketForm = document.getElementById("ticket-form");
                const formContent = `<div class="mb-5">
                                  <label class="form-label" for="title">Title</label>
                                  <textarea id="ticket-title" class="form-control" placeholder="Enter Title">${element.title}</textarea>

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
            });
        });
};

const handleUpdate = async ticket_id => {
    const title = document.getElementById("ticket-title").value;
    const description = "this is discription";
    const status = "Backlog";
    const priority = "Medium";
    const created_by = creator_id;
    const due_date = "2025-01-13";

    try {
        const response = await fetch(`${API_BASE_URL}/updateticket/${ticket_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                project_id,
                title,
                description,
                status,
                priority,
                created_by,
                due_date
            })
        });
        if (response.ok) {
            const offcanvas = document.querySelector(".offcanvas");
            const backdropWrapper = document.getElementById("backdrop");
            offcanvas.classList.remove("show");
            backdropWrapper.innerHTML = "";
            console.log("ticket updated successfully");
            window.location.reload();
        }
    } catch (error) {
        console.log("error", error);
    }
};

//Delete Ticket

const handleDelete = async ticket_id => {
    console.log("Project id is : " + ticket_id);
    // if (!recordId) {
    //     messageDiv.textContent = 'Please enter a valid ID.';
    //     messageDiv.className = 'message error';
    //     return;
    // }

    try {
        // Send DELETE request to the API
        const response = await fetch(`${API_BASE_URL}/deleteticket/${ticket_id}`, {
            method: "DELETE"
        });
        window.location.reload();
        // Parse the response
        // const data = await response.json();

        if (response.ok) {
            Swal.fire({
                title: "Ticket Deleted Successfully",
                text: "A Ticket is delete from your tickets",
                icon: "success",
                confirmButtonText: "Ok!"
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
        // messageDiv.textContent = 'Could not connect to the server.';
        // messageDiv.className = 'message error';
    }
};

const closeCanvase = () => {
    const offcanvas = document.querySelector(".offcanvas");
    // const backdropWrapper = document.getElementById("backdrop");
    offcanvas.classList.remove("show");
    // backdropWrapper.innerHTML = "";
};
