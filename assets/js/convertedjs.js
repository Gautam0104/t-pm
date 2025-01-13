'use strict';
const API_BASE_URL = ENV.API_BASE_URL;
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id");

const pageName = document.getElementById("page-title-text");
fetch(`${API_BASE_URL}/project/${projectId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        let statusText = "";

        pageName.innerText = data.project_name;
        console.log(data);
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });

(async function () {
    let boards;
    const kanbanSidebar = document.querySelector('.kanban-update-item-sidebar'),
        kanbanWrapper = document.querySelector('.kanban-wrapper'),
        commentEditor = document.querySelector('.comment-editor'),
        kanbanAddNewBoard = document.querySelector('.kanban-add-new-board'),
        kanbanAddNewInput = Array.from(document.querySelectorAll('.kanban-add-board-input')),
        kanbanAddBoardBtn = document.querySelector('.kanban-add-board-btn'),
        datePicker = document.querySelector('#due-date'),
        select2 = Array.from(document.querySelectorAll('.select2')), // Using vanilla JS
        assetsPath = document.querySelector('html').getAttribute('data-assets-path');

    // Init kanban Offcanvas
    const kanbanOffcanvas = new bootstrap.Offcanvas(kanbanSidebar);

    // Get kanban data
    const kanbanResponse = await fetch(assetsPath + 'json/kanban.json');
    if (!kanbanResponse.ok) {
        console.error('error', kanbanResponse);
    }
    boards = await kanbanResponse.json();

    // datepicker init
    if (datePicker) {
        datePicker.flatpickr({
            monthSelectorType: 'static',
            altInput: true,
            altFormat: 'j F, Y',
            dateFormat: 'Y-m-d'
        });
    }

    // Initialize select2 replacement without jQuery
    select2.forEach(select => {
        function renderLabels(option) {
            if (!option.id) {
                return option.text;
            }
            return `<div class='badge ${option.dataset.color}'>${option.text}</div>`;
        }

        const selectWrapper = document.createElement('div');
        selectWrapper.classList.add('position-relative');
        select.parentNode.insertBefore(selectWrapper, select);
        selectWrapper.appendChild(select);

        const selectInstance = new Select2(select, {
            placeholder: 'Select Label',
            dropdownParent: selectWrapper,
            templateResult: renderLabels,
            templateSelection: renderLabels,
            escapeMarkup: function (es) {
                return es;
            }
        });
    });

    // Comment editor
    if (commentEditor) {
        new Quill(commentEditor, {
            modules: {
                toolbar: '.comment-toolbar'
            },
            placeholder: 'Write a Comment... ',
            theme: 'snow'
        });
    }

    // Render board dropdown
    function renderBoardDropdown() {
        return (
            "<div class='dropdown'>" +
            "<i class='dropdown-toggle ti ti-dots-vertical cursor-pointer' id='board-dropdown' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></i>" +
            "<div class='dropdown-menu dropdown-menu-end' aria-labelledby='board-dropdown'>" +
            "<a class='dropdown-item delete-board' href='javascript:void(0)'> <i class='ti ti-trash ti-xs' me-1></i> <span class='align-middle'>Delete</span></a>" +
            "<a class='dropdown-item' href='javascript:void(0)'><i class='ti ti-edit ti-xs' me-1></i> <span class='align-middle'>Rename</span></a>" +
            "<a class='dropdown-item' href='javascript:void(0)'><i class='ti ti-archive ti-xs' me-1></i> <span class='align-middle'>Archive</span></a>" +
            '</div>' +
            '</div>'
        );
    }

    // Other functions (renderDropdown, renderHeader, etc.) are the same as before.

    // Init kanban
    const kanban = new jKanban({
        element: '.kanban-wrapper',
        gutter: '12px',
        widthBoard: '250px',
        dragItems: true,
        boards: boards,
        dragBoards: true,
        addItemButton: true,
        buttonContent: '+ Add Item',
        itemAddOptions: {
            enabled: true,
            content: '+ Add New Item',
            class: 'kanban-title-button btn',
            footer: false
        },
        click: function (el) {
            let element = el;
            let title = element.getAttribute('data-eid')
                ? element.querySelector('.kanban-text').textContent
                : element.textContent,
                date = element.getAttribute('data-due-date'),
                dateObj = new Date(),
                year = dateObj.getFullYear(),
                dateToUse = date
                    ? date + ', ' + year
                    : dateObj.getDate() + ' ' + dateObj.toLocaleString('en', { month: 'long' }) + ', ' + year,
                label = element.getAttribute('data-badge-text'),
                avatars = element.getAttribute('data-assigned');

            // Show kanban offcanvas
            kanbanOffcanvas.show();

            // To get data on sidebar
            kanbanSidebar.querySelector('#title').value = title;
            kanbanSidebar.querySelector('#due-date').nextSibling.value = dateToUse;

            const selectElement = kanbanSidebar.querySelector('.kanban-update-item-sidebar').querySelector('.select2');
            const select2Instance = new Select2(selectElement);
            select2Instance.val(label);

            // Remove & Update assigned
            kanbanSidebar.querySelector('.assigned').innerHTML = '';
            kanbanSidebar
                .querySelector('.assigned')
                .insertAdjacentHTML(
                    'afterbegin',
                    renderAvatar(avatars, false, 'xs', '1', el.getAttribute('data-members')) +
                    "<div class='avatar avatar-xs ms-1'>" +
                    "<span class='avatar-initial rounded-circle bg-label-secondary'><i class='ti ti-plus ti-xs text-heading'></i></span>" +
                    '</div>'
                );
        },
        buttonClick: function (el, boardId) {
            const addNew = document.createElement('form');
            addNew.setAttribute('class', 'new-item-form');
            addNew.innerHTML =
                '<div class="mb-4">' +
                '<textarea class="form-control add-new-item" rows="2" placeholder="Add Content" autofocus required></textarea>' +
                '</div>' +
                '<div class="mb-4">' +
                '<button type="submit" class="btn btn-primary btn-sm me-4 waves-effect waves-light">Add</button>' +
                '<button type="button" class="btn btn-label-secondary btn-sm cancel-add-item waves-effect waves-light">Cancel</button>' +
                '</div>';
            kanban.addForm(boardId, addNew);

            addNew.addEventListener('submit', function (e) {
                e.preventDefault();
                const currentBoard = Array.from(
                    document.querySelectorAll('.kanban-board[data-id=' + boardId + '] .kanban-item')
                );
                kanban.addElement(boardId, {
                    title: "<span class='kanban-text'>" + e.target[0].value + '</span>',
                    id: boardId + '-' + currentBoard.length + 1
                });

                // add dropdown in new boards
                const kanbanText = Array.from(
                    document.querySelectorAll('.kanban-board[data-id=' + boardId + '] .kanban-text')
                );
                kanbanText.forEach(function (e) {
                    e.insertAdjacentHTML('beforebegin', renderDropdown());
                });

                // prevent sidebar to open onclick dropdown buttons of new tasks
                const newTaskDropdown = Array.from(document.querySelectorAll('.kanban-item .kanban-tasks-item-dropdown'));
                if (newTaskDropdown) {
                    newTaskDropdown.forEach(function (e) {
                        e.addEventListener('click', function (el) {
                            el.stopPropagation();
                        });
                    });
                }

                // delete tasks for new boards
                const deleteTask = Array.from(
                    document.querySelectorAll('.kanban-board[data-id=' + boardId + '] .delete-task')
                );
                deleteTask.forEach(function (e) {
                    e.addEventListener('click', function () {
                        const id = this.closest('.kanban-item').getAttribute('data-eid');
                        kanban.removeElement(id);
                    });
                });
                addNew.remove();
            });

            // Remove form on clicking cancel button
            addNew.querySelector('.cancel-add-item').addEventListener('click', function (e) {
                addNew.remove();
            });
        }
    });

    // Kanban Wrapper scrollbar
    if (kanbanWrapper) {
        new PerfectScrollbar(kanbanWrapper);
    }

    const kanbanContainer = document.querySelector('.kanban-container'),
        kanbanTitleBoard = Array.from(document.querySelectorAll('.kanban-title-board')),
        kanbanItem = Array.from(document.querySelectorAll('.kanban-item'));

    // Render custom items
    if (kanbanItem) {
        kanbanItem.forEach(function (el) {
            const element = "<span class='kanban-text'>" + el.textContent + '</span>';
            let img = '';
            if (el.getAttribute('data-image') !== null) {
                img =
                    "<img class='img-fluid rounded mb-2' src='" +
                    assetsPath +
                    'img/elements/' +
                    el.getAttribute('data-image') +
                    "'>";
            }
            el.textContent = '';
            if (el.getAttribute('data-badge') !== undefined && el.getAttribute('data-badge-text') !== undefined) {
                el.insertAdjacentHTML(
                    'afterbegin',
                    renderHeader(el.getAttribute('data-badge'), el.getAttribute('data-badge-text')) + img + element
                );
            }
            if (
                el.getAttribute('data-comments') !== undefined ||
                el.getAttribute('data-due-date') !== undefined ||
                el.getAttribute('data-assigned') !== undefined
            ) {
                el.insertAdjacentHTML(
                    'beforeend',
                    renderFooter(
                        el.getAttribute('data-attachments'),
                        el.getAttribute('data-comments'),
                        el.getAttribute('data-assigned'),
                        el.getAttribute('data-members')
                    )
                );
            }
        });
    }

    // To initialize tooltips for rendered items
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // prevent sidebar to open onclick dropdown buttons of tasks
    const tasksItemDropdown = Array.from(document.querySelectorAll('.kanban-tasks-item-dropdown'));
    if (tasksItemDropdown) {
        tasksItemDropdown.forEach(function (e) {
            e.addEventListener('click', function (el) {
                el.stopPropagation();
            });
        });
    }

    // Toggle add new input and actions add-new-btn
    if (kanbanAddBoardBtn) {
        kanbanAddBoardBtn.addEventListener('click', () => {
            kanbanAddNewInput.forEach(el => {
                el.value = '';
                el.classList.toggle('d-none');
            });
        });
    }

    // Render add new inline with boards
    if (kanbanContainer) {
        kanbanContainer.appendChild(kanbanAddNewBoard);
    }

    // Makes kanban title editable for rendered boards
    if (kanbanTitleBoard) {
        kanbanTitleBoard.forEach(function (elem) {
            elem.addEventListener('mouseenter', function () {
                this.contentEditable = 'true';
            });

            // Appends delete icon with title
            elem.insertAdjacentHTML('afterend', renderBoardDropdown());
        });
    }

    // To delete Board for rendered boards
    const deleteBoards = Array.from(document.querySelectorAll('.delete-board'));
    if (deleteBoards) {
        deleteBoards.forEach(function (elem) {
            elem.addEventListener('click', function () {
                const id = this.closest('.kanban-board').getAttribute('data-id');
                kanban.removeBoard(id);
            });
        });
    }

    // Delete task for rendered boards
    const deleteTask = Array.from(document.querySelectorAll('.delete-task'));
    if (deleteTask) {
        deleteTask.forEach(function (e) {
            e.addEventListener('click', function () {
                const id = this.closest('.kanban-item').getAttribute('data-eid');
                kanban.removeElement(id);
            });
        });
    }
})