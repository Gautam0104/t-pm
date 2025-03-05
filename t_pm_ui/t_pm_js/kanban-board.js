// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely
fetch(`${API_BASE_URL}/getboards`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok ");
    }
    return response.json();
  })
  .then(data => {
    const kanbanboardContainer = document.getElementById(
      "kanban-wrapper-container"
    );
    data.map(item => {
      const kanbanboardContent = `<div data-id="board-in-progress" data-order="${item.order}" class="kanban-board" id="board-${item.order}"
        style="width: 250px; margin-left: 12px; margin-right: 12px;">
        <header class="kanban-board-header" id="${item.board_title}-header">
            <div class="kanban-title-board" style="text-transform: capitalize;">${item.board_title}</div>


            <div class="dropdown" style="height:auto;">

            <span id="watched-${item.board_title}-card"></span>

            <i class="ti ti-arrows-horizontal"
                onclick="toggleTodo('${item.board_title}-task','${item.board_title}-header', 'new-${item.board_title}-item')"></i>

            <i class="dropdown-toggle ti ti-dots-vertical cursor-pointer" id="board-dropdown"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>

            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="board-dropdown">
                <!-- Delete -->
                <a class="dropdown-item delete-board waves-effect" href="javascript:void(0)" onclick="deleteBoard('${item.board_id}')">
                <i class="ti ti-trash ti-xs me-1"></i> <span class="align-middle">Delete</span>
                </a>

                <!-- Rename -->
                <a class="dropdown-item waves-effect" href="javascript:void(0)">
                <i class="ti ti-edit ti-xs me-1"></i> <span class="align-middle">Rename</span>
                </a>

                <!-- Archive -->
                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                onclick="archiveBoard(this)">
                <i class="ti ti-archive ti-xs me-1"></i> <span class="align-middle">Archive</span>
                </a>
                <!-- New button to archive all cards -->
                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                onclick="archiveAllCards(this)">
                <i class="ti ti-archive ti-xs me-1"></i> <span class="align-middle">Archive All
                    Cards</span>
                </a>
                <!-- Move Board -->
                <a class="dropdown-item waves-effect move-board-trigger" href="javascript:void(0)"
                onclick="moveBoard(this)">
                <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Move Board</span>
                </a>

                <!-- Copy Board -->
                <a class="dropdown-item waves-effect"  data-bs-toggle="modal" data-bs-target="#copyboardModal" onclick="CopyBardlist('${item.board_title}')">
                <i class="ti ti-copy"></i> <span class="align-middle">Copy Board</span>
                </a>

                <!-- Move all card in this list -->
                <div class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                    <i class="ti ti-arrows-horizontal"></i> <span class="align-middle">Move all card in this
                    list</span>
                </a>
                <div class="dropdown-menu">
                <form >

                  <div class="mb-4">
                    <label class="form-check-label" for="">Move all From </label>
                     <input type="text" class="form-control" id="move-from" placeholder="Move from ${item.board_title}" value="${item.board_title}">
                  </div>
                  <div class="mb-4">
                    <label class="form-check-label" for="">Move all To</label>
                     <input type="text" class="form-control" id="move-to" placeholder="Please enter board where you want to move all card">
                  </div>

                  <div class="mb-4 w-100"><button type="button" class="btn btn-primary btn-sm me-4" onclick="moveAllTask('${item.board_title}-task','${item.board_title}')">Move...</button>
                  </div>

                </form>
                </div>
                </div>
                <!-- Sort By (Nested Dropdown) -->
                <div class="dropdown-submenu">
                <a class="dropdown-item dropdown-toggle" href="javascript:void(0)">
                    <i class="ti ti-arrows-sort ti-xs me-1"></i> <span class="align-middle">Sort
                    by...</span>
                </a>
                <div class="dropdown-menu">
                    <a class="dropdown-item waves-effect" href="javascript:void(0)"
                    onclick="toggleTicketSortByName('${item.board_title}-task')">
                    <i class="ti ti-calendar ti-xs me-1"></i> <span class="align-middle">Sort by
                        Name</span>
                    </a>
                    <a class="dropdown-item waves-effect" href="javascript:void(0)"
                    onclick="toggleTicketSortByDate('${item.board_title}-task')">
                    <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by
                        created date (newest first)</span>
                    </a>
                    <a class="dropdown-item waves-effect" href="javascript:void(0)"
                    onclick="toggleTicketSortByDate('${item.board_title}-task')">
                    <i class="ti ti-clock ti-xs me-1"></i> <span class="align-middle">Sort by created
                        date (oldest first)</span>
                    </a>
                </div>
                </div>
                <!-- Watch -->
                <a class="dropdown-item waves-effect" href="javascript:void(0)"
                onclick="watchedCard('watched-${item.board_title}-card')" id="watched-${item.board_title}-card-anchor">
                <i class="ti ti-eye ti-xs me-1"></i> <span class="align-middle">Watch</span>
                </a>
                <!-- Color Picker -->
                <div class="dropdown-item">
                <i class="ti ti-palette ti-xs"></i>
                <span class="align-middle">Card Bg</span>
                <div class="d-flex flex-wrap mt-2" style="width: 140px;">
                    <div class="color-box" style="background: #ff5733;"
                    onclick="changeBgColor('#ff5733','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #33ff57;"
                    onclick="changeBgColor('#33ff57','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #3357ff;"
                    onclick="changeBgColor('#3357ff','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #f4d03f;"
                    onclick="changeBgColor('#f4d03f','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #8e44ad;"
                    onclick="changeBgColor('#8e44ad','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #1abc9c;"
                    onclick="changeBgColor('#1abc9c','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #e74c3c;"
                    onclick="changeBgColor('#e74c3c','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #2c3e50;"
                    onclick="changeBgColor('#2c3e50','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #d35400;"
                    onclick="changeBgColor('#d35400','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #16a085;"
                    onclick="changeBgColor('#16a085','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #ed0cf5;"
                    onclick="changeBgColor('#ed0cf5','${item.board_title}-task')"></div>
                    <div class="color-box" style="background: #f9fafa;" onclick="makeDefault('${item.board_title}-task')">
                    </div>
                </div>
                </div>
            </div>
            </div>

            <button class="kanban-title-button btn" id="add-${item.board_title}-item">+ Add
            New
            Item</button>


        </header>
        <main class="kanban-drag">

            <div id="${item.board_title}-task" style="display: block;">
            <div id="content-inprogress">Droped in ${item.board_title}</div>

            </div>
            <form class="new-item-form" id="add-new-${item.board_title}-form">

            </form>
            <div id="backdrop">

            </div>
        </main>
        <!-- <footer></footer> -->
        </div>`;

      kanbanboardContainer.innerHTML += kanbanboardContent;
    });
  });

