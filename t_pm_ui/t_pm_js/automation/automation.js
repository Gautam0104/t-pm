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
          <button class="nav-link  d-flex align-items-center border-0  w-100" id="add-button-dropdown" onclick="${item.button_action}">
                 <i class="fas fa-arrow-right me-2"></i> ${item.button_title}
             </button>
          </li>`;
        if (item.ticket_id === ticketId) {
          automationButtonArea.innerHTML += automationButtonAreaContent;
        }
      });
    });
}
