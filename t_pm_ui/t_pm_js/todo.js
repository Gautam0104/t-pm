import { API_ROUTES } from "../apiRoutesHeader.js";
import { joinCardToModal } from "./automation/joinCard.js";
import { moveCardToModal } from "./automation/moveCard.js";
import { shareCardToModal } from "./automation/shareCard.js";
import { copyCardToModal } from "./automation/copyCard.js";
import { removeCardToModal } from "./automation/removeAutomationFeature.js";
import { markDueDateModal } from "./automation/markDueDate.js";
import { setDuedateCardToModal } from "./automation/setDueDate.js";
import {
  retrieveAutomation,
  editAutomation,
  deleteAutomationButton
} from "./automation/automation.js";
import { ELEMENT_IDS } from "./element_id.js";



import { errorLog } from "./error.js";

import { addLabelModal } from "./automation/addLabel.js";

import { addLabelAutomation } from "./automation/automationLogic.js";

import { leaveCard } from "./leaveCard.js";

import { joinCard } from "./joinCard.js";

//import { getTicketComments } from "./ticket-comments.js";



import { initializeTabManager } from './automation/tabManager.js';

import { loadMirrorModal } from "./mirrorModal.js";
import { loadCustomCardModal } from "./customFieldModal.js";

// import {loadTabCustomFields} from "./customFieldModal.js";




const API_BASE_URL = ENV.API_BASE_URL;
window.onload = function () {
  setTimeout(function () {
    document.getElementById(ELEMENT_IDS.PAGE_LOADING).style.display = "none";
  }, 500);
};

