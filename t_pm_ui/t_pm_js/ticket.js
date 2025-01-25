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
                                               <form id="ticketForm">
                                                    <div class="mb-5">
                                                        <label class="form-label" for="title">Title</label>
                                                        <textarea class="form-control" id="title">${element.title}</textarea>
                                                    </div>
                                                    <div class="mb-5">
                                                        <label class="form-label" for="due-date">Due Date</label>
                                                        <input class="form-control" id="due-date" value="${element.due_date}" readonly="readonly">
                                                    </div>
                                                    <div class="mb-5">
                                                        <label class="form-label" for="attachments">Attachments</label>
                                                        <input type="file" class="form-control" id="image" name="images" multiple>
                                                    </div>
                                                    <div class="mb-5">
                                                        <label class="form-label" for="description">Description</label>
                                                        <textarea class="form-control" id="description">${element.description}</textarea>
                                                    </div>
                                                    <div>
                                                        <button type="submit" class="btn btn-primary" id="update-button">Update</button>
                                                        <button type="button" class="btn btn-label-danger" id="delete-ticket">Delete</button>
                                                    </div>
                                                </form>
                                                <div id="message"></div>
                                            </div>
                                        </div>
                                        <div class="tab-content p-0">
                                           <!-- Activities -->
                                            <div class="tab-pane fade text-heading active" id="tab-activity" role="tabpanel">
                                                
                                            </div>
                                    </div>`; // Your offcanvas content goes here.

            offcanvasDiv.innerHTML = offcanvasContent;

            flatpickr("#due-date", {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: "today",
            });

            // Check if the images field is null or empty
            const imageArray = element.images && element.images !== null
                ? Array.isArray(element.images)
                    ? element.images
                    : element.images.replace(/^\[|\]$/g, '').split(',')
                : [];

            // If imageArray is empty, you may choose to show a default message or not display the images section at all
            imageArray.forEach(imagePath => {
                imagePath = imagePath.replace(/^"|"$/g, '').trim(); // Clean image path

                const activitySection = document.getElementById('tab-activity');
                const activityImages = `
                    <div class="card border m-2">
                        <div class="card-body text-center w-100" style="height:200px">
                            <img src="${API_BASE_URL}/uploads/${imagePath}" alt="ticketImage" width="100%" height="100%">
                        </div>
                    </div>
                `;

                activitySection.innerHTML += activityImages;
            });
        });
    });
