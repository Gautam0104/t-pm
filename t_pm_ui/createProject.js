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
        const project_leader_id = 23;
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
