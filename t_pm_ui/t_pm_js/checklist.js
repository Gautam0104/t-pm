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

const createChecklist = async (ticketId, ticketTitle) => {
  const checkList = document.getElementById("checklist-name").value;

  const checklistContainer = document.getElementById(
    `checklist-container-${ticketId}`
  );

  console.log(checkList, ticketId, ticketTitle);

  const checklistContent = `                    <div class="d-flex mt-2" id="checklist-box"  draggable="false" style="cursor:pointer" onclick=" checklistModal(event)" data-bs-toggle="modal" data-bs-target="#checklistModal" >
                      <i class="ti ti-checkbox me-1"></i>
                        <span>0/1</span>
                    </div>`;

  try {
    const response = await fetch(`${API_BASE_URL}/create-checklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ticketId,
        checkList,
        ticketTitle
      })
    });
    if (response.ok) {
      console.log("ticket created successfully");
    }
  } catch (error) {
    console.log("error", error);
  }
};

const getChecklist = async ticket_id => {
  await fetch(`${API_BASE_URL}/get-checklist/${ticket_id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok ");
      }
      return response.json();
    })
    .then(data => {
      const headerTitle = document.getElementById("modal-header-title");
      const checklisTitle = document.getElementById("checklist-title");
      const checklistContainer = document.getElementById(
        `checklist-container-${ticket_id}`
      );
      const itemLength = data.length;
      data.map(item => {
        const checklistContent = `                    <div class="d-flex mt-2" id="checklist-box"  draggable="false" style="cursor:pointer" onclick=" checklistModal(event)" data-bs-toggle="modal" data-bs-target="#checklistModal" >
                      <i class="ti ti-checkbox me-1"></i>
                        <span>0/${itemLength}</span>
                    </div>`;
        checklistContainer.innerHTML += checklistContent;
        checklisTitle.innerHTML = `<span>${item.checklist}</span>`;
        headerTitle.innerHTML = `<h5 class="modal-title" id="exampleModalLabel1">${item.ticket_title}</h5>`;
      });
    });
};

setTimeout(function() {
  fetch(`${API_BASE_URL}/tickets`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok ");
      }
      return response.json();
    })
    .then(data => {
      data.map(item => {
        getChecklist(item.ticket_id);
      });
    });
}, 1000);

function checklistModal(event) {
  event.stopPropagation(); // Prevent the event from bubbling up to the parent
}
