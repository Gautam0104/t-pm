// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely


// get tickets


fetch(`${API_BASE_URL}/tickets`)
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
                                                    data-members="Thunder,Thunder">
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
                                                                    href="javascript:void(0)">Delete</a></div>
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
