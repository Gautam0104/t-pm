// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely

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
                card.id = `${element.ticket_id}`;

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
                <img class="img-fluid rounded mb-2" id="card-img" draggable = false src="${API_BASE_URL}/uploads/${element.card_image}">
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
                // const cardImg = document.getElementById('card-img');
                // console.log(cardImg);

                // if (!cardImg.src) {
                //     cardImg.style.display = "none";
                // };

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
const cardImg = document.getElementById("card-img");
console.log(cardImg);

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
                let ticket_id = selected;
                console.log(e.currentTarget.id);
                // Fetch Ticket Data from API
                fetch(`${API_BASE_URL}/ticketbyid/${ticket_id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(
                                "Network response was not ok " + response.statusText
                            );
                        }
                        return response.json();
                    })
                    .then(data => {
                        data.map(element => {


                            const isoDate = `${element.ticket_created_at}`;

                            // Convert to a Date object
                            const date = new Date(isoDate);

                            // Extract date components
                            const day = date.getDate().toString().padStart(2, "0");
                            const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
                            const year = date.getFullYear();

                            // Extract time components
                            const hours = date.getHours().toString().padStart(2, "0");
                            const minutes = date.getMinutes().toString().padStart(2, "0");
                            const seconds = date.getSeconds().toString().padStart(2, "0");

                            // Combine date and time
                            const formattedDateTime = `${day}/${month}/${year} , ${hours}:${minutes}:${seconds}`;

                            console.log("Formatted Date and Time:", formattedDateTime);

                            const isoDateupdate = `${element.updated_at}`;

                            // Convert to a Date object
                            const dateupdate = new Date(isoDateupdate);

                            // Extract date components
                            const day1 = dateupdate.getDate().toString().padStart(2, "0");
                            const month1 = (dateupdate.getMonth() + 1)
                                .toString()
                                .padStart(2, "0"); // Months are 0-based
                            const year1 = dateupdate.getFullYear();

                            // Extract time components
                            const hours1 = dateupdate.getHours().toString().padStart(2, "0");
                            const minutes1 = dateupdate
                                .getMinutes()
                                .toString()
                                .padStart(2, "0");
                            const seconds1 = dateupdate
                                .getSeconds()
                                .toString()
                                .padStart(2, "0");

                            // Combine date and time
                            const formattedDateTimeupdate = `${day1}/${month1}/${year1} , ${hours1}:${minutes1}:${seconds1}`;

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
                                                        <label class="form-label" for="eta">ETC</label>
                                                        <input type= "text" class="form-control" id="ticket_eta" value="${element.ticket_eta}" >
                                                    </div>
                                                    <div class="mb-5">
                                                        <label class="form-label" for="attachments">Upload Card Image</label>
                                                        <input type="file" class="form-control" id="card-image" value="${element.card_image}" name="card-image" accept="image/*">
                                                        
                                                        <div class="text-center" id="card-image-preview" style="margin-top: 10px;">
                                                            <img id="card-image-preview-img" src="" alt="Card Image Preview" style="max-width: 100%; max-height: 200px; display: none;">
                                                           
                                                        </div>
                                                        <div class="text-center" id="card-image-preview-update" style="margin-top: 10px;">
                                                            
                                                            <img id="card-image-preview-update" src="${API_BASE_URL}/uploads/${element.card_image}" alt="Card Image Preview" style="max-width: 100%; max-height: 200px; display: block;">
                                                        </div>
                                                    </div>
                                                    <div class="mb-5">
                                                        <label class="form-label" for="attachments">Attachments</label>
                                                        <input type="file" class="form-control" id="image" name="images" multiple>
                                                    </div>
                                                    <div class="mb-5">
                                                        <label class="form-label" for="ticketOwner">Task Owner</label>
                                                        <select  class="select2 form-select" id="ticket-owner" >
                                                            <option disabled>Select a option to change the task owner</option>
                                                            <option value="Aman Singh">Aman Singh</option>
                                                            <option value="Gautam Shukla" >Gautam Shukla</option>
                                                            <option value="Utkarsh Singh" >Utkarsh Singh</option>
                                                            <option value="${element.ticket_owner}" selected disabled>Current Task Owner is : ${element.ticket_owner}</option>
                                                            </select>
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
                                        <div class="tab-pane fade" id="tab-activity" role="tabpanel">
                                           <!-- Activities -->
                                                 <div class="divider"> 
                                                <div class="divider-text">
                                                    <p class="mt-3">Ticket Activity</p>
                                                </div>
                                                </div>
                                                <div class="card border m-2">
                                            <div class ="card-header text-center">
                                            
                                                <span class="kanban-text" ><span class="badge bg-label-primary  w-100">${element.title}</span></span>
                                                <span class="badge bg-label-secondary m-2"> # Task Image</span>
                                                 <img src="${API_BASE_URL}/uploads/${element.card_image}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingModal">
                                                <div id="attachment-content"></div>
                                            </div>
                                            <div class="card-body text-center w-100" >
                                            
                                               <p>${element.description}</p>
                                                
                                                
                                                </div>
                                                <div class="card-footer text-center w-100">
                                                <span class="kanban-text" >ETC : ${element.ticket_eta}</span><br>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                <span class="kanban-text" >Created-At : ${formattedDateTime}</span><br>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                <span class="kanban-text" >Updated-At : ${formattedDateTimeupdate}</span><br>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                <span class="kanban-text" >Created-By : Thunder</span>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                
                                                <span class="kanban-text" >Task Owner : ${element.ticket_owner}</span>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                </div>
                                            </div>
                                      
                                           <!-- Activities History -->
                                           
                                             <div class="divider">
                                                <div class="divider-text">
                                                    <p class="mt-3">Ticket Activity History</p>
                                                </div>
                                                </div>
                                            <div id="history-content">
                                            </div>
                                            </div>
                                        
                                                </div>
                                    </div>`;

                            offcanvasDiv.innerHTML = offcanvasContent;

                            flatpickr("#due-date", {
                                enableTime: true,
                                dateFormat: "Y-m-d H:i", // Format for Date and Time
                                minDate: "today" // Set minimum date to today
                            });

                            // fetch ticket history

                            // Check if the images field is null or empty
                            const imageArray =
                                element.images && element.images !== null
                                    ? Array.isArray(element.images)
                                        ? element.images
                                        : element.images.replace(/^\[|\]$/g, "").split(",")
                                    : [];

                            // If imageArray is empty, you may choose to show a default message or not display the images section at all

                            imageArray.forEach(imagePath)


                            function imagePath(item, index) {
                                item = item.replace(/^"|"$/g, "").trim(); // Clean image path
                                const attachmentDiv = document.getElementById("attachment-content");
                                const activityImages = `<span class="badge bg-label-secondary m-2">Attachment #${index + 1}</span>
                                                           <img src="${API_BASE_URL}/uploads/${item}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingModal">`;

                                attachmentDiv.innerHTML += activityImages;
                                const activityImageArea = document.getElementById(
                                    "activity-image-area"
                                );

                                const imageContent = `
                                    
                                    
                                                            <img src="${API_BASE_URL}/uploads/${item}" alt="" width="100%" 
                                                            height="100%" id="activityImage>
                                                            <div class="row d-flex justify-content-center">
                                                                <div class="col-12 mt-3 text-center">
                                                                    <button class="btn btn-primary" >Download</button>
                                                                </div>
                                                            </div>`;
                                activityImageArea.innerHTML = imageContent;
                            }




                            // fetch ticket history
                            fetch(`${API_BASE_URL}/ticket-history/${ticket_id}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(
                                            "Network response was not ok " + response.statusText
                                        );
                                    }
                                    return response.json();
                                })
                                .then(histories => {

                                    histories.map(history => {
                                        const ticketHistory = document.getElementById("history-content");
                                        // Convert to a Date object
                                        const isoHisDateupdate = `${history.updated_at}`;
                                        const historydateupdate = new Date(isoHisDateupdate);

                                        // Extract date components
                                        const day1 = historydateupdate.getDate().toString().padStart(2, "0");
                                        const month1 = (historydateupdate.getMonth() + 1)
                                            .toString()
                                            .padStart(2, "0"); // Months are 0-based
                                        const year1 = historydateupdate.getFullYear();

                                        // Extract time components
                                        const hours1 = historydateupdate.getHours().toString().padStart(2, "0");
                                        const minutes1 = historydateupdate
                                            .getMinutes()
                                            .toString()
                                            .padStart(2, "0");
                                        const seconds1 = historydateupdate
                                            .getSeconds()
                                            .toString()
                                            .padStart(2, "0");

                                        // Combine date and time
                                        const formattedDateTimehistoryupdate = `${day1}/${month1}/${year1} , ${hours1}:${minutes1}:${seconds1}`;

                                        const Content = `  <div class="card border m-2">
                                            <div class ="card-header text-center">
                                            
                                                <span class="kanban-text" ><span class="badge bg-label-primary m-2 w-100">${history.previous_title}</span></span>
                                                <span class="badge bg-label-secondary m-2"> # Previous Task Image</span>
                                                 <img src="${API_BASE_URL}/uploads/${history.previous_card_image}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingModal">
                                                <div id="attachment-content-history"></div>
                                            </div>
                                            <div class="card-body text-center w-100" >
                                            <p>${element.previous_description}</p>
                                            
                                                
                                                
                                                </div>
                                                <div class="card-footer text-center w-100">
                                                <span class="kanban-text" >Previous ETC : ${history.previous_ticket_eta}</span><br>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                <span class="kanban-text" >Created-At : ${formattedDateTime}</span><br>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                <span class="kanban-text" >Updated-At : ${formattedDateTimehistoryupdate} </span><br>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                <span class="kanban-text" >Created-By : Thunder</span>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                
                                                <span class="kanban-text" >Task Owner : ${history.previous_ticket_owner}</span>
                                                <div class="divider">
                                                <div class="divider-text">
                                                    <i class="ti ti-star"></i>
                                                </div>
                                                </div>
                                                </div>
                                            </div>
                                            </div>`;

                                        ticketHistory.innerHTML += Content;

                                        // Check if the images field is null or empty
                                        const historyimageArray =
                                            history.previous_images && history.previous_images !== null
                                                ? Array.isArray(history.previous_images)
                                                    ? history.previous_images
                                                    : history.previous_images.replace(/^\[|\]$/g, "").split(",")
                                                : [];

                                        // If imageArray is empty, you may choose to show a default message or not display the images section at all
                                        historyimageArray.forEach(preimagePath)

                                        function preimagePath(item, index) {
                                            item = item.replace(/^"|"$/g, "").trim(); // Clean image path


                                            const attachmenthistoryDiv = document.getElementById("attachment-content-history");
                                            const activitypreImages = `<span class="badge bg-label-secondary m-2">Attachment #${index + 1}</span>
                                                                           <img src="${API_BASE_URL}/uploads/${item}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingModal">`;

                                            attachmenthistoryDiv.innerHTML += activitypreImages;
                                            const activityImageArea = document.getElementById(
                                                "activity-image-area"
                                            );

                                            const imageContent = `
                                
                                
                                                        <img src="${API_BASE_URL}/uploads/${item}" alt="" width="100%" 
                                                        height="100%" id="activityImage>
                                                        <div class="row d-flex justify-content-center">
                                                            <div class="col-12 mt-3 text-center">
                                                                <button class="btn btn-primary" >Download</button>
                                                            </div>
                                                        </div>`;
                                            activityImageArea.innerHTML = imageContent;

                                        }


                                    })

                                })

                            const closeButton = document.getElementById("offcanvase-close");
                            const deleteButton = document.getElementById("delete-ticket");
                            //console.log(updateButton);
                            closeButton.addEventListener("click", function () {
                                selected = null;
                                console.log("selected is null now");
                                const offcanvas = document.querySelector(".offcanvas");
                                // const backdropWrapper = document.getElementById("backdrop");
                                offcanvas.classList.remove("show");
                                // backdropWrapper.innerHTML = "";
                            });
                            // Add event listener for the card-image input field
                            document
                                .getElementById("card-image")
                                .addEventListener("change", function (event) {
                                    const fileInput = event.target;
                                    const previewContainer = document.getElementById(
                                        "card-image-preview"
                                    );
                                    const previewContainerUpdate = document.getElementById(
                                        "card-image-preview-update"
                                    );
                                    const previewUpdate = document.getElementById(
                                        "image-preview-update"
                                    );
                                    const previewImage = document.getElementById(
                                        "card-image-preview-img"
                                    );

                                    previewContainerUpdate.style.display = "none";
                                    // Check if a file is selected
                                    if (fileInput.files && fileInput.files[0]) {
                                        const file = fileInput.files[0];

                                        // Validate that the file is an image
                                        if (!file.type.startsWith("image/")) {
                                            alert("Please upload a valid image file.");
                                            fileInput.value = ""; // Reset the input
                                            previewImage.style.display = "none"; // Hide preview
                                            return;
                                        }

                                        // Use FileReader to display the image
                                        const reader = new FileReader();
                                        reader.onload = function (e) {
                                            // Set the preview image src to the loaded file data
                                            previewImage.src = e.target.result;
                                            previewImage.style.display = "block"; // Show the image
                                        };
                                        reader.readAsDataURL(file); // Read the file data as a data URL
                                    } else {
                                        // No file selected, hide the preview
                                        previewImage.style.display = "none";
                                    }
                                });

                            // update ticket form
                            document
                                .getElementById("ticketForm")
                                .addEventListener("submit", function (e) {
                                    e.preventDefault();

                                    const ticket_id = element.ticket_id;
                                    const title = document.getElementById("title").value;
                                    const description = document.getElementById("description")
                                        .value;
                                    const status = "backlog";
                                    const priority = "Medium";
                                    const due_date = document.getElementById("due-date").value;
                                    const ticket_status = element.ticket_status;
                                    const images = document.getElementById("image").files;
                                    const cardImage = document.getElementById("card-image").files;
                                    const ticket_eta = document.getElementById("ticket_eta")
                                        .value;
                                    const ticket_owner = document.getElementById("ticket-owner")
                                        .value;

                                    // Validate required fields
                                    if (
                                        !ticket_id ||
                                        !title ||
                                        !description ||
                                        !status ||
                                        !priority ||
                                        !ticket_status ||
                                        !ticket_owner
                                    ) {
                                        alert("Please fill in all required fields.");
                                        return;
                                    }

                                    // Create FormData
                                    const formData = new FormData();
                                    formData.append("ticket_id", ticket_id);
                                    formData.append("title", title);
                                    formData.append("description", description);
                                    formData.append("status", status);
                                    formData.append("priority", priority);
                                    formData.append("due_date", due_date);
                                    formData.append("ticket_status", ticket_status);
                                    formData.append("ticket_eta", ticket_eta);
                                    formData.append("ticket_owner", ticket_owner);

                                    // Append multiple images
                                    if (images.length > 0) {
                                        for (let i = 0; i < images.length; i++) {
                                            formData.append("images", images[i]);
                                        }
                                    }
                                    // Append single cardImage
                                    if (cardImage.length > 0) {
                                        formData.append("card_image", cardImage[0]); // Correctly append the first cardImage file
                                    }

                                    // Display a loading message
                                    const messageElement = document.getElementById("message");
                                    messageElement.textContent = "Updating ticket...";

                                    // Send update request
                                    fetch(`${API_BASE_URL}/updateticket`, {
                                        method: "PUT",
                                        body: formData
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.message) {
                                                // Ticket successfully updated
                                                selected = null;
                                                const offcanvas = document.querySelector(".offcanvas");
                                                offcanvas.classList.remove("show");

                                                // Show success message
                                                Swal.fire({
                                                    title: "Ticket Updated Successfully",
                                                    text: "The ticket has been updated successfully.",
                                                    icon: "success",
                                                    confirmButtonText: "Ok!"
                                                }).then(() => {
                                                    window.location.reload();
                                                });
                                            } else if (data.error) {
                                                messageElement.textContent = data.error;
                                                messageElement.style.color = "red";
                                            }
                                        })
                                        .catch(error => {
                                            messageElement.textContent = "An error occurred.";
                                            messageElement.style.color = "red";
                                            console.error("Error:", error);
                                        });
                                });

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
                                    const response = await fetch(
                                        `${API_BASE_URL}/clearHistory/${ticket_id}`,
                                        {
                                            method: "DELETE"
                                        }
                                    );

                                    // Parse the response
                                    // const data = await response.json();

                                    if (response.ok) {
                                        console.log("ticket history clear");
                                    } else {
                                        console.log("something went wrong");
                                    }
                                } catch (error) {
                                    console.error(error);
                                    // messageDiv.textContent = 'Could not connect to the server.';
                                    // messageDiv.className = 'message error';
                                }

                                try {
                                    // Send DELETE request to the API
                                    const response = await fetch(
                                        `${API_BASE_URL}/deleteticket/${ticket_id}`,
                                        {
                                            method: "DELETE"
                                        }
                                    );

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
                            });
                        });
                    });
            });

            element.addEventListener("dragstart", e => {
                let selected = e.target;
                let ticket_id = selected.classList[2];
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
                    const contentInprogress = document.getElementById(
                        "content-inprogress"
                    );
                    contentDiv.style.opacity = "1";
                });
                forApprovalTask.addEventListener("dragover", function (e) {
                    e.preventDefault();
                });
                rejectedTask.addEventListener("dragover", function (e) {
                    e.preventDefault();

                });
                approvedTask.addEventListener("dragover", function (e) {
                    e.preventDefault();

                });
                todoTask.addEventListener("dragover", function (e) {
                    e.preventDefault();

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

                });
            });
        });
    })
    .catch(error => console.error("Error:", error));





const closeCanvase = () => {
    const offcanvas = document.querySelector(".offcanvas");
    // const backdropWrapper = document.getElementById("backdrop");
    offcanvas.classList.remove("show");
    // backdropWrapper.innerHTML = "";
};
