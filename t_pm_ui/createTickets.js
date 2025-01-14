// Base URL of the API
// const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely
var todoForm = document.getElementById('add-new-todo');
var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
var user_id = urlParams.get("user_id");
console.log("project id : " + project_id);
console.log("project leader id : " + user_id);

const pageName = document.getElementById("page-title-text");
fetch(`${API_BASE_URL}/project/${project_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        let statusText = "";

        pageName.innerText = data.project_name;

        console.log(data)
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
    });

todoForm.addEventListener('submit', async function (e) {
    e.preventDefault();


    const title = document.getElementById('ticket-title').value;
    const description = '';
    const status = "Backlog";
    const priority = "Medium";
    const created_by = user_id;
    const due_date = "2025-01-13"


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
                due_date


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