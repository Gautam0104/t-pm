import { sendAutomationData } from "./createAutomationButton.js";
import { fetchLists } from "./boardList.js";
import { ELEMENT_IDS } from "../element_id.js";

export function shareCardToModal(ticketTitle, ticketId, ticketStatus) {
  console.log("Ticket status: " + ticketStatus + ", Title: " + ticketTitle);

  let modalContainer = document.getElementById(
    ELEMENT_IDS.AUTOMATION_SHARE_CARD_TO_MODAL
  );

  if (!modalContainer) {
    console.error("Modal container 'shareCardToModal' not found.");
    return;
  }

  // Inject modal content dynamically
  modalContainer.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="text-center">Share and more..</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex align-items-center mb-2">
            
          </div>
          <div class="d-flex align-items-center m-2">
           <button type="button" class="btn btn-light" id="printCardBtn">Print </button>
          </div>
          <div class="d-flex align-items-center m-2">
            <button type="button" class="btn btn-light" id="exportCardBtn">Export JSON</button>
          </div>
          <div class="mb-3">
            <div class="border p-3">
              <strong>Share to this card</strong>
              <div>
                <input type="text" class="form-control" id="linkInput" placeholder="">
               <button type="button" class="btn btn-light m-2" id="printQrBtn">Show QR code </button>
               <div id="qrCodeContainer"></div>
               <div>Embed this card</div> 
                <input type="text" class="form-control" id="codeEmbedd" placeholder="">
                Email for this card
                <input type="text" class="form-control" id="emailCard" placeholder="">
                Emails sent to this address will be appear as a comment by you on the card
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-light w-100" id="addActionButton">+ Add action</button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary w-100" id="saveButton" disabled>Add Button</button>
        </div>
        <p class="message" id="message"></p>
      </div>
    </div>
  `;

  // Initialize Bootstrap Modal properly
  let modal = new bootstrap.Modal(modalContainer);
  modal.show();

  // function to print card
  document.getElementById("printCardBtn").addEventListener("click", function () {
    window.print();
  });
   // function to export json
  document.getElementById("exportCardBtn").addEventListener("click", function () {
   
    const jsonData = {
        title: ticketTitle,
        id: ticketId,
        status: ticketStatus,
    };
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  });

  // function to show url
  document.getElementById("linkInput").value = window.location.href;

  // function to show qr code
  document.getElementById("printQrBtn").addEventListener("click", function () {
    const url = window.location.href;
    
    // Clear previous QR code (if any)
    document.getElementById("qrCodeContainer").innerHTML = "";

    // Generate new QR code
    new QRCode(document.getElementById("qrCodeContainer"), {
      text: url,
      width: 150,
      height: 150
    });
  });

  // function to embed code card 
  document.getElementById("codeEmbedd").value = `<iframe src="${window.location.href}" width="600" height="400" style="border:none;"></iframe>`;


 
}
