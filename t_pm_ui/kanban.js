const kanbanItems = document.querySelectorAll('.kanban-item');
const offcanvas = document.querySelector('.offcanvas');
const contentWrapper = document.querySelector('.content-wrapper');
const offcanvasClosebtn = document.getElementById('offcanvase-close');
const backdrop = `<div class="offcanvas-backdrop fade show"></div>`;
// open canbavase 
for (const kanbanItem of kanbanItems) {
    kanbanItem.addEventListener('click', function () {
        console.log('kanban-item working');
        offcanvas.classList.add('show');
        contentWrapper.appendChild(backdrop);
    });
}

// close canvase
offcanvasClosebtn.addEventListener('click', function () {
    offcanvas.classList.remove('show');
})
//Add new todo item||ticket||task
const addItems = document.querySelectorAll('.kanban-title-button');
const addItmeForm = document.getElementById('add-new-todo');

for (const addItem of addItems) {
    addItem.addEventListener('click', function () {

        const formContent = `<div class="mb-4"><textarea class="form-control add-new-item" rows="2" id="ticket-title"
                                                        placeholder="Add Content"  required=""></textarea>
                                                </div>
                                                <div class="mb-4"><button type="submit"
                                                        class="btn btn-primary btn-sm me-4">Add</button><button
                                                        type="button"
                                                        class="btn btn-label-secondary btn-sm cancel-add-item waves-effect waves-light" >Cancel</button>
                                                </div>`;
        addItmeForm.innerHTML += formContent;
    });
}

// const cancelAddItem = document.getElementsByClassName('cancel-add-item');

// const formhide = () => {
//     console.log('heelo');

//     addItmeForm.style.display = "none";
// }