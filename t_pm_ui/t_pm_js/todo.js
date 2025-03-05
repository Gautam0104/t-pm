import { joinCardToModal } from "./automation/joinCard.js";
import { moveCardToModal } from "./automation/moveCard.js";
import { copyCardToModal } from "./automation/copyCard.js";
import { removeCardToModal } from "./automation/removeAutomationFeature.js";
import { markDueDateModal } from "./automation/markDueDate.js";
import { setDuedateCardToModal } from "./automation/setDueDate.js";

console.log(setDuedateCardToModal);

window.onload = function() {
  setTimeout(function() {
    document.getElementById("loading").style.display = "none";
  }, 1500);
};

var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
var creator_id = urlParams.get("user_id");
setTimeout(function() {
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
      const titleContent = `<input type="text" class="form-control" value = "${data.project_name}" id="project-title-input">`;

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
      .then(async data => {
        // Fetch board data first
        const boardResponse = await fetch(`${API_BASE_URL}/getboards`);
        if (!boardResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const boardData = await boardResponse.json();

        data.forEach(element => {
          const card = document.createElement("div");
          card.className = `kanban-item dragg-from-todo ${element.ticket_id}`;
          card.draggable = true;
          card.id = `${element.ticket_id}`;

          card.innerHTML = `
            <div class="d-flex justify-content-between ${element.ticket_id} flex-wrap align-items-center mb-2">
              <div class="d-flex">
                <div class="me-2" id="mark-card-${element.ticket_id}"></div>
                <div class="me-2" id="watch-notification-${element.ticket_id}"></div>
              </div>
              <div class="item-badges">
                <div class="d-flex" id="label-color-box-${element.ticket_id}" style="width:225px;"></div>
                <div class="badge bg-label-success">${element.badge ||
                  "UX"}</div>
              </div>
              <div class="dropdown kanban-tasks-item-dropdown">
                <i class="dropdown-toggle ti ti-dots-vertical" 
                   id="kanban-tasks-item-dropdown" 
                   data-bs-toggle="dropdown" 
                   aria-haspopup="true" 
                   aria-expanded="false" 
                   onclick="cardDropdown(event)">
                </i>
                <div class="dropdown-menu dropdown-menu-end">
                  <a class="dropdown-item waves-effect" href="javascript:void(0)">Copy task link</a>
                  <a class="dropdown-item waves-effect" href="javascript:void(0)">Duplicate task</a>
                  <a class="dropdown-item delete-task waves-effect" href="javascript:void(0)" 
                     onclick="deleteCard(event,'${element.ticket_id}')">Delete</a>
                </div>
              </div>
            </div>
            <img class="img-fluid rounded mb-2" id="card-img" draggable=false 
                 src="${API_BASE_URL}/uploads/${element.card_image}">
            <span class="kanban-text">${element.title}</span>
            <div id="checklist-container-${element.ticket_id}"></div>
            <div class="item-badges mt-2" id="joined-member-${element.ticket_id}"></div>
            <div class="d-flex justify-content-between align-items-center flex-wrap mt-2">
              <div class="d-flex">
                <span class="d-flex align-items-center me-2">
                  <i class="ti ti-paperclip me-1"></i>
                  <span class="attachments">${element.attachments || "0"}</span>
                </span>
                <span class="d-flex align-items-center ms-2">
                  <i class="ti ti-message-2 me-1"></i>
                  <span>${element.comments || "0"}</span>
                </span>
              </div>
            </div>
          `;

          // Assign card to the correct board
          const board = boardData.find(
            b => b.board_title === element.ticket_status
          );
          if (board) {
            const boardContainer = document.getElementById(
              `${board.board_title}-task`
            );
            if (boardContainer) {
              boardContainer.appendChild(card);
            }
          }
        });

        return document.querySelectorAll(".dragg-from-todo");
      });
  }

  const cardImg = document.getElementById("card-img");
  console.log(cardImg);

  // Call the function and use the returned elements
  fetchDataAndCreateElements()
    .then(trydraggElements => {
      console.log("trydragg elements outside fetch:", trydraggElements);

      // Perform actions on the elements here
      trydraggElements.forEach(element => {
        element.addEventListener("click", function(e) {
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
                const hours1 = dateupdate
                  .getHours()
                  .toString()
                  .padStart(2, "0");
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
                function stripTags(html) {
                  return html.replace(/<\/?[^>]+(>|$)/g, "");
                }

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
                                                        <i class="ti ti-edit ti-18px me-1"></i>
                                                        <span class="align-middle">Edit</span>
                                                    </button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link waves-effect" data-bs-toggle="tab"
                                                        data-bs-target="#tab-activity" aria-selected="false"
                                                        tabindex="-1" role="tab">
                                                        <i class="ti ti-chart-pie-2 ti-18px me-1"></i>
                                                        <span class="align-middle">Activity</span>
                                                    </button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link waves-effect" data-bs-toggle="tab"
                                                        data-bs-target="#tab-comments" aria-selected="false"
                                                        tabindex="-1" role="tab">
                                                        <i class="ti ti-chart-pie-2 ti-18px me-1"></i>
                                                        <span class="align-middle">Comments</span>
                                                    </button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link waves-effect" data-bs-toggle="tab"
                                                        data-bs-target="#tab-actions" aria-selected="false"
                                                        tabindex="-1" role="tab">
                                                        <i class="ti ti-chart-pie-2 ti-18px me-1"></i>
                                                        <span class="align-middle">Actions</span>
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
                                                            
                                                            <img id="card-image-preview-update" src="${API_BASE_URL}/uploads/${element.card_image}" alt="Card Image Preview" style="max-width: 100%; max-height: 200px; display: block;"  onerror="this.style.display='none'">
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
                                                            <option value="${element.ticket_owner}" selected disabled>Current Task Owner is : ${element.ticket_owner}</option>
                                                            </select>
                                                    </div>
                                                    <div class="mb-5">
                                                    <label class="form-label" for="description">Description</label>
                                                    <div class="comment-box">
                                                        <div class="editable-area" id="description" contenteditable="true" placeholder="Write a Content...">${element.description}</div>
                                                        <div class="toolbar">
                                                            <button type="button" class="toolbar-btn bold"  id="styleBold">B</button>
                                                            <button type="button" class="toolbar-btn italic"  id="styleItalic">I</button>
                                                            <button type="button" class="toolbar-btn underline"  id="styleUnderline">U</button>
                                                            <button type="button" class="toolbar-btn bullet"  id="styleDote">•</button>
                                                            <button type="button" class="toolbar-btn link"  id="addLink">🔗</button>
                                                            <button type="button" class="toolbar-btn image"  id="addImage">🖼️</button>
                                                        </div>
                                                    </div>
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
                                                 <img src="${API_BASE_URL}/uploads/${element.card_image}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingCardImage">
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
                                                <div class="tab-content p-0">
                                                <div class="tab-pane fade text-heading" id="tab-comments" role="tabpanel">
                                                <div class="media mb-4 d-flex align-items-center">
                                                    <div class="avatar me-3 flex-shrink-0">
                                                    <span class="avatar-initial bg-label-success rounded-circle">AS</span>
                                                    </div>
                                                    <div class="media-body">
                                                    <p class="mb-0"><span>Aman</span> Left the board.</p>
                                                    <small class="text-muted">Today 11:00 AM</small>
                                                    </div>
                                                </div>
                                                <div class="media mb-4 d-flex align-items-center">
                                                    <div class="avatar me-3 flex-shrink-0">
                                                    <span class="avatar-initial bg-label-success rounded-circle">GS</span>
                                                    </div>
                                                    <div class="media-body">
                                                    <p class="mb-0"><span>Gautam</span> Join the board.</p>
                                                    <small class="text-muted">Today 11:00 AM</small>
                                                    </div>
                                                </div>
                                                <div class="media mb-4 d-flex align-items-center">
                                                    <div class="avatar me-3 flex-shrink-0">
                                                    <span class="avatar-initial bg-label-success rounded-circle">US</span>
                                                    </div>
                                                    <div class="media-body">
                                                    <p class="mb-0"><span>Utkarsh</span></span> Left the board.</p>
                                                    <small class="text-muted">Today 11:00 AM</small>
                                                    </div>
                                                </div>
                                                
                                                </div>
                                                </div>
                                                <div class="tab-content p-0">
                                                <div class="tab-pane fade text-heading" id="tab-actions" role="tabpanel">
                                                      <div class="d-flex flex-column" style="width: 100%; height: 100vh;">
                                                        <!-- Menu -->
                                                        <ul class="nav flex-column py-2 overflow-auto">
                                                            <!-- Menu Items -->
                                                            <li class="nav-item"  id="join-button">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" onclick="joinCard('${element.ticket_id}')">
                                                                    <i class="fas fa-user-plus me-2"></i>Join  
                                                                </button>
                                                            </li>
                                                            <li class="nav-item" id="leave-button" style="display:none;">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100"  onclick="leaveCard('${element.ticket_id}')" >
                                                                    <i class="fas fa-user-minus me-2"></i>Leave
                                                                </button>
                                                            </li>
                                                                <li class="nav-item active">
                                                                    <button class="nav-link d-flex align-items-center border-0 w-100">
                                                                        <i class="fas fa-user me-2"></i> Members
                                                                    </button>
                                                                </li>
                                                            <li class="nav-item dropdown">
                                                                <button class="nav-link d-flex align-items-center border-0 w-100" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i class="fas fa-tags me-2"></i> Labels
                                                                </button>
                                                                <ul class="dropdown-menu w-100" aria-labelledby="label-dropdown">
                                                                    <li>
                                                                        <div class="row d-flex justify-content-center">
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <input type="checkbox" class="form-check-input" onclick="addLabel('rgb(10, 82, 42)','${element.ticket_id}')">
                                                                            </div>
                                                                            <div class="col-7 d-flex justify-content-center align-items-center h-px-50 ">
                                                                                <div class="color-box w-100" style="background: rgb(10, 82, 42);" onclick="addLabel('rgb(10, 82, 42)','${element.ticket_id}')"></div>
                                                                            </div>
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <a href=""><span><i class="ti ti-pencil"></i></span></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="row d-flex justify-content-center">
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <input type="checkbox" class="form-check-input" onclick="addLabel('rgb(233, 34, 34)','${element.ticket_id}')">
                                                                            </div>
                                                                            <div class="col-7 d-flex justify-content-center align-items-center h-px-50 ">
                                                                                <div class="color-box w-100" style="background: rgb(233, 34, 34);" onclick="addLabel('rgb(233, 34, 34)','${element.ticket_id}')"></div>
                                                                            </div>
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <a href=""><span><i class="ti ti-pencil"></i></span></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="row d-flex justify-content-center">
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <input type="checkbox" class="form-check-input" onclick="addLabel('rgb(218, 110, 21)','${element.ticket_id}')">
                                                                            </div>
                                                                            <div class="col-7 d-flex justify-content-center align-items-center h-px-50 ">
                                                                                <div class="color-box w-100" style="background: rgb(218, 110, 21);" onclick="addLabel('rgb(218, 110, 21)','${element.ticket_id}')"></div>
                                                                            </div>
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <a href=""><span><i class="ti ti-pencil"></i></span></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="row d-flex justify-content-center">
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <input type="checkbox" class="form-check-input" onclick="addLabel('rgb(148, 122, 8)','${element.ticket_id}')">
                                                                            </div>
                                                                            <div class="col-7 d-flex justify-content-center align-items-center h-px-50 ">
                                                                                <div class="color-box w-100" style="background: rgb(148, 122, 8);" onclick="addLabel('rgb(148, 122, 8)','${element.ticket_id}')"></div>
                                                                            </div>
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <a href=""><span><i class="ti ti-pencil"></i></span></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="row d-flex justify-content-center">
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <input type="checkbox" class="form-check-input" onclick="addLabel('rgb(116, 128, 241)','${element.ticket_id}')">
                                                                            </div>
                                                                            <div class="col-7 d-flex justify-content-center align-items-center h-px-50 ">
                                                                                <div class="color-box w-100" style="background: rgb(116, 128, 241);" onclick="addLabel('rgb(116, 128, 241)','${element.ticket_id}')"></div>
                                                                            </div>
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <a href=""><span><i class="ti ti-pencil"></i></span></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="row d-flex justify-content-center">
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <input type="checkbox" class="form-check-input" onclick="addLabel('rgb(46, 60, 185)','${element.ticket_id}')">
                                                                            </div>
                                                                            <div class="col-7 d-flex justify-content-center align-items-center h-px-50 ">
                                                                                <div class="color-box w-100" style="background: rgb(46, 60, 185);" onclick="addLabel('rgb(46, 60, 185)','${element.ticket_id}')"></div>
                                                                            </div>
                                                                            <div class="col-2 d-flex justify-content-center align-items-center h-px-50">
                                                                                <a href=""><span><i class="ti ti-pencil"></i></span></a>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>

                                                            </li>

                                                            <li class="nav-item dropdown">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="checklist-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i class="fas fa-tasks me-2"></i> Checklist
                                                                </button>
                                                                <ul class="dropdown-menu w-75" aria-labelledby="checklist-dropdown">
                                                                 <li>
                                                                 <div class="row d-flex justify-content-center">
                                                                 <div class="col-6"><p>Add checklist</p></div>
                                                                 </div>
                                                                 <div class="form">
                                                                 <div class="row">
                                                                    <div class="col mb-4">
                                                                    <label for="nameSmall" class="form-label">Title</label>
                                                                    <input type="text" id="checklist-name" class="form-control" placeholder="Checklist">
                                                                    </div>
                                                                   
                                                                </div>
                                                                 <div class="col mb-4">
                                                                    <button type="button" class="btn btn-primary waves-effect waves-light" onclick="createChecklist('${element.ticket_id}','${element.title}')">Add</button>
                                                                             
                                                                    </div>
                                                                 </div>
                                                                 </li>
                                                                </ul>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100">
                                                                    <i class="fas fa-calendar-alt me-2"></i> Dates
                                                                </button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100">
                                                                    <i class="fas fa-paperclip me-2"></i> Attachment
                                                                </button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100">
                                                                    <i class="fas fa-image me-2"></i> Cover
                                                                </button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100">
                                                                    <i class="fas fa-cog me-2"></i> Custom Fields
                                                                </button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100">
                                                                    <i class="fas fa-plug me-2"></i> Add Power-Ups
                                                                </button>
                                                            </li>
                                                            <li class="nav-item dropdown mt-4 mb-4">
                                                            <ul class="dropdown-menu w-100" aria-labelledby="add-button-dropdown">
                                                                 <li class="nav-item">
                                                                 <button class="nav-link  d-flex align-items-center border-0 " id="moveAutomation" >
                                                                    <i class="fas fa-arrow-right me-2"></i> Move card to..
                                                                </button>
                                                                <button class="nav-link d-flex align-items-center border-0 w-100" id="copyAutomation" >
                                                                    <i class="fas fa-copy me-2"></i> Copy card to..
                                                                </button>
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" data-bs-toggle="modal" data-bs-target="#addLabelModal" onclick="addLabelModal('${element.title}','${element.ticket_id}')" >
                                                                    <i class="fas fa-tags me-2"></i> Add Labels
                                                                </button>
                                                                <button class="nav-link   d-flex align-items-center border-0  w-100"   id="joinAutomation">
                                                                    <i class="fas fa-user me-2"></i> Join Card
                                                                </button>
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="setduedateAutomation" >
                                                                    <i class="fas fa-clock me-2"></i> Set due date or start date
                                                                </button>
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="markduedateAutomation" >
                                                                    <i class="fas fa-clock me-2"></i> Mark due date
                                                                </button>
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="removeCardFeature" >
                                                                    <i class="fas fa-minus me-2"></i> Remove 
                                                                </button>
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" data-bs-toggle="modal" data-bs-target="" onclick="" >
                                                                    <i class="fas fa-sort-amount-down me-2"></i> Sort list
                                                                </button>
                                                                <button type="button" class="btn btn-light w-100" onclick="">
                                                                 Create a custom button
                                                                 </button>
                                                                 </li>
                                                                 </ul>

                                                                  <ul class="nav flex-column  overflow-auto" id="automation-button-ul-${element.ticket_id}" style="display:none;">
                                                                  <li class="nav-item">
                                                             <button class="nav-link  d-flex align-items-center border-0  w-100" id="add-button-dropdown" onclick="editAutomation('${element.ticket_id}')">
                                                                    <i class="fas fa-pencil me-2"></i> Automation
                                                                </button>
                                                             </li>
                                                             
                                                            </ul>
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100 " id="add-button-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i class="fas fa-plus me-2"></i> Add Button
                                                                </button>

                                                                
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="markCardFeature" >
                                                                    <i class="fas fa-check me-2"></i> Mark Complete
                                                                </button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="watchCardFeature">
                                                                    <i class="fas fa-eye me-2"></i> Watch Notification
                                                                </button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" data-bs-toggle="modal" data-bs-target="#copycardModal" id="copyCardFeature" >
                                                                    <i class="fas fa-copy me-2"></i> Copy Card
                                                                </button>
                                                            </li>
                                                             <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" data-bs-toggle="modal" data-bs-target="#movecardModal" id="moveCardFeature">
                                                                    <i class="fas fa-arrow-right me-2"></i> Move Card
                                                                </button>
                                                            </li>
                                                           <li class="nav-item dropdown">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="cover-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i class="fas fa-box me-2"></i> Cover
                                                                </button>
                                                                <ul class="dropdown-menu w-100" aria-labelledby="cover-dropdown">
                                                                 <li>
                                                                 <div class="row d-flex justify-content-center">
                                                                 <div class="col-6"><p>Add Color</p></div>
                                                                 </div>
                                                                 
                                                                 <div class="row">
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:red;"></div>
                                                                    </div>
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:blue;"></div>
                                                                    </div>
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:green;"></div>
                                                                    </div>
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:pink;"></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                                 <div class="row">
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:skyblue;"></div>
                                                                    </div>
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:orange;"></div>
                                                                    </div>
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:voilet;"></div>
                                                                    </div>
                                                                    <div class="col mb-3">
                                                                    <div class="color-box w-100 rounded" style="background-color:purple;"></div>
                                                                    </div>
                                                                   
                                                                </div>
                                                                
                                                                 <div class="row">
                                                                    <div class="col mb-3">
                                                                    <button type="button" class="btn btn-primary btn-large waves-effect waves-light w-100">Add</button>
                                                                    </div>
                                                                    
                                                                   
                                                                </div>
                                                                
                                                                 </div>
                                                                 </li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                   
                                                </div>
                                                
                                                </div>
                                                </div>
                                    </div>`;

                offcanvasDiv.innerHTML = offcanvasContent;

                //  all event listner of action tab

                document
                  .getElementById("styleBold")
                  .addEventListener("click", function() {
                    applyStyle("bold");
                  });
                document
                  .getElementById("styleItalic")
                  .addEventListener("click", function() {
                    applyStyle("italic");
                  });
                document
                  .getElementById("styleUnderline")
                  .addEventListener("click", function() {
                    applyStyle("underline");
                  });
                // document
                //   .getElementById("styleDot")
                //   .addEventListener("click", function() {
                //     applyStyle("insertUnorderedList");
                //   });
                document
                  .getElementById("addLink")
                  .addEventListener("click", function() {
                    addLink();
                  });
                document
                  .getElementById("addImage")
                  .addEventListener("click", function() {
                    addImage();
                  });
                document
                  .getElementById("markCardFeature")
                  .addEventListener("click", function() {
                    markCard(element.ticket_id);
                  });
                document
                  .getElementById("watchCardFeature")
                  .addEventListener("click", function() {
                    watchNotification(element.ticket_id);
                  });
                document
                  .getElementById("copyCardFeature")
                  .addEventListener("click", function() {
                    copyCardToModal(
                      element.title,
                      element.ticket_id,
                      element.ticket_status
                    );
                  });
                document
                  .getElementById("moveCardFeature")
                  .addEventListener("click", function() {
                    moveCardToModal(
                      element.title,
                      element.ticket_id,
                      element.ticket_status
                    );
                  });

                const joinAutomationButton = document.getElementById(
                  "joinAutomation"
                );
                const moveAutomationButton = document.getElementById(
                  "moveAutomation"
                );

                const copyAutomationButton = document.getElementById(
                  "copyAutomation"
                );
                const markduedateAutomationButton = document.getElementById(
                  "markduedateAutomation"
                );
                const setduedateAutomationButton = document.getElementById(
                  "setduedateAutomation"
                );
                const removeFeatureAutomationButton = document.getElementById(
                  "removeCardFeature"
                );

                markduedateAutomationButton.addEventListener("click", () => {
                  setDuedateCardToModal(element.title, element.ticket_id);
                });
                setduedateAutomationButton.addEventListener("click", () => {
                  markDueDateModal(
                    element.title,
                    element.ticket_id,
                    element.ticket_status
                  );
                });
                copyAutomationButton.addEventListener("click", () => {
                  copyCardToModal(
                    element.title,
                    element.ticket_id,
                    element.ticket_status
                  );
                });

                moveAutomationButton.addEventListener("click", () => {
                  moveCardToModal(
                    element.title,
                    element.ticket_id,
                    element.ticket_status
                  );
                });
                removeFeatureAutomationButton.addEventListener("click", () => {
                  removeCardToModal(
                    element.title,
                    element.ticket_id,
                    element.ticket_status
                  );
                });
                joinAutomationButton.addEventListener("click", () => {
                  joinCardToModal(element.title, element.ticket_id);
                });
                cardjoinVerification(element.ticket_id);

                retrieveAutomation(element.ticket_id);

                // card image zone in modal
                const imageArea = document.getElementById(
                  "activity-card-image-area"
                );
                const cardImage = `<img src="${API_BASE_URL}/uploads/${element.card_image}" alt="ticketImage" width="100%" height="100%" >`;
                imageArea.innerHTML = cardImage;

                flatpickr("#due-date", {
                  enableTime: true,
                  dateFormat: "Y-m-d H:i", // Format for Date and Time
                  minDate: "today" // Set minimum date to today
                });

                // fetch ticket history
                fetch(`${API_BASE_URL}/users`)
                  .then(response => {
                    if (!response.ok) {
                      throw new Error(
                        "Network response was not ok " + response.statusText
                      );
                    }
                    return response.json();
                  })
                  .then(users => {
                    users.map(user => {
                      const taskOwnerfield = document.getElementById(
                        "ticket-owner"
                      );
                      const taskOwnerContent = `<option value="${user.first_name}">${user.first_name}</option>`;

                      taskOwnerfield.innerHTML += taskOwnerContent;
                    });
                  });
                // Check if the images field is null or empty
                const imageArray =
                  element.images && element.images !== null
                    ? Array.isArray(element.images)
                      ? element.images
                      : element.images.replace(/^\[|\]$/g, "").split(",")
                    : [];

                // If imageArray is empty, you may choose to show a default message or not display the images section at all

                imageArray.forEach(imagePath);

                function imagePath(item, index) {
                  item = item.replace(/^"|"$/g, "").trim(); // Clean image path
                  const attachmentDiv = document.getElementById(
                    "attachment-content"
                  );
                  const activityImages = `<span class="badge bg-label-secondary m-2">Attachment #${index +
                    1}</span>
                                                           <img src="${API_BASE_URL}/uploads/${item}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingModal">`;

                  attachmentDiv.innerHTML += activityImages;
                  const activityImageArea = document.getElementById(
                    "activity-image-area"
                  );

                  const imageContent = `
                                    
                                    
                                                            <img src="${API_BASE_URL}/uploads/${item}" alt="" width="100%" 
                                                            height="100%" id="activityImage">
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
                      const ticketHistory = document.getElementById(
                        "history-content"
                      );
                      // Convert to a Date object
                      const isoHisDateupdate = `${history.updated_at}`;
                      const historydateupdate = new Date(isoHisDateupdate);

                      // Extract date components
                      const day1 = historydateupdate
                        .getDate()
                        .toString()
                        .padStart(2, "0");
                      const month1 = (historydateupdate.getMonth() + 1)
                        .toString()
                        .padStart(2, "0"); // Months are 0-based
                      const year1 = historydateupdate.getFullYear();

                      // Extract time components
                      const hours1 = historydateupdate
                        .getHours()
                        .toString()
                        .padStart(2, "0");
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
                      // image src check

                      document.addEventListener("DOMContentLoaded", function() {
                        let imgElement = document.getElementById(
                          "card-image-preview-update"
                        );

                        if (
                          !imgElement.src ||
                          imgElement.src.includes("null")
                        ) {
                          imgElement.style.display = "none"; // Hide the image if src is null or invalid
                        }
                      });
                      // Check if the images field is null or empty
                      const historyimageArray =
                        history.previous_images &&
                        history.previous_images !== null
                          ? Array.isArray(history.previous_images)
                            ? history.previous_images
                            : history.previous_images
                                .replace(/^\[|\]$/g, "")
                                .split(",")
                          : [];

                      // If imageArray is empty, you may choose to show a default message or not display the images section at all
                      historyimageArray.forEach(preimagePath);

                      function preimagePath(item, index) {
                        item = item.replace(/^"|"$/g, "").trim(); // Clean image path

                        const attachmenthistoryDiv = document.getElementById(
                          "attachment-content-history"
                        );
                        const activitypreImages = `<span class="badge bg-label-secondary m-2">Attachment #${index +
                          1}</span>
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
                    });
                  });

                const closeButton = document.getElementById("offcanvase-close");
                const deleteButton = document.getElementById("delete-ticket");
                //console.log(updateButton);
                closeButton.addEventListener("click", function() {
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
                  .addEventListener("change", function(event) {
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
                      reader.onload = function(e) {
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
                  .addEventListener("submit", function(e) {
                    e.preventDefault();

                    const ticket_id = element.ticket_id;
                    const title = document.getElementById("title").value;
                    const description = document.getElementById("description")
                      .innerHTML;
                    const status = "backlog";
                    const priority = "Medium";
                    const due_date = document.getElementById("due-date").value;
                    const ticket_status = element.ticket_status;
                    const images = document.getElementById("image").files;
                    const cardImage = document.getElementById("card-image")
                      .files;
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
                          const offcanvas = document.querySelector(
                            ".offcanvas"
                          );
                          offcanvas.classList.remove("show");
                          // Log activity
                          const userName = localStorage.getItem(
                            "logged-username"
                          );
                          logActivity(
                            `${userName} updated ticket ID ${ticket_id} with title: "${title}"`
                          );

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

                deleteButton.addEventListener("click", async function() {
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
                      }).then(function() {
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

          // inprogressTask.addEventListener("dragover", function(e) {
          //   e.preventDefault();
          //   const contentInprogress = document.getElementById(
          //     "content-inprogress"
          //   );
          //   contentDiv.style.opacity = "1";
          // });
          // forApprovalTask.addEventListener("dragover", function(e) {
          //   e.preventDefault();
          // });
          // rejectedTask.addEventListener("dragover", function(e) {
          //   e.preventDefault();
          // });
          // approvedTask.addEventListener("dragover", function(e) {
          //   e.preventDefault();
          // });
          // todoTask.addEventListener("dragover", function(e) {
          //   e.preventDefault();
          // });
          // inprogressTask.addEventListener("drop", function(e) {
          //   e.preventDefault();
          //   inprogressTask.appendChild(selected);
          //   selected.classList.remove("dragg-from-todo");
          //   selected.classList.add("dragg-from-inprogress");
          //   fetchselectedData()
          //     .then(selectedData => {
          //       const ticketId = selectedData.ticket_id;
          //       const ticketStatus = "inprogress";

          //       // Check for undefined or empty values before sending the request
          //       if (!ticketId || !ticketStatus) {
          //         console.log("Ticket ID or Status is missing");
          //         return; // You could show an alert or handle the error here
          //       }

          //       fetch(`${API_BASE_URL}/updateticketStatus`, {
          //         method: "PUT",
          //         headers: {
          //           "Content-Type": "application/json"
          //         },
          //         body: JSON.stringify({
          //           ticket_id: ticketId,
          //           ticket_status: ticketStatus
          //         })
          //       })
          //         .then(response => response.json())
          //         .then(data => console.log("Success:", data))
          //         .catch(error => console.error("Error:", error));
          //     })
          //     .catch(error => console.error("Error:", error));

          //   selected = null;
          // });
          // todoTask.addEventListener("drop", function(e) {
          //   e.preventDefault();
          //   todoTask.appendChild(selected);
          //   selected.classList.remove("dragg-from-inprogress");
          //   selected.classList.add("dragg-from-todo");
          //   fetchselectedData()
          //     .then(selectedData => {
          //       const ticketId = selectedData.ticket_id;
          //       const ticketStatus = "todo";

          //       // Check for undefined or empty values before sending the request
          //       if (!ticketId || !ticketStatus) {
          //         console.log("Ticket ID or Status is missing");
          //         return; // You could show an alert or handle the error here
          //       }

          //       fetch(`${API_BASE_URL}/updateticketStatus`, {
          //         method: "PUT",
          //         headers: {
          //           "Content-Type": "application/json"
          //         },
          //         body: JSON.stringify({
          //           ticket_id: ticketId,
          //           ticket_status: ticketStatus
          //         })
          //       })
          //         .then(response => response.json())
          //         .then(data => console.log("Success:", data))
          //         .catch(error => console.error("Error:", error));
          //     })
          //     .catch(error => console.error("Error:", error));

          //   selected = null;
          // });
          // forApprovalTask.addEventListener("drop", function(e) {
          //   e.preventDefault();
          //   forApprovalTask.appendChild(selected);
          //   fetchselectedData()
          //     .then(selectedData => {
          //       const ticketId = selectedData.ticket_id;
          //       const ticketStatus = "for-approval";

          //       // Check for undefined or empty values before sending the request
          //       if (!ticketId || !ticketStatus) {
          //         console.log("Ticket ID or Status is missing");
          //         return; // You could show an alert or handle the error here
          //       }

          //       fetch(`${API_BASE_URL}/updateticketStatus`, {
          //         method: "PUT",
          //         headers: {
          //           "Content-Type": "application/json"
          //         },
          //         body: JSON.stringify({
          //           ticket_id: ticketId,
          //           ticket_status: ticketStatus
          //         })
          //       })
          //         .then(response => response.json())
          //         .then(data => console.log("Success:", data))
          //         .catch(error => console.error("Error:", error));
          //     })
          //     .catch(error => console.error("Error:", error));
          //   selected = null;
          // });
          // rejectedTask.addEventListener("drop", function(e) {
          //   e.preventDefault();
          //   rejectedTask.appendChild(selected);
          //   fetchselectedData()
          //     .then(selectedData => {
          //       const ticketId = selectedData.ticket_id;
          //       const ticketStatus = "rejected";

          //       // Check for undefined or empty values before sending the request
          //       if (!ticketId || !ticketStatus) {
          //         console.log("Ticket ID or Status is missing");
          //         return; // You could show an alert or handle the error here
          //       }

          //       fetch(`${API_BASE_URL}/updateticketStatus`, {
          //         method: "PUT",
          //         headers: {
          //           "Content-Type": "application/json"
          //         },
          //         body: JSON.stringify({
          //           ticket_id: ticketId,
          //           ticket_status: ticketStatus
          //         })
          //       })
          //         .then(response => response.json())
          //         .then(data => console.log("Success:", data))
          //         .catch(error => console.error("Error:", error));
          //     })
          //     .catch(error => console.error("Error:", error));
          //   selected = null;
          // });
          // approvedTask.addEventListener("drop", function(e) {
          //   e.preventDefault();
          //   approvedTask.appendChild(selected);
          //   fetchselectedData()
          //     .then(selectedData => {
          //       const ticketId = selectedData.ticket_id;
          //       const ticketStatus = "approved";

          //       // Check for undefined or empty values before sending the request
          //       if (!ticketId || !ticketStatus) {
          //         console.log("Ticket ID or Status is missing");
          //         return; // You could show an alert or handle the error here
          //       }

          //       fetch(`${API_BASE_URL}/updateticketStatus`, {
          //         method: "PUT",
          //         headers: {
          //           "Content-Type": "application/json"
          //         },
          //         body: JSON.stringify({
          //           ticket_id: ticketId,
          //           ticket_status: ticketStatus
          //         })
          //       })
          //         .then(response => response.json())
          //         .then(data => console.log("Success:", data))
          //         .catch(error => console.error("Error:", error));
          //     })
          //     .catch(error => console.error("Error:", error));
          //   selected = null;
          // });

          fetch(`${API_BASE_URL}/getboards`)
            .then(response => {
              if (!response.ok) {
                throw new Error("Network response was not ok ");
              }
              return response.json();
            })
            .then(boardData => {
              boardData.map(boardItem => {
                const newTask = document.getElementById(
                  `${boardItem.board_title}-task`
                );
                newTask.addEventListener("dragover", function(e) {
                  e.preventDefault();
                });
                newTask.addEventListener("drop", function(e) {
                  e.preventDefault();
                  newTask.appendChild(selected);
                  fetchselectedData()
                    .then(selectedData => {
                      const ticketId = selectedData.ticket_id;
                      const ticketStatus = boardItem.board_title;

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

  // textarea js

  function applyStyle(style) {
    document.execCommand(style, false, null);
  }

  function addLink() {
    const url = prompt("Enter the URL:");
    if (url) {
      const selection = document.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.textContent = range.toString();
        range.deleteContents();
        range.insertNode(anchor);
      }
    }
  }

  function addImage() {
    const imageUrl = prompt("Enter the image URL:");
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.style.maxWidth = "100%";
      const selection = document.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(img);
      }
    }
  }

  function changecardGB(element) {
    element.style.backgroundColor = "red";
  }
}, 1000);

//  Move all card in this list
async function moveAllTask(from, currentStatus) {
  let todoContainer = document.getElementById(from);
  let inProgressContainer = document.getElementById("move-to").value;

  let newStatus = document.getElementById("move-to").value;

  console.log(newStatus);

  // Remove currentStatus and newStatus as they are not used later on.

  // Select all tasks inside the To-Do container
  let tasks = todoContainer.querySelectorAll(".kanban-item");

  // Move each task to the In-Progress container
  tasks.forEach(task => {
    inProgressContainer.innerHTML += task; // Now this will work correctly
  });

  // only pass the new status
  const payload = { newStatus };
  try {
    const response = await fetch(
      `${API_BASE_URL}/updateticketstatus/${currentStatus}/${project_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      console.log("Ticket Updated");
    } else {
      console.log("Something went wrong");
    }
  } catch (error) {
    messageElement.textContent = "Error connecting to the server.";
    messageElement.className = "message error";
    console.error("Error:", error);
  }
}

// Restore state on page load
document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("[id]").forEach(element => {
    let watchedId = element.id;
    let watchedAnchor = document.getElementById(`${watchedId}-anchor`);
    if (localStorage.getItem(`watched-${watchedId}`)) {
      element.innerHTML = `<i class="ti ti-eye ti-xs me-1"></i>`;
      if (watchedAnchor && !watchedAnchor.innerHTML.includes("ti-check")) {
        watchedAnchor.innerHTML += `<i class="ti ti-check ti-xs me-1"></i>`;
      }
    }
  });
});

function addLabel(color, elementId) {
  // Get or create the label container
  let labelDiv = document.getElementById(`label-color-box-${elementId}`);
  if (!labelDiv) {
    labelDiv = document.createElement("div");
    labelDiv.id = `label-color-box-${elementId}`;
    document.body.appendChild(labelDiv); // Append it to the DOM
  }

  // Create the new color box
  const labelContent = `<div class="color-box rounded" style="background:${color};height:10px;"></div>`;
  labelDiv.innerHTML += labelContent;

  // Save the updated HTML content to localStorage
  saveLabelContent(elementId, labelDiv.innerHTML);
}

function saveLabelContent(elementId, content) {
  // Save the HTML content of the label container to localStorage
  localStorage.setItem(`label-content-${elementId}`, content);

  // Save the elementId to track all saved elements
  let savedElements = JSON.parse(localStorage.getItem("savedElements")) || [];
  if (!savedElements.includes(elementId)) {
    savedElements.push(elementId);
    localStorage.setItem("savedElements", JSON.stringify(savedElements));
  }
}

function loadLabelContent(elementId) {
  // Get the label container
  let labelDiv = document.getElementById(`label-color-box-${elementId}`);
  if (!labelDiv) {
    labelDiv = document.createElement("div");
    labelDiv.id = `label-color-box-${elementId}`;
    document.body.appendChild(labelDiv); // Append it to the DOM
  }

  // Load the saved HTML content from localStorage
  const savedContent = localStorage.getItem(`label-content-${elementId}`);
  if (savedContent) {
    labelDiv.innerHTML = savedContent;
  }
}

// Automatically load all saved label content when the page loads
document.addEventListener("DOMContentLoaded", function() {
  let savedElements = JSON.parse(localStorage.getItem("savedElements")) || [];
  savedElements.forEach(elementId => {
    loadLabelContent(elementId);
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const checkbox = document.querySelector(".form-check-input");
  const progressBar = document.querySelector(".progress-bar");
  const checklistTitle = document.querySelector("#checklist-title");
  const progressText = document.querySelector(".col-1 span"); // Selecting the span showing progress percentage

  checkbox.addEventListener("change", function() {
    if (this.checked) {
      animateProgress(0, 100);
      progressBar.style.width = "100%";
      progressBar.setAttribute("aria-valuenow", "100");
      checklistTitle.style.textDecoration = "line-through";
    } else {
      animateProgress(100, 0);
      progressBar.style.width = "0%";
      progressBar.setAttribute("aria-valuenow", "0");
      checklistTitle.style.textDecoration = "none";
    }
  });

  function animateProgress(start, end) {
    let current = start;
    const step = start < end ? 1 : -1; // Determines the increment or decrement direction
    const interval = setInterval(() => {
      current += step;
      progressText.textContent = `${current}%`;
      if (current === end) {
        clearInterval(interval);
      }
    }, 5); // Smooth transition effect
  }
});

function openCopyCardModal(title, ticketId) {
  const copycardForm = document.getElementById("copy-card-form");
  copycardForm.innerHTML = `                  <div class="mb-4">
                    <label class="form-check-label" for="">Title</label>
                    <textarea class="form-control" rows="2" id="copied-card-title"
                      placeholder="Add Content" required="">${title}</textarea>
                  </div>
                  <div class="mb-4">
                    <label class="form-check-label" for="">Main Board</label>
                    <select class="form-control form-select" name="" id="">
                      <option value="todo">Todo</option>
                      <option value="inprogress">Inprogress</option>
                      <option value="rejected">Rejected</option>
                      <option value="for-approval">For-approval</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                  <div class="mb-4">
                    <label class="form-check-label" for="">List</label>
                    <select class="form-control form-select" name="" id="copied-ticket-status">
                      <option value="todo">Todo</option>
                      <option value="inprogress">Inprogress</option>
                      <option value="rejected">Rejected</option>
                      <option value="for-approval">For-approval</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>

                  <div class="mb-4"><button type="submit" class="btn btn-primary btn-sm me-4">Create
                      Card</button><button type="button"
                      class="btn btn-label-secondary btn-sm cancel-add-item waves-effect waves-light"
                      id="cancel-form-4">Cancel</button>
                  </div>`;
  copycardForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const ticketStatus = document.getElementById("copied-ticket-status").value;

    console.log("form submited", ticketStatus);
    try {
      const response = await fetch(`${API_BASE_URL}/copy-row/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticketStatus
        })
      });
      if (response.ok) {
        console.log("label  added  successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log("error", error);
    }
  });
}

function cardDropdown(event) {
  event.stopPropagation();
}

async function deleteCard(event, ticketId) {
  event.stopPropagation();

  try {
    // Send DELETE request to the API
    const response = await fetch(`${API_BASE_URL}/clearHistory/${ticketId}`, {
      method: "DELETE"
    });

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
    const response = await fetch(`${API_BASE_URL}/deleteticket/${ticketId}`, {
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
      }).then(function() {
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
}

function openMoveCardModal(title, ticketId) {
  const movecardForm = document.getElementById("move-card-form");
  movecardForm.innerHTML = `                  <div class="col-10">
                    <div class="mb-4">
                      <strong><label class="form-check-label" for="">Board</label></strong>
                      <select class="form-control form-select" name="" id="">
                        <option value="todo">Main Bord</option>
                        <option value="inprogress">Main Bord</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-7">
                      <div class="mb-4">
                        <strong><label class="form-check-label" for="">List</label></strong>
                        <select class="form-control form-select" name="" id="move-card-in">
                          <option value="todo">Todo</option>
                          <option value="inprogress">Inprogress</option>
                          <option value="rejected">Rejected</option>
                          <option value="for-approval">For-approval</option>
                          <option value="approved">Approved</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="mb-4">
                        <strong><label class="form-check-label" for="">Position</label></strong>
                        <select class="form-control form-select" name="" id="">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                    </div>
                  </div>



                  <div class="col-5 text-center">
                    <button type="button" class="btn btn-primary me-3 btnCSwitch" id="move-card">Move</button>
                    <button type="reset" class="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">
                      Cancel
                    </button>
                  </div>`;

  document.getElementById("move-card").addEventListener("click", function(e) {
    e.preventDefault();
    const ticketStatus = document.getElementById("move-card-in").value;
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
    });
  });
}

// Restore state on page load
window.addEventListener("DOMContentLoaded", function() {
  const ticketIds = [1, 2, 3]; // Add all your ticket IDs here
  ticketIds.forEach(ticketId => {
    restoreCardState(ticketId);
  });
});

function restoreCardState(ticketId) {
  console.log(`Restoring state for Ticket ID: ${ticketId}`);
  const joinCardAvtar = document.getElementById(`joined-member-${ticketId}`);
  const markTemp = document.getElementById(`mark-card-${ticketId}`);
  const watchTemp = document.getElementById(`watch-notification-${ticketId}`);

  // Restore joinCard state
  const joinedMember = localStorage.getItem(`joined-member-${ticketId}`);
  console.log(`Joined Member for ${ticketId}: `, joinedMember);
  if (joinedMember && joinCardAvtar) {
    joinCardAvtar.innerHTML = joinedMember;
  }

  // Restore markCard state
  const marked = localStorage.getItem(`mark-card-${ticketId}`);
  console.log(`Marked Card for ${ticketId}: `, marked);
  if (marked && markTemp) {
    markTemp.innerHTML = marked;
  }

  // Restore watchNotification state
  const watched = localStorage.getItem(`watch-notification-${ticketId}`);
  console.log(`Watched Notification for ${ticketId}: `, watched);
  if (watched && watchTemp) {
    watchTemp.innerHTML = watched;
  }
}

// function joinCard(ticketId) {
//   const joinCardAvtar = document.getElementById(`joined-member-${ticketId}`);
//   const memberName = localStorage.getItem("logged-username");

//   if (joinCardAvtar && memberName) {
//     const htmlContent = `<div class="d-flex">
//       <div class="avatar me-1 flex-shrink-0">
//         <span class="avatar-initial bg-label-primary rounded-circle">${memberName[0]}${memberName[1]}</span>
//       </div>
//       <div class="avatar me-3 flex-shrink-0">
//         <span class="avatar-initial bg-label-primary rounded-circle"><i class="ti ti-plus"></i></span>
//       </div>
//     </div>`;

//     joinCardAvtar.innerHTML = htmlContent;

//     // Save to localStorage
//     localStorage.setItem(`joined-member-${ticketId}`, htmlContent);
//     console.log(`Saved Joined Member for ${ticketId}`);
//   }
// }

function markCard(ticketId) {
  const markTemp = document.getElementById(`mark-card-${ticketId}`);
  if (markTemp) {
    const htmlContent = `<i class="ti ti-check mb-2"></i>`;
    markTemp.innerHTML = htmlContent;

    // Save to localStorage
    localStorage.setItem(`mark-card-${ticketId}`, htmlContent);
    console.log(`Saved Marked Card for ${ticketId}`);
  }
}

function watchNotification(ticketId) {
  const watchTemp = document.getElementById(`watch-notification-${ticketId}`);
  if (watchTemp) {
    const htmlContent = `<i class="ti ti-eye mb-2"></i>`;
    watchTemp.innerHTML = htmlContent;

    // Save to localStorage
    localStorage.setItem(`watch-notification-${ticketId}`, htmlContent);
    console.log(`Saved Watched Notification for ${ticketId}`);
  }
}

// function for add label body
function addLabelModal(ticketId) {
  const addLabelForm = document.getElementById("add-label-form");
  addLabelForm.innerHTML = `
    <div class="modal-body">
      <form id="label-form">
        <div class="label-gap">
          <label class="form-label">Icon</label>
          <span></span>
          <label class="form-label">Title</label>
        </div>
        <div class="mb-3 icon-title-container">
          <div class="icon-placeholder">
            <i class="fas fa-tags me-2"></i>
          </div>
          <input type="text" class="form-control" id="labelText" placeholder="Add label...">
        </div>
        <div class="mb-3">
          <label class="form-label">Actions</label>
          <div class="label-selection">
            <span>Add to</span>
            <div class="dropdown">
              <button class="btn btn-light dropdown-toggle" type="button" id="labelDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="color-option" id="selectedColor" style="background-color: green;"></span>
              </button>
              <ul class="dropdown-menu" aria-labelledby="labelDropdown">
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(10, 82, 42)')"><span class="color-option" style="background-color: rgb(10, 82, 42);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(233, 34, 34)')"><span class="color-option" style="background-color: rgb(233, 34, 34);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(218, 110, 21)')"><span class="color-option" style="background-color: rgb(218, 110, 21);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(148, 122, 8)')"><span class="color-option" style="background-color: rgb(148, 122, 8);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(116, 128, 241)')"><span class="color-option" style="background-color:rgb(116, 128, 241);"></span></a></li>
                <li><a class="dropdown-item" href="#" onclick="selectColor('rgb(46, 60, 185)')"><span class="color-option" style="background-color: rgb(46, 60, 185);"></span></a></li>
              </ul>
            </div>
            <span>label to the card</span>
          </div>
        </div>
       <button type="button" class="btn btn-light w-100" onclick="openActionModal()">
                    + Add action
                </button>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="button" id="saveLabelButton" class="btn btn-primary">Save</button>
    </div>
  `;

  document
    .getElementById("saveLabelButton")
    .addEventListener("click", function() {
      const selectedColor = document.getElementById("selectedColor").style
        .backgroundColor;
      addLabel(selectedColor, ticketId);
    });
}

function selectColor(color) {
  document.getElementById("selectedColor").style.backgroundColor = color;
}

function openActionModal() {
  var actionModal = new bootstrap.Modal(
    document.getElementById("actionModal"),
    { backdrop: false }
  );
  actionModal.show();
}