const deleteBoard = async boardId => {
  try {
    // Send DELETE request to the API
    const response = await fetch(`${API_BASE_URL}/deleteboard/${boardId}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("board deleted successfully");
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

function toggleTicketSortByName(elementId) {
  let todoTask = document.getElementById(elementId);
  let kanbanItems = Array.from(todoTask.getElementsByClassName("kanban-item"));

  kanbanItems.sort((a, b) => {
    let nameA = a.querySelector(".kanban-text").innerText.trim().toLowerCase();
    let nameB = b.querySelector(".kanban-text").innerText.trim().toLowerCase();

    return isAscending
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  kanbanItems.forEach(item => todoTask.appendChild(item));

  isAscending = !isAscending; // Toggle sorting order for next call
}

let isAscending = true; // Track sorting order

let isDateAscending = true; // Track sorting order for date

function toggleTicketSortByDate(elementId) {
  let todoTask = document.getElementById(elementId);
  let kanbanItems = Array.from(todoTask.getElementsByClassName("kanban-item"));

  kanbanItems.sort((a, b) => {
    let nameA = a.querySelector(".kanban-text").innerText.trim().toLowerCase();
    let nameB = b.querySelector(".kanban-text").innerText.trim().toLowerCase();

    return isAscending
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  kanbanItems.forEach(item => todoTask.appendChild(item));

  isAscending = !isAscending; // Toggle sorting order for next call
}

function watchedCard(watched) {
  let checkedCard = document.getElementById(watched);
  let watchedAnchor = document.getElementById(`${watched}-anchor`);
  let isWatched = localStorage.getItem(`watched-${watched}`);

  if (isWatched) {
    checkedCard.innerHTML = "";
    if (watchedAnchor)
      watchedAnchor.innerHTML = watchedAnchor.innerHTML.replace(
        /<i class=\"ti ti-check ti-xs me-1\"><\/i>/g,
        ""
      );
    localStorage.removeItem(`watched-${watched}`);
  } else {
    checkedCard.innerHTML = `<i class="ti ti-eye ti-xs me-1"></i>`;
    if (watchedAnchor)
      watchedAnchor.innerHTML += `<i class="ti ti-check ti-xs me-1"></i>`;
    localStorage.setItem(`watched-${watched}`, true);
  }
}
