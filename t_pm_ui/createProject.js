function closeModal() {
    $('#modalCenter').modal('hide');
}
// Create Project

document
    .getElementById("createProjectorTicket")
    .addEventListener("submit", async function (e) {
        // Prevent form submission
        e.preventDefault();

        // Clear previous errors
        document.getElementById("nameError").textContent = "";
        // document.getElementById('statusError').textContent = '';
        // document.getElementById('etaError').textContent = '';
        document.getElementById("descriptionError").textContent = "";

        // Validate form fields
        let isValid = true;

        const project_name = document.getElementById("project-name").value.trim();
        const project_type = document.querySelector('input[name="type"]:checked').value;
        const project_leader_id = 12;
        const status = document.getElementById("project-status").value;
        const total_eta = document.getElementById("project-eta").value;
        const description = document.getElementById("project-des").value.trim();



        if (project_name === "") {
            document.getElementById("nameError").textContent =
                "Project/Ticket Name is required.";
            isValid = false;

        }
        // if (status === '') {
        //     document.getElementById('statusError').textContent = 'Project Status is required.';
        //     isValid = false;
        // }
        // if (total_eta === '') {
        //     document.getElementById('etadError').textContent = 'Total ETA is required.';
        //     isValid = false;
        // }
        if (description === "") {
            document.getElementById("descriptionError").textContent =
                "Project Description is required.";
            isValid = false;

        }

        if (isValid) {
            // alert(project_name + "" + selected_type);
            // Add logic to submit the form data here
            try {
                const response = await fetch(`${API_BASE_URL}/project`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        project_name,
                        project_leader_id,
                        description,
                        status,
                        project_type,
                        total_eta,
                    }),
                });

                // const data = await response.json();

                if (response.ok) {
                    closeModal();
                    Swal.fire({
                        title: "Project created Successfully",
                        text: "A new project created",
                        icon: "success",
                        confirmButtonText: "Ok!",
                    }).then(function () {
                        // Redirect to dashboard.html
                        window.location.href = "dashboard.html";
                    });
                } else {
                    // messageElement.style.color = 'red';
                    Swal.fire({
                        title: "Oops!",
                        text: "something went wrong. Try again!",
                        icon: "error",
                        confirmButtonText: "Retry!",
                    });
                }
            } catch (error) {
                messageElement.style.color = "red";
                // messageElement.textContent = 'An error occurred.';
                console.error(error);
            }
        }
    });



const editProject = async (project_id) => {
    await fetch(`${API_BASE_URL}/project/${project_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok ");
            }
            return response.json();

        })
        .then(project => {
            console.log();
            const updatemodal = document.getElementById("update-project-modal");
            const modalContent = `       <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title" id="modalCenterTitle">Update Project</h5>
                                                        <form id="update-project">
                                                        <div class="checkbox">
                                                            <div class="row " style="margin-left: 200px;">
                                                            <div class="col">
                                                                <label class="form-check m-0">
                                                                <input type="radio" name="type" class="form-check-input" value="project" checked />
                                                                <span class="form-check-label">Project</span>
                                                                </label>
                                                            </div>
                                                            <div class="col">
                                                                <label class="form-check m-0">
                                                                <input type="radio" name="type" class="form-check-input" value="ticket" />
                                                                <span class="form-check-label">Ticket</span>
                                                                </label>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="row">
                                                        <div class="col mb-4">
                                                            <label for="nameWithTitle" class="form-label">Project/Ticket Name</label>
                                                            <input type="text" class="form-control" placeholder="Enter Name" id="project-name" value="${project.project_name}" />
                                                            <div class="error" id="nameError"></div>
                                                        </div>
                                                        </div>
                                                        <div class="row g-4">
                                                        <div class="col mb-0">
                                                            <label for="select2Basic" class="form-label" >Status</label>
                                                            <select class="form-control form-select" data-allow-clear="true" id="project-status">
                                                            <option class="badge bg-label-warning" style="text-align: left;">Status</option>
                                                            <option value="1" class="badge bg-label-primary m-0" style="text-align: left;">Active</option>
                                                            <option value="2" class="badge bg-label-success" style="text-align: left;">Complete</option>
                                                            <option value="3" class="badge bg-label-secondary" style="text-align: left;">Scheduled
                                                            </option>
                                                            </select>
                                                            <div class="error" id="statusError"></div>
                                                        </div>
                                                        <div class="col-md-6 col-12 mb-6">
                                                            <label for="flatpickr-multi" class="form-label">ETA</label>
                                                            <input type="datetime-local" class="form-control" id="project-eta" />
                                                            <div class="error" id="etaError"></div>
                                                        </div>
                                                        </div>
                                                        <div class="row">
                                                        <div class="col mb-4">
                                                            <label class="form-label" for="basic-default-message">Description</label>
                                                            <textarea class="form-control" placeholder="Hi, Do you have a moment to talk Joe?"
                                                            id="project-des">${project.description}</textarea>
                                                            <div class="error" id="descriptionError"></div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-label-secondary" data-bs-dismiss="modal">
                                                        Close
                                                        </button>
                                                        <button type="submit" class="btn btn-primary" style="color: #fff;" id="submit-button">Update
                                                        Project</button>
                                                    </div>
                                                    </form>
                                                    </div>`;

            updatemodal.innerHTML += modalContent;
        })



}