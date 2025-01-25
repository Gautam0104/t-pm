

const addBoardInput = document.getElementById("kanban-add-board-input");
const addBoardDiv = document.getElementById("kanban-add-board-div");
const formShow = document.getElementById("form-show");
const formHide = document.getElementById("form-hide");

formShow.addEventListener("click", function () {
    addBoardDiv.classList.remove("d-none");
    addBoardInput.classList.remove("d-none");

})
formHide.addEventListener("click", function () {
    addBoardDiv.classList.add("d-none");
    addBoardInput.classList.add("d-none");

})

const createnewAreForm = document.getElementById("create-new-board");

createnewAreForm.addEventListener('click', function (e) {
    e.preventDefault();

    const formInput = document.getElementById("kanban-add-board-input").value;
    console.log(formInput);

    const kanbanContainer = document.getElementById("kanban-wrapper-container");
    console.log(kanbanContainer);

    const newBoard = document.createElement('div');
    newBoard.setAttribute('data-id', 'board-in-review');
    newBoard.setAttribute('data-order', '5');
    newBoard.classList.add('kanban-board');
    newBoard.style.width = '250px';
    newBoard.style.marginLeft = '12px';
    newBoard.style.marginRight = '12px';

    newBoard.innerHTML = `
        <header class="kanban-board-header">
            <div class="kanban-title-board">${formInput}</div>
            <div class="dropdown">
                <i class="dropdown-toggle ti ti-dots-vertical cursor-pointer"
                   id="board-dropdown" data-bs-toggle="dropdown"
                   aria-haspopup="true" aria-expanded="false"></i>
                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="board-dropdown">
                    <a class="dropdown-item delete-board waves-effect" href="javascript:void(0)">
                        <i class="ti ti-trash ti-xs" me-1=""></i> <span class="align-middle">Delete</span>
                    </a>
                    <a class="dropdown-item waves-effect" href="javascript:void(0)">
                        <i class="ti ti-edit ti-xs" me-1=""></i> <span class="align-middle">Rename</span>
                    </a>
                    <a class="dropdown-item waves-effect" href="javascript:void(0)">
                        <i class="ti ti-archive ti-xs" me-1=""></i> <span class="align-middle">Archive</span>
                    </a>
                </div>
            </div>
            <button class="kanban-title-button btn" id="add-new-approved">+ Add New Item</button>
            <form class="new-item-form" id="add-new-todo"></form>
        </header>
        <main class="kanban-drag">
            <div id="approved-task" draggable="true">
                <div id="content-inprogress">Drop here in inprogress</div>
            </div>
            <form class="new-item-form" id="add-new-approved-form"></form>
            <div id="backdrop"></div>
        </main>
    `;

    // Get the position to insert before the last child
    const children = kanbanContainer.children;
    const position = children.length - 1;

    if (children.length > 0 && position >= 0) {
        kanbanContainer.insertBefore(newBoard, children[position]);
        addBoardDiv.classList.add("d-none");
        addBoardInput.classList.add("d-none");

    } else {
        kanbanContainer.appendChild(newBoard); // If no children, append to the end
        addBoardDiv.classList.add("d-none");
        addBoardInput.classList.add("d-none");
    }
});