var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
var creator_id = urlParams.get("user_id");
var project_name = urlParams.get("pname");
setTimeout(function () {


  fetch(`${API_BASE_URL}${API_ROUTES.CREATE_PROJECT}/${project_id}`,)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const projectTitle = document.getElementById(ELEMENT_IDS.PROJECT_TITLE);
      const titleContent = `<input type="text" class="form-control" value = "${data.project_name}" id="project-title-input">`;

      projectTitle.innerHTML += titleContent;
    });
  // Function to fetch and create elements
  async function fetchDataAndCreateElements() {
    return await fetch(`${API_BASE_URL}${API_ROUTES.TICKET}/${project_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}` // Add the token to the Authorization header
        }
      }
    )
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(async data => {
        // Fetch board data first
        const boardResponse = await fetch(`${API_BASE_URL}/get-boards?board_name=${project_name}`);
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
<div class="dropZone d-flex justify-content-between ${element.ticket_id} flex-wrap align-items-center mb-2" 
     style="...">
              <div class="d-flex ">
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
                 src="${API_BASE_URL}/uploads/${element.card_image}" onerror="this.style.display='none';">
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

        return document.querySelectorAll(ELEMENT_IDS.DRAG_EVENT);
      });
  }

  const cardImg = document.getElementById(ELEMENT_IDS.CARD_IMAGE);

  // Call the function and use the returned elements
  fetchDataAndCreateElements()
    .then(trydraggElements => {
      // Perform actions on the elements here
      trydraggElements.forEach(element => {
        element.addEventListener("click", function (e) {
          const offcanvas = document.querySelector(ELEMENT_IDS.OFFCANVAS);
          // const backdropWrapper = document.getElementById("backdrop");
          offcanvas.classList.add("show");

   
          // backdropWrapper.innerHTML = backdropContent;
          let selected = e.currentTarget.id;
          let ticket_id = selected;
          

          // Fetch Ticket Data from API
          fetch(`${API_BASE_URL}${API_ROUTES.GET_TICKET_BY_ID}/${ticket_id}`)
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

                const isoDateupdate1 = `${element.due_date}`;

                // Convert to a Date object
                const dateupdate1 = new Date(isoDateupdate1);

                // Extract date components
                const day2 = dateupdate1.getDate().toString().padStart(2, "0");
                const month2 = (dateupdate1.getMonth() + 1)
                  .toString()
                  .padStart(2, "0"); // Months are 0-based
                const year2 = dateupdate1.getFullYear();

                // Extract time components
                const hours2 = dateupdate1
                  .getHours()
                  .toString()
                  .padStart(2, "0");
                const minutes2 = dateupdate1
                  .getMinutes()
                  .toString()
                  .padStart(2, "0");
                const seconds2 = dateupdate1
                  .getSeconds()
                  .toString()
                  .padStart(2, "0");

                // Combine date and time
                const formattedduedate = `${day2}/${month2}/${year2} , ${hours2}:${minutes2}:${seconds2}`;
                function stripTags(html) {
                  return html.replace(/<\/?[^>]+(>|$)/g, "");
                }

                const offcanvasDiv = document.getElementById(ELEMENT_IDS.TICKET_TAB_OFFCANVAS);
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
                                                        data-bs-target="#tab-customs" aria-selected="false"
                                                        tabindex="-1" role="tab">
                                                        <i class="ti ti-edit ti-18px me-1"></i>
                                                        <span class="align-middle">Custom button</span>
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
                                                        <input class="form-control" id="due-date" value="${formattedduedate}" readonly="readonly">
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
                                                <!--  Customs buttons -->
                                                <div class="tab-content p-0">
                                                <div class="tab-pane fade text-heading" id="tab-customs" role="tabpanel">
                                                <div id="tabCustomFieldsContainer" class="p-3"></div>
                                           
                                                </div>
                                                </div>
                                                
                                                <!--  Customs buttons -->
                                                <div class="tab-content p-0">
                                                <div class="tab-pane fade text-heading" id="tab-comments" role="tabpanel">
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
                                                                <button class="nav-link  d-flex align-items-center border-0" id="customFieldCardFeature">
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
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" data-bs-toggle="modal" data-bs-target="#addLabelModal" onclick="addLabelModal('${element.ticket_id}')" >
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
                                                                 
                                                                <li class="nav-item d-flex justify-content-end">
                                                                <button class="nav-link d-flex align-items-center border-0" data-bs-toggle="modal" 
          data-bs-target="#aboutautomationModal" 
          onclick="aboutautomation('${element.ticket_id}')">
    <i class="fa-solid fa-power-off me-2"></i>
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
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" id="mirrorCardFeature">
                                                                    <i class="fas fa-box me-2"></i> Mirror
                                                                </button>
                                                            </li>
                                                            
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
                                                             <li class="nav-item">
                                                             <button class="nav-link  d-flex align-items-center border-0  w-100" id="add-button-dropdown"  id="create-rule-automation" data-bs-toggle="modal" data-bs-target="#createRule">
                                                                    <i class="ti ti-arrow-up-right ti-xs me-1"></i> <span class="align-middle">Create a rule</span>
                                                                </button>
                                                                         
                                                             </li>
                                                            <li class="nav-item">
                                                                <button class="nav-link  d-flex align-items-center border-0  w-100" data-bs-toggle="modal" data-bs-target="#sharecardModal" id="shareCardFeature">
                                                                    <i class="fas fa-share me-2"></i> Share 
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
                
                // Initialize mirror modal event listener
                const mirrorCardFeature = document.getElementById("mirrorCardFeature");
                if (mirrorCardFeature) {
                  mirrorCardFeature.addEventListener("click", function() {
                  var mirrorModal = new bootstrap.Modal(document.getElementById("mirrorModal"));
                  mirrorModal.show();
                    loadMirrorModal(element.ticket_id);
                  });
                }

                // Initialize custom field modal event listener
                const customFieldCardFeature = document.getElementById("customFieldCardFeature");
                if (customFieldCardFeature) {
                  customFieldCardFeature.addEventListener("click", function() {
                    var customFieldModal = new bootstrap.Modal(document.getElementById("customFieldModal"));
                    customFieldModal.show();
                    loadCustomCardModal(element.project_id);
                  });
                }
               
              

                  

                const container = document.getElementById(ELEMENT_IDS.TAB_CUSTOM_CONTAINER);

                async function loadCustomFields(ticketId) {
                  try {
                    const res = await fetch(`${API_BASE_URL}${API_ROUTES.CUSTOM_VALUE_BY_TICKETS}/${ticketId}`);
                    const data = await res.json();
                
                    if (!Array.isArray(data) || data.length === 0) {
                      

                      async function loadCustom(projectId, ticketId) {
                        try {
                          const res = await fetch(`${API_BASE_URL}${API_ROUTES.CUSTOM_FIELD}/${projectId}`);
                          const data = await res.json();
                      
                          if (!Array.isArray(data) || data.length === 0) {
                            container.innerHTML = `<p class="text-danger">No custom fields available.</p>`;
                            return;
                          }
                      
                          let html = `<h3>Custom Fields</h3><form id="customFieldsForm">`;
                      
                          data.forEach(field => {
                            html += `<div class="mb-3">
                              <label for="field_${field.id}" class="form-label"><strong>${field.name}</strong></label>`;
                      
                            switch (field.type) {
                              case 'text':
                                html += `<input type="text" class="form-control" id="field_${field.id}" name="${field.id}" value="${field.value || ''}" />`;
                                break;
                      
                              case 'number':
                                html += `<input type="number" class="form-control" id="field_${field.id}" name="${field.id}" value="${field.value || ''}" />`;
                                break;
                      
                              case 'date':
                                html += `<input type="date" class="form-control" id="field_${field.id}" name="${field.id}" value="${field.value || ''}" />`;
                                break;
                      
                              case 'checkbox':
                                html += `<input type="checkbox" class="form-check-input" id="field_${field.id}" name="${field.id}" ${field.value ? 'checked' : ''} />`;
                                break;
                      
                              case 'dropdown':
                                html += `<select class="form-select" id="field_${field.id}" name="${field.id}">`;
                                (field.options || []).forEach(opt => {
                                  const selected = opt.id === field.value ? 'selected' : '';
                                  html += `<option value="${opt.id}" ${selected} style="color: ${opt.color}">${opt.label}</option>`;
                                });
                                html += `</select>`;
                                break;
                      
                              default:
                                html += `<input type="text" class="form-control" id="field_${field.id}" name="${field.id}" placeholder="Unsupported field type (${field.type})" />`;
                                break;
                            }
                      
                            html += `</div>`;
                          });
                      
                          // Submit all fields with one button
                          html += `<button type="submit" class="btn btn-primary">Submit All</button></form>`;
                          container.innerHTML = html;
                      
                          const form = document.getElementById('customFieldsForm');
                          form.addEventListener('submit', async (e) => {
                            e.preventDefault();
                      
                            const formData = new FormData(form);
                            const payload = [];
                      
                            for (const field of data) {
                              const input = form.querySelector(`[name="${field.id}"]`);
                              let value;
                      
                              if (input.type === 'checkbox') {
                                value = input.checked;
                              } else {
                                value = input.value;
                              }
                      
                              payload.push({
                                custom_id: field.id,
                                value: value,
                                project_id: projectId,
                                ticket_id: ticketId
                              });
                            }
                      
                            try {
                              const response = await fetch(`${API_BASE_URL}${API_ROUTES.CUSTOM_VALUE_BY_TICKETS}`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(payload)
                              });
                      
                              if (!response.ok) {
                                throw new Error('Failed to submit all fields');
                              }
                      
                              const result = await response.json();
                              Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: `Custom field submitted successfully!`,
                                confirmButtonText: "OK"
                              });
                            } catch (err) {
                              console.error('Bulk submit error:', err);
                              Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: `Failed to submit Custom fields`,
                                confirmButtonText: "Retry"
                              });
                            }
                          });
                      
                        } catch (error) {
                          console.error('Error fetching data:', error);
                          container.innerHTML = `<p class="text-danger">Failed to load custom fields.</p>`;
                        }
                      }
                      
                      // Example usage
                      const projectId = project_id;
                       const ticketId = element.ticket_id
                      loadCustom(projectId, ticketId);
                      
                    }
                
                    let html = `<h3>Custom Fields</h3><form id="customFieldsForm">`;
                
                    data.forEach(field => {
                      html += `<div class="mb-3">
                        <label for="field_${field.custom_field_id}" class="form-label"><strong>${field.custom_field_name}</strong></label>`;
                
                      switch (field.custom_field_type) {
                        case 'text':
                          html += `<input type="text" class="form-control" id="field_${field.custom_field_id}" name="${field.custom_field_name}" value="${field.value || ''}" />`;
                          break;
                
                        case 'number':
                          html += `<input type="number" class="form-control" id="field_${field.custom_field_id}" name="${field.custom_field_name}" value="${field.value || ''}" />`;
                          break;
                
                        case 'date':
                          html += `<input type="date" class="form-control" id="field_${field.custom_field_id}" name="${field.custom_field_name}" value="${field.value || ''}" />`;
                          break;
                
                        case 'checkbox':
                          html += `<input type="checkbox" class="form-check-input" id="field_${field.custom_field_id}" name="${field.custom_field_name}" ${field.value ? 'checked' : ''} />`;
                          break;
                
                          case 'dropdown':
                            html += `<select class="form-select" id="field_${field.custom_field_id}" name="${field.custom_field_id}">`;
                            (field.options || []).forEach(opt => {
                              const selected = String(opt.id) === String(field.value) ? 'selected' : '';
                              html += `<option value="${opt.id}" ${selected} style="color: ${opt.color}">${opt.label}</option>`;
                            });
                            html += `</select>`;
                            break;
                          
                
                        default:
                          html += `<input type="text" class="form-control" id="field_${field.id}" name="${field.name}" placeholder="Unsupported field type (${field.type})" />`;
                          break;
                      }
                
                      // Add individual submit button
                      html += `<button type="button" class="btn btn-sm btn-primary mt-2 single-submit" data-ticket-custom-value-id="${field.ticket_custom_value_id}" data-field-id="${field.custom_field_id}" data-field="${field.custom_field_name}">Update</button>`;
                
                      html += `</div>`;
                    });
                
                    html += `</form>`;
                    container.innerHTML = html;
                
                    // Add event listeners for each "single-submit" button
                    document.querySelectorAll('.single-submit').forEach(button => {
                      button.addEventListener('click', async (e) => {
                        const fieldName = e.target.getAttribute('data-field');
                        const customId =  e.target.getAttribute('data-field-id');
                        const ticketCustomValueId = e.target.getAttribute('data-ticket-custom-value-id');
                        const input = document.getElementById(`field_${customId}`);

                
                        let fieldValue;
                        if (input.type === 'checkbox') {
                          fieldValue = input.checked;
                        } else {
                          fieldValue = input.value;
                        }
                
                        const payload = {
                          value: fieldValue,
                          
        
                        };
                
                        try {
                          const response = await fetch(`${API_BASE_URL}${API_ROUTES.CUSTOM_VALUE_BY_TICKETS}/${ticketCustomValueId}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                          });
                        
                          if (!response.ok) {
                            throw new Error('Failed to submit field');
                          }
                        
                          Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: `Field "${fieldName}" submitted successfully!`,
                            confirmButtonText: "OK"
                          });
                        
                        } catch (err) {
                          console.error(`Submit error for ${fieldName}:`, err);
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: `Failed to submit "${fieldName}"`,
                            confirmButtonText: "Retry"
                          });
                        }
                        
                      });
                    });
                
                  } catch (error) {
                    console.error('Error fetching data:', error);
                    container.innerHTML = `<p class="text-danger">Failed to load custom fields.</p>`;
                  }
                }

               const ticketId = element.ticket_id
               loadCustomFields(ticketId);

              
                //  all event listner of action tab

                //fetch comments
                const commentTab = document.getElementById(ELEMENT_IDS.TAB_COMMENT);
                
                fetch(`${API_BASE_URL}${API_ROUTES.GET_COMMENT}/${element.ticket_id}`)
                .then(response => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                  }
                  return response.json();
                })
                .then(data => {
                  
                  data.map(comment => { 
                    const isoDate = `${comment.changed_at}`;
                    const date = new Date(isoDate);
                    const formattedDate = date.toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    });
                    const commentContent = `
                    

                     <div class="media mb-4 d-flex align-items-center">
                                                    <div class="avatar me-3 flex-shrink-0">
                                                    <span class="avatar-initial bg-label-success rounded-circle">${comment.changed_by[0]+comment.changed_by[1]}</span>
                                                    </div>
                                                    <div class="media-body">
                                                    <p class="mb-0"> ${comment.change_description}</p>
                                                    <small class="text-muted">${formattedDate}</small>
                                                    </div>
                                                </div>
                    
                    `;
                    commentTab.innerHTML += commentContent;
                  }
                  )
                });
             
                //fetch comments end

                document
                  .getElementById(ELEMENT_IDS.STYLE_BOLD)
                  .addEventListener("click", function () {
                    applyStyle("bold");
                  });
                document
                  .getElementById(ELEMENT_IDS.STYLE_ITALIC)
                  .addEventListener("click", function () {
                    applyStyle("italic");
                  });
                document
                  .getElementById(ELEMENT_IDS.STYLE_UNDERLINE)
                  .addEventListener("click", function () {
                    applyStyle("underline");
                  });
                // document
                //   .getElementById("styleDot")
                //   .addEventListener("click", function() {
                //     applyStyle("insertUnorderedList");
                //   });
                document
                  .getElementById(ELEMENT_IDS.ADD_LINK)
                  .addEventListener("click", function () {
                    addLink();
                  });
                document
                  .getElementById(ELEMENT_IDS.ADD_IMAGE)
                  .addEventListener("click", function () {
                    addImage();
                  });
                document
                  .getElementById(ELEMENT_IDS.MARD_CARD_FEATURE)
                  .addEventListener("click", function () {
                    markCard(element.ticket_id);
                  });
                document
                  .getElementById(ELEMENT_IDS.WATCH_CARD_FEATURE)
                  .addEventListener("click", function () {
                    watchNotification(element.ticket_id);
                  });
                document
                  .getElementById(ELEMENT_IDS.COPY_CARD_FEATURE)
                  .addEventListener("click", function () {
                    copyCardToModal(
                      element.title,
                      element.ticket_id,
                      element.ticket_status
                    );
                  });
                document
                  .getElementById(ELEMENT_IDS.MOVE_CARD_FEATURE)
                  .addEventListener("click", function () {
                    moveCardToModal(
                      element.title,
                      element.ticket_id,
                      element.ticket_status
                    );
                  });

                document
                  .getElementById(ELEMENT_IDS.SHARE_CARD_FEATURE)
                  .addEventListener("click", function () {
                    shareCardToModal(
                      element.title,
                      element.ticket_id,
                      element.ticket_status
                    );
                  });


                const joinAutomationButton = document.getElementById(
                  ELEMENT_IDS.JOIN_AUTOMATION
                );
                const moveAutomationButton = document.getElementById(
                  ELEMENT_IDS.MOVE_AUTOMATION
                );

                const copyAutomationButton = document.getElementById(
                  ELEMENT_IDS.COPY_AUTOMATION
                );
                const markduedateAutomationButton = document.getElementById(
                  ELEMENT_IDS.MARK_DUEDATE_AUTOMATION
                );
                const setduedateAutomationButton = document.getElementById(
                  ELEMENT_IDS.SET_DUEDATE_AUTOMATION
                );
                const removeFeatureAutomationButton = document.getElementById(
                  ELEMENT_IDS.REMOVE_CARD_FEATURE
                );

                setduedateAutomationButton.addEventListener("click", () => {
                  setDuedateCardToModal(element.title, element.ticket_id, element.ticket_status);
                });
                markduedateAutomationButton.addEventListener("click", () => {
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


                fetch(`${API_BASE_URL}${API_ROUTES.GET_JOIN_CARD}/${element.ticket_id}`)
                .then(response => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                  }
                  return response.json();
                })
                .then(data => {
                  const loggedUsername = localStorage.getItem("logged_username");
                  
                  
                  data.map(item => {
                    const joinCardButton = document.getElementById(ELEMENT_IDS.JOIN_BUTTON);
                    const leaveCardButton = document.getElementById(
                      ELEMENT_IDS.LEAVE_BUTTON
                    );
                    if (item.joined_username === loggedUsername) {
                      leaveCardButton.style.display = "block";
                      joinCardButton.style.display = "none";
                    } else {
                      leaveCardButton.style.display = "none";
                      joinCardButton.style.display = "block";
                    }
                  });
                });

                retrieveAutomation(element.ticket_id);
                retrieveAutomationRule(element.ticket_id);
          

                // card image zone in modal
                const imageArea = document.getElementById(
                  ELEMENT_IDS.ACTIVITY_CARD_IMAGE_AREA
                );
                const cardImage = `<img src="${API_BASE_URL}/uploads/${element.card_image}" alt="ticketImage" width="100%" height="100%" >`;
                imageArea.innerHTML = cardImage;

                flatpickr("#due-date", {
                  enableTime: true,
                  dateFormat: "Y-m-d H:i", // Format for Date and Time
                  minDate: "today" // Set minimum date to today
                });

                // fetch ticket history
                fetch(`${API_BASE_URL}${API_ROUTES.GET_USERS}`)
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
                        ELEMENT_IDS.TICKET_OWNER
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
                    ELEMENT_IDS.ATTACHMENT_CONTENT
                  );
                  const activityImages = `<span class="badge bg-label-secondary m-2">Attachment #${index +
                    1}</span>
                                                           <img src="${API_BASE_URL}/uploads/${item}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingModal">`;

                  attachmentDiv.innerHTML += activityImages;
                  const activityImageArea = document.getElementById(
                    ELEMENT_IDS.ACTIVITY_IMAGE_AREA
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
                fetch(`${API_BASE_URL}${API_ROUTES.TICKET_HISTORY}/${ticket_id}`)
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
                        ELEMENT_IDS.HISTORY_CONTENT
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

                      document.addEventListener("DOMContentLoaded", function () {
                        let imgElement = document.getElementById(
                          ELEMENT_IDS.CARD_IMAGE_PREVIEW_UPDATE
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
                          ELEMENT_IDS.ATTACHMENT_CONTENT_HISTORY
                        );
                        const activitypreImages = `<span class="badge bg-label-secondary m-2">Attachment #${index +
                          1}</span>
                                                                           <img src="${API_BASE_URL}/uploads/${item}" alt="ticketImage" width="100%" height="100%" data-bs-toggle="modal" data-bs-target="#pricingModal">`;

                        attachmenthistoryDiv.innerHTML += activitypreImages;
                        const activityImageArea = document.getElementById(
                          ELEMENT_IDS.ACTIVITY_IMAGE_AREA
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

                const closeButton = document.getElementById(ELEMENT_IDS.OFFCANVAS_CLOSE);
                const deleteButton = document.getElementById(ELEMENT_IDS.DELETE_TICKET);
                
                closeButton.addEventListener("click", function () {
                  selected = null;
                 
                  const offcanvas = document.querySelector(ELEMENT_IDS.OFFCANVAS);
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
                      ELEMENT_IDS.CARD_IMAGE_PREVIEW
                    );
                    const previewContainerUpdate = document.getElementById(
                      ELEMENT_IDS.CARD_IMAGE_PREVIEW_UPDATE
                    );
                    const previewUpdate = document.getElementById(
                      ELEMENT_IDS.IMAGE_PREVIEW_UPDATE
                    );
                    const previewImage = document.getElementById(
                      ELEMENT_IDS.CARD_IMAGE_PREVIEW_IMG
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
                document.getElementById(ELEMENT_IDS.TICKET_FORM).addEventListener("submit", async function (e) {
                  e.preventDefault();
                
                
                  // Ensure element exists
                  if (typeof element === "undefined" || !element) {
                    console.error("Error: 'element' is not defined or missing");
                    alert("An error occurred. Please try again.");
                    return;
                  }
                
                 
                
                  const ticket_id = element?.ticket_id?.toString().trim() || "";
                  const ticket_status = element?.ticket_status?.toString().trim() || "Backlog"; // Default fallback
                
                  const titleElement = document.getElementById(ELEMENT_IDS.TICKET_TITLE);
                  const descriptionElement = document.getElementById(ELEMENT_IDS.TICKET_DESCRIPTION);
                  const dueDateElement = document.getElementById(ELEMENT_IDS.TICKET_DUEDATE);
                  const ticketEtaElement = document.getElementById(ELEMENT_IDS.TICKET_ETA);
                  const ticketOwnerElement = document.getElementById(ELEMENT_IDS.TICKET_OWNER);
                  const imageElement = document.getElementById(ELEMENT_IDS.TICKET_IMAGE);
                  const cardImageElement = document.getElementById(ELEMENT_IDS.TICKET_CARD_IMAGE);
                  const changedBy = localStorage.getItem("logged_username");
                
                  if (!titleElement || !descriptionElement || !ticketOwnerElement) {
                    console.error("Error: One or more required elements are missing from the DOM.");
                    alert("Form elements are missing. Please check your form structure.");
                    return;
                  }
                
                  const title = titleElement?.value?.trim() || "";
                  const description = descriptionElement?.innerHTML?.trim() || element?.description?.trim() || "No description provided"; // Use innerHTML for contenteditable
                  const due_date = dueDateElement?.value?.trim() || "";
                  const ticket_eta = ticketEtaElement?.value?.trim() || "";
                  const ticket_owner = ticketOwnerElement?.value?.trim() || "";
                  const images = imageElement?.files || [];
                  const cardImage = cardImageElement?.files || [];
                
                
                  // Validate required fields
                  if (!ticket_id || !title || !description || !ticket_status || !ticket_owner) {
                    console.error("Validation failed: Missing required fields.");
                    alert("Please fill in all required fields.");
                    return;
                  }
                
                  const formData = new FormData();
                  formData.append("ticket_id", ticket_id);
                  formData.append("title", title);
                  formData.append("description", description); // Correctly append the description
                  formData.append("status", "backlog");
                  formData.append("priority", "Medium");
                  formData.append("due_date", due_date);
                  formData.append("ticket_status", ticket_status);
                  formData.append("ticket_eta", ticket_eta);
                  formData.append("ticket_owner", ticket_owner);
                  formData.append("changed_by", changedBy);
                
                  for (const image of images) {
                    formData.append("images", image);
                  }
                  if (cardImage.length > 0) {
                    formData.append("card_image", cardImage[0]);
                  }
                
                  document.getElementById(ELEMENT_IDS.MESSAGE).textContent = "Updating ticket...";
                
                  try {
                    const response = await fetch(`${API_BASE_URL}${API_ROUTES.UPDATE_TICKET}`, {
                      method: "PUT",
                      body: formData,
                    });
                    const data = await response.json();
                
                   
                
                    if (data.message) {
                      document.querySelector(ELEMENT_IDS.OFFCANVAS)?.classList.remove("show");
                      await Swal.fire({
                        title: "Ticket Updated Successfully",
                        text: "The ticket has been updated successfully.",
                        icon: "success",
                        confirmButtonText: "Ok!",
                      });
                      window.location.reload();
                    } else {
                      document.getElementById(ELEMENT_IDS.MESSAGE).textContent = data.error || "An error occurred.";
                      document.getElementById(ELEMENT_IDS.MESSAGE).style.color = "red";
                    }
                  } catch (error) {
                    errorLog(error);
                  }
                });


                // delete ticket 

                deleteButton.addEventListener("click", async function () {

                  const ticket_id = element.ticket_id;
                  try {
                    // Send DELETE request to the API
                    const response = await fetch(
                      `${API_BASE_URL}${API_ROUTES.CLEAR_TICKET_HISTORY}/${ticket_id}`,
                      {
                        method: "DELETE"
                      }
                    );


                    if (response.ok) {
                      console.log("ticket history clear");
                    } else {
                      console.log("something went wrong");
                    }
                  } catch (error) {
                    console.error("Delete ticket  error:", error);
                    res.status(500).json({
                      message: "'An error occurred. Please try again later.', 'error'"
                    });
                  }
                  try {
                    // Send DELETE request to the API
                    const response = await fetch(
                      `${API_BASE_URL}${API_ROUTES.DELETE_TICKET}/${ticket_id}`,
                      {
                        method: "DELETE"
                      }
                    );

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
                    console.error("Delete ticket  error:", error);
                    res.status(500).json({
                      message: "'An error occurred. Please try again later.', 'error'"
                    });
                  }
                });
              });
            });
        });

        element.addEventListener("dragstart", e => {
          let selected = e.target;
          let ticket_id = selected.classList[2];
          function fetchselectedData() {
            return fetch(`${API_BASE_URL}${API_ROUTES.GET_TICKET_BY_ID}/${ticket_id}`)
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

          fetch( `${API_BASE_URL}/get-boards?board_name=${project_name}`)
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
                newTask.addEventListener("dragover", function (e) {
                  e.preventDefault();
                });
                newTask.addEventListener("drop", function (e) {
                  e.preventDefault();
                  newTask.appendChild(selected);
                  fetchselectedData()
                    .then(selectedData => {
                      const ticketId = selectedData.ticket_id;
                      const ticketStatus = boardItem.board_title;

                      // Check for undefined or empty values before sending the request
                      if (!ticketId || !ticketStatus) {
                      
                        return; // You could show an alert or handle the error here
                      }

                      fetch(`${API_BASE_URL}${API_ROUTES.UPDATE_TICKET_STATUS}`, {
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
    .catch(error => errorLog(error));

  const closeCanvase = () => {
    const offcanvas = document.querySelector(ELEMENT_IDS.OFFCANVAS);
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
}, 500);

//  Move all card in this list
async function moveAllTask(from, currentStatus) {
  let todoContainer = document.getElementById(from);
  let inProgressContainer = document.getElementById(ELEMENT_IDS.TICKET_MOVE_TO).value;

  let newStatus = document.getElementById(ELEMENT_IDS.TICKET_MOVE_TO).value;


  

  // Select all tasks inside the To-Do container
  let tasks = todoContainer.querySelectorAll(ELEMENT_IDS.KANBAN_ITEMS);

  // Move each task to the In-Progress container
  tasks.forEach(task => {
    inProgressContainer.innerHTML += task; 
  });

  // only pass the new status
  const payload = { newStatus };
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.UPDATE_CURRENT_STATUS}/${currentStatus}/${project_id}`,
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
    errorLog(error)
  }
}

// Restore state on page load
document.addEventListener("DOMContentLoaded", function () {
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
document.addEventListener("DOMContentLoaded", function () {
  let savedElements = JSON.parse(localStorage.getItem("savedElements")) || [];
  savedElements.forEach(elementId => {
    loadLabelContent(elementId);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const checkbox = document.querySelector(ELEMENT_IDS.FORM_CHECK_INPUT);
  const progressBar = document.querySelector(ELEMENT_IDS.FORM_PROGRESS_BAR);
  const checklistTitle = document.querySelector(ELEMENT_IDS.FORM_CHECKLIST_TITLE);
  const progressText = document.querySelector(ELEMENT_IDS.FORM_PROGRESS_TEXT); // Selecting the span showing progress percentage

  checkbox.addEventListener("change", function () {
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
  const copycardForm = document.getElementById(ELEMENT_IDS.FORM_COPY_CARD);
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
  copycardForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const ticketStatus = document.getElementById(ELEMENT_IDS.COPIED_TICKET_STATUS).value;

   
    try {
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.COPY_ROW}/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticketStatus
        })
      });
      if (response.ok) {
        
        window.location.reload();
      }
    } catch (error) {
      errorLog(error)
    }
  });
}

function openShareCardModal(title, ticketId) {
  const copycardForm = document.getElementById(ELEMENT_IDS.FORM_SHARE_CARD);
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
  copycardForm.addEventListener("submit", async function (e) {
    e.preventDefault();


  });
}

function cardDropdown(event) {
  event.stopPropagation();
}

async function deleteCard(event, ticketId) {
  event.stopPropagation();

  try {
    // Send DELETE request to the API
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.CLEAR_TICKET_HISTORY}/${ticketId}`, {
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
    errorLog(error)
  }

  try {
    // Send DELETE request to the API
    const response = await fetch(`${API_BASE_URL}${API_ROUTES.DELETE_TICKET}/${ticketId}`, {
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
    errorLog(error)
  }
}

function openMoveCardModal(title, ticketId) {
  const movecardForm = document.getElementById(ELEMENT_IDS.FORM_MOVE_CARD);
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

  document.getElementById(ELEMENT_IDS.MOVE_CARD).addEventListener("click", function (e) {
    e.preventDefault();
    const ticketStatus = document.getElementById(ELEMENT_IDS.FORM_MOVE_CARD_IN).value;
    // Check for undefined or empty values before sending the request
    if (!ticketId || !ticketStatus) {
      return; // You could show an alert or handle the error here
    }
    fetch(`${API_BASE_URL}${API_ROUTES.UPDATE_TICKET_STATUS}`, {
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
window.addEventListener("DOMContentLoaded", function () {
  const ticketIds = [1, 2, 3]; // Add all your ticket IDs here
  ticketIds.forEach(ticketId => {
    restoreCardState(ticketId);
  });
});

function restoreCardState(ticketId) {
  const joinCardAvtar = document.getElementById(`joined-member-${ticketId}`);
  const markTemp = document.getElementById(`mark-card-${ticketId}`);
  const watchTemp = document.getElementById(`watch-notification-${ticketId}`);

  // Restore joinCard state
  const joinedMember = localStorage.getItem(`joined-member-${ticketId}`);
  if (joinedMember && joinCardAvtar) {
    joinCardAvtar.innerHTML = joinedMember;
  }

  // Restore markCard state
  const marked = localStorage.getItem(`mark-card-${ticketId}`);
  if (marked && markTemp) {
    markTemp.innerHTML = marked;
  }

  // Restore watchNotification state
  const watched = localStorage.getItem(`watch-notification-${ticketId}`);
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
    
  }
}

function watchNotification(ticketId) {
  const watchTemp = document.getElementById(`watch-notification-${ticketId}`);
  if (watchTemp) {
    const htmlContent = `<i class="ti ti-eye mb-2"></i>`;
    watchTemp.innerHTML = htmlContent;

    // Save to localStorage
    localStorage.setItem(`watch-notification-${ticketId}`, htmlContent);
   
  }
}



function selectColor(color) {
  document.getElementById(ELEMENT_IDS.SELETCT_COLOR).style.backgroundColor = color;
}

function openActionModal() {
  var actionModal = new bootstrap.Modal(
    document.getElementById(ELEMENT_IDS.ACTION_MODAL),
    { backdrop: false }
  );
  actionModal.show();
}
export function newRule() {
  Swal.fire({
    title: "A new rule added",
    text: "A new rule automation added on ticket board.",
    icon: "success",
    confirmButtonText: "Ok!",
  });
}


function retrieveAutomationRule(tickerId){
  fetch(`${API_BASE_URL}${API_ROUTES.AUTOMATION_DATA}/${tickerId}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const automationRule = document.getElementById(`rule-view`);

    data.map(item => {
      const ruleContent = `<div class="main-content  border py-6 " style="margin-top: 50px;" >      
                          <div class="content-section">
                            <div class="row d-flex justify-content-between">
                              <div class="col-8">
                                <ul class="d-flex">
                                  <li class="menu-item me-1">
                                    <a href="" class="menu-link">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-tag"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-pencil"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-copy"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-trash"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-location"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item me-1">
                                    <a href="" class="btn btn-primary">
                                      <i class="ti ti-bell-plus-filled me-2"></i>Add to another board
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="col-4"><span class=""><a href="" style="color:#333232;">Enabled on 1
                                    board,</a>last modified a month
                                  ago</span></div>
                            </div>
                                  <div class="row d-flex justify-content-between px-10 py-3">
                              <div class="col d-flex p-4 w-100 bg-light rounded" >
                                 <span class="fw-medium">${item.button_title}</span>
                              </div>
                            </div>

                            <div class="row d-flex justify-content-between px-6">
                              <div class="col d-flex px-4 w-100  rounded">
                                <div class="d-flex me-5 ms-1">
                                  <input type="checkbox" class="form-check-input me-1">
                                  <span>Enable automation on board</span>
                                </div>
                                <div class="d-flex me-5 ms-1">
                                  <input type="checkbox" class="form-check-input me-1">
                                  <span>Disable automation on board</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          </div>
      
      
      
      
      

      
      `;

      automationRule.innerHTML += ruleContent;
    });
  });

}





window.editAutomation = editAutomation;
window.deleteAutomationButton = deleteAutomationButton;
window.moveAllTask = moveAllTask;
window.openActionModal = openActionModal;
window.openMoveCardModal = openMoveCardModal;
window.openCopyCardModal = openCopyCardModal;
window.openShareCardModal = openShareCardModal;
window.selectColor = selectColor;
window.addLabelModal = addLabelModal;
window.cardDropdown = cardDropdown;
window.addLabelModal = addLabelModal;
window.addLabelAutomation = addLabelAutomation;
window.leaveCard = leaveCard;
window.joinCard = joinCard;


// Initialize tab manager when the create rule modal is shown
document.getElementById('createRule').addEventListener('show.bs.modal', function () {
  initializeTabManager();
});

// Add the loadCustomCardModal function
// function loadCustomCardModal(ticketId) {
//   const customFieldModal = document.getElementById("customFieldModal");
//   if (!customFieldModal) {
//     console.error("Custom field modal element not found");
//     return;
//   }

//   // Initialize the modal
//   const modal = new bootstrap.Modal(customFieldModal);
//   modal.show();

//   // Add your custom field modal content and functionality here
//   const modalContent = `
//     <div class="modal-dialog">
//       <div class="modal-content">
//         <div class="modal-header">
//           <h5 class="modal-title">Custom Fields</h5>
//           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//         </div>
//         <div class="modal-body">
//           <div class="mb-3">
//             <label for="customFieldName" class="form-label">Field Name</label>
//             <input type="text" class="form-control" id="customFieldName" placeholder="Enter field name">
//           </div>
//           <div class="mb-3">
//             <label for="customFieldType" class="form-label">Field Type</label>
//             <select class="form-select" id="customFieldType">
//               <option value="text">Text</option>
//               <option value="number">Number</option>
//               <option value="date">Date</option>
//               <option value="checkbox">Checkbox</option>
//             </select>
//           </div>
//         </div>
//         <div class="modal-footer">
//           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//           <button type="button" class="btn btn-primary" id="saveCustomField">Save</button>
//         </div>
//       </div>
//     </div>
//   `;

//   customFieldModal.innerHTML = modalContent;

//   // Add event listener for save button
//   document.getElementById('saveCustomField')?.addEventListener('click', function() {
//     const fieldName = document.getElementById('customFieldName').value;
//     const fieldType = document.getElementById('customFieldType').value;
    
//     // Add your save logic here
//     console.log('Saving custom field:', { fieldName, fieldType, ticketId });
    
//     // Close the modal after saving
//     modal.hide();
//   });
// }
