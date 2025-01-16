// Base URL of the API
// const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely
var todoForm = document.getElementById('add-new-todo-form');
var inprogressForm = document.getElementById('add-new-inprogress-form');
var forapprovalForm = document.getElementById('add-new-for-approval-form');
var rejectedForm = document.getElementById('add-new-rejected-form');
var approvedForm = document.getElementById('add-new-approved-form');
var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
var user_id = urlParams.get("user_id");
console.log("project id : " + project_id);
console.log("project leader id : " + user_id);



todoForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    const title = document.getElementById('ticket-title').value;
    const description = '';
    const status = "Backlog";
    const priority = "Medium";
    const created_by = user_id;
    const due_date = "2025-01-13";
    const ticket_status = "todo";


    try {
        const response = await fetch(`${API_BASE_URL}/ticket`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id,
                title,
                description,
                status,
                priority,
                created_by,
                due_date,
                ticket_status
            }),
        });
        if (response.ok) {
            console.log('ticket created successfully')
            window.location.reload();
        }
    }
    catch (error) {
        console.log('error', error);

    }
})
inprogressForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    const title = document.getElementById('ticket-title-inprogress').value;
    const description = '';
    const status = "Backlog";
    const priority = "Medium";
    const created_by = user_id;
    const due_date = "2025-01-13";
    const ticket_status = "inprogress";


    try {
        const response = await fetch(`${API_BASE_URL}/ticket`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id,
                title,
                description,
                status,
                priority,
                created_by,
                due_date,
                ticket_status
            }),
        });
        if (response.ok) {
            console.log('ticket created successfully')
            window.location.reload();
        }
    }
    catch (error) {
        console.log('error', error);

    }
})
forapprovalForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    const title = document.getElementById('ticket-title-for-approval').value;
    const description = '';
    const status = "Backlog";
    const priority = "Medium";
    const created_by = user_id;
    const due_date = "2025-01-13";
    const ticket_status = "for-approval";


    try {
        const response = await fetch(`${API_BASE_URL}/ticket`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id,
                title,
                description,
                status,
                priority,
                created_by,
                due_date,
                ticket_status
            }),
        });
        if (response.ok) {
            console.log('ticket created successfully')
            window.location.reload();
        }
    }
    catch (error) {
        console.log('error', error);

    }
})
rejectedForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    const title = document.getElementById('ticket-title-rejected').value;
    const description = '';
    const status = "Backlog";
    const priority = "Medium";
    const created_by = user_id;
    const due_date = "2025-01-13";
    const ticket_status = "rejected";


    try {
        const response = await fetch(`${API_BASE_URL}/ticket`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id,
                title,
                description,
                status,
                priority,
                created_by,
                due_date,
                ticket_status
            }),
        });
        if (response.ok) {
            console.log('ticket created successfully')
            window.location.reload();
        }
    }
    catch (error) {
        console.log('error', error);

    }
})
approvedForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    const title = document.getElementById('ticket-title-approved').value;
    const description = '';
    const status = "Backlog";
    const priority = "Medium";
    const created_by = user_id;
    const due_date = "2025-01-13";
    const ticket_status = "approved";


    try {
        const response = await fetch(`${API_BASE_URL}/ticket`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                project_id,
                title,
                description,
                status,
                priority,
                created_by,
                due_date,
                ticket_status
            }),
        });
        if (response.ok) {
            console.log('ticket created successfully')
            window.location.reload();
        }
    }
    catch (error) {
        console.log('error', error);

    }
})
