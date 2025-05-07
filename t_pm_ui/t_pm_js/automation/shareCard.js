import { ELEMENT_IDS } from "../element_id.js";
import { API_ROUTES } from "../../apiRoutesHeader.js";
const API_BASE_URL = ENV.API_BASE_URL;
export function shareCardToModal(ticketTitle, ticketId, ticketStatus) {
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
               <div id="qrContainer" style="width: 150px; height: 150px;"></div>

               <div>Embed this card</div> 
                <input type="text" class="form-control" id="codeEmbedd" placeholder="">
                Email for this card
                <input type="text" class="form-control" id="emailCard" placeholder="">
                Emails sent to this address will be appear as a comment by you on the card
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
        </div>
        <p class="message" id="message"></p>
      </div>
    </div>
  `;

  // Initialize Bootstrap Modal properly
  let modal = new bootstrap.Modal(modalContainer);
  modal.show();

  // function to print card
  document.getElementById(ELEMENT_IDS.PRINT_CARD_BTN).addEventListener("click", async function () {
    try {
      // Fetch the specific card data
      const response = await fetch(`${API_BASE_URL}${API_ROUTES.TICKET_HISTORY}/${ticketId}`);
      const historyData = await response.json();
      
      if (!historyData || historyData.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No History Data',
          text: 'No history data is available for this ticket.',
          confirmButtonText: 'OK'
        });
      
        return;
      }

      // Fetch the ticket data
      const ticketResponse = await fetch(`${API_BASE_URL}${API_ROUTES.GET_TICKET_BY_ID}/${ticketId}`);
      const ticketData = await ticketResponse.json();
      
      if (!ticketData || ticketData.length === 0) {
        console.error('No ticket data found');
        return;
      }

      const ticket = ticketData[0]; // Get the first ticket from response
      
      // Fetch user data to get username
      const userResponse = await fetch(`${API_BASE_URL}${API_ROUTES.GET_USERS}`);
      const userData = await userResponse.json();
      
      // Find the user who created the ticket
      const creator = userData.find(user => user.user_id === ticket.created_by);
      const creatorName = creator ? creator.username : '';
      
      const editLogs = ticket.edit_logs || [];

      const printWindow = window.open('', '_blank');
      
      const printContent = `
        <html>
          <head>
            <title>Ticket Activity History</title>
            <style>
              body { 
                font-family: system-ui, -apple-system, sans-serif;
                max-width: 800px;
                margin: 20px auto;
                color: #333;
                line-height: 1.5;
                padding: 0 20px;
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                margin-bottom: 20px;
                border-bottom: 1px solid #eee;
              }
              .history-item {
                border: 1px solid #eee;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
              }
              .title {
                background-color: #f3f0ff;
                padding: 10px;
                margin: 10px 0;
                border-radius: 4px;
                text-align: center;
              }
              .content {
                margin: 15px 0;
                text-align: center;
              }
              .divider {
                text-align: center;
                margin: 10px 0;
                border-bottom: 1px solid #eee;
              }
              img {
                max-width: 50%;
                height: auto;
                margin: 5px;
              }
              .label {
                background-color: #f0f0f0;
                display: inline-block;
                padding: 5px 10px;
                border-radius: 4px;
                margin: 10px 0;
                font-size: 14px;
              }
              .edit-log {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .edit-entry {
                border-left: 3px solid #696cff;
                padding: 10px;
                margin: 10px 0;
              }
              .editor-info {
                color: #696cff;
                font-weight: 500;
              }
              .change-list {
                margin: 5px 0;
                padding-left: 20px;
              }
              @media print {
                body { margin: 0; }
                .history-item { break-inside: avoid; }
                .title { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .label { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Ticket Activity History</h1>
              <div class="content">
                <strong>Current Title:</strong> ${ticket.title || ''}
              </div>
            </div>

            <div class="edit-log">
              <h3>Edit History</h3>
              ${editLogs.map(log => `
                <div class="edit-entry">
                  <div class="editor-info">
                    <span class="avatar-initial bg-label-success rounded-circle">${log.editor.substring(0, 2).toUpperCase()}</span>
                    ${log.editor} made changes on ${new Date(log.timestamp).toLocaleString()}
                  </div>
                  <ul class="change-list">
                    ${log.changes.map(change => `<li>${change}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>

            ${historyData.map((record, index) => `
              <div class="history-item">
                <div class="title">
                  ${record.previous_title || ''}
                </div>
                <div class="content">
                  ${record.previous_description || ''}
                </div>
                ${record.previous_card_image ? `
                  <div class="content">
                    <div class="label"># Task Image</div>
                    <img src="${API_BASE_URL}/uploads/${record.previous_card_image}" alt="Task Image">
                  </div>
                ` : ''}
                ${record.previous_images ? `
                  <div class="content">
                    <div class="label">Attachments</div>
                    ${record.previous_images.split(',').map((img, i) => `
                      <img src="${API_BASE_URL}/uploads/${img.replace(/["\[\]]/g, '').trim()}" alt="Attachment ${i + 1}">
                    `).join('')}
                  </div>
                ` : ''}
                <div class="divider"></div>
                <div class="content">
                  ETC : ${record.previous_ticket_eta || ''}
                </div>
                <div class="divider"></div>
                <div class="content">
                  Created At : ${new Date(ticket.ticket_created_at).toLocaleString()}
                </div>
                <div class="divider"></div>
                <div class="content">
                  Updated At : ${new Date(record.updated_at).toLocaleString()}
                </div>
                <div class="divider"></div>
                <div class="content">
                  Created By : ${creatorName}
                </div>
                <div class="divider"></div>
                <div class="content">
                  Task Owner : ${record.previous_ticket_owner || ''}
                </div>
              </div>
            `).join('')}
          </body>
        </html>
      `;
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      printWindow.onload = function() {
        printWindow.print();
      };
    } catch (error) {
      console.error('Error printing card history:', error);
    }
  });
   // function to export json
  // Export JSON function
  document.getElementById(ELEMENT_IDS.EXPORT_CARD_BTN)?.addEventListener("click", async () => {
    try {
      const [historyResponse, ticketResponse, userResponse] = await Promise.all([
        fetch(`${API_BASE_URL}${API_ROUTES.TICKET_HISTORY}/${ticketId}`),
        fetch(`${API_BASE_URL}${API_ROUTES.GET_TICKET_BY_ID}/${ticketId}`),
        fetch(`${API_BASE_URL}${API_ROUTES.GET_USERS}`)
      ]);

      const historyData = await historyResponse.json();
      const ticketData = await ticketResponse.json();
      const userData = await userResponse.json();

      const ticket = ticketData[0];
      const creator = userData.find(user => user.user_id === ticket.created_by);
      const editLogs = ticket.edit_logs || [];

      const jsonData = {
        currentTicket: {
          title: ticket.title,
          id: ticketId,
          status: ticketStatus,
          description: ticket.description,
          created_at: ticket.ticket_created_at,
          updated_at: ticket.updated_at,
          created_by: creator ? creator.username : '',
          ticket_owner: ticket.ticket_owner,
          ticket_eta: ticket.ticket_eta,
          card_image: ticket.card_image,
          images: ticket.images
        },
        history: historyData.map(record => ({
          previous_title: record.previous_title,
          previous_description: record.previous_description,
          previous_card_image: record.previous_card_image,
          previous_images: record.previous_images,
          previous_ticket_eta: record.previous_ticket_eta,
          previous_ticket_owner: record.previous_ticket_owner,
          updated_at: record.updated_at
        })),
        editLogs: editLogs.map(log => ({
          editor: log.editor,
          timestamp: log.timestamp,
          changes: log.changes
        }))
      };

      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `ticket_${ticketId}_data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting ticket data:", error);
    }
  });

  // Set link input
  const linkInput = document.getElementById(ELEMENT_IDS.LINK_INPUT);
  if (linkInput) linkInput.value = window.location.href;

  // Show QR code
  document.getElementById(ELEMENT_IDS.PRINT_QR_BTN)?.addEventListener("click", () => {
    const url = window.location.href; // Get the current URL
    console.log("URL for QR Code:", url);
  
    const qrContainer = document.getElementById(ELEMENT_IDS.QR_CONTAINER);
    if (!qrContainer) {
      console.error("QR Code container not found");
      return;
    }
  
    // Clear previous QR code
    qrContainer.innerHTML = "";
  
    // Generate new QR code
    try {
      new QRCode(qrContainer, {
        text: url, // URL to encode in the QR code
        width: 150, // Width of the QR code
        height: 150 // Height of the QR code
      });
     
      console.log("QRCode is:", typeof QRCode, QRCode);

    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  });

  // Embed iframe code
  const embedInput = document.getElementById(ELEMENT_IDS.CODE_EMBEDD);
  if (embedInput) embedInput.value = `<iframe src="${window.location.href}" width="600" height="400" style="border:none;"></iframe>`;
}
