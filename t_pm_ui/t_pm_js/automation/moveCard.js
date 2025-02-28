function retrieveAutomation(ticketId) {
  fetch(`${API_BASE_URL}/automation-data`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const automationButtonArea = document.getElementById(
        `automation-button-ul-${ticketId}`
      );
      if (data.length > 0) {
        automationButtonArea.style.display = "block";
      }
      data.map(item => {
        const automationButtonAreaContent = `<li class="nav-item dropdown">
                                                             <button class="nav-link  d-flex align-items-center border-0  w-100" id="add-button-dropdown" >
                                                                    <i class="fas fa-arrow-right me-2"></i> ${item.button_title}
                                                                </button>
                                                             </li>`;

        automationButtonArea.innerHTML += automationButtonAreaContent;
      });
    });
}

// function openMoveCardModal(title, ticketId) {
//     const movecardForm = document.getElementById("move-card-form");
//     movecardForm.innerHTML = `                  <div class="col-10">
//                       <div class="mb-4">
//                         <strong><label class="form-check-label" for="">Board</label></strong>
//                         <select class="form-control form-select" name="" id="">
//                           <option value="todo">Main Bord</option>
//                           <option value="inprogress">Main Bord</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div class="row">
//                       <div class="col-7">
//                         <div class="mb-4">
//                           <strong><label class="form-check-label" for="">List</label></strong>
//                           <select class="form-control form-select" name="" id="move-card-in">
//                             <option value="todo">Todo</option>
//                             <option value="inprogress">Inprogress</option>
//                             <option value="rejected">Rejected</option>
//                             <option value="for-approval">For-approval</option>
//                             <option value="approved">Approved</option>
//                           </select>
//                         </div>
//                       </div>
//                       <div class="col-3">
//                         <div class="mb-4">
//                           <strong><label class="form-check-label" for="">Position</label></strong>
//                           <select class="form-control form-select" name="" id="">
//                             <option value="1">1</option>
//                             <option value="2">2</option>
//                             <option value="3">3</option>
//                             <option value="4">4</option>
//                             <option value="5">5</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>

//                     <div class="col-5 text-center">
//                       <button type="button" class="btn btn-primary me-3 btnCSwitch" id="move-card">Move</button>
//                       <button type="reset" class="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">
//                         Cancel
//                       </button>
//                     </div>`;

//     document.getElementById("move-card").addEventListener("click", function(e) {
//       e.preventDefault();
//       const ticketStatus = document.getElementById("move-card-in").value;
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
//       });
//     });
//   }
