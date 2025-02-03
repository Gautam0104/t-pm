
var urlParams = new URLSearchParams(window.location.search);
var project_id = urlParams.get("id");
const boardimageUrl = localStorage.getItem(`board-bg-image-url ${project_id}`);
if (boardimageUrl) {

    setTimeout(() => {

        changeElebg()
    }, 500);
    document.body.style.background = `url('${boardimageUrl}') no-repeat center center/cover`;

} else {
    defaultBackground()
}
function changeBackground(imageUrl) {
    changeElebg();

    localStorage.setItem(`board-bg-image-url ${project_id}`, imageUrl)
    const boardimageUrl = localStorage.getItem(`board-bg-image-url ${project_id}`);

    document.body.style.background = `url('${boardimageUrl}') no-repeat center center/cover`;
    console.log(todoFooter);


}





function defaultBackground() {
    resetElebg();
    localStorage.removeItem(`board-bg-image-url ${project_id}`);
    window.location.reload();
}

function changeElebg() {
    const todoFooter = document.getElementById("footer");
    const todoHeader = document.getElementsByTagName("header");
    const todoButton = document.getElementsByClassName("kanban-title-button");
    const todoTitle = document.getElementById("project-title-input");
    const todoForm = document.getElementsByClassName("new-item-form")
    console.log("todo title is : ", todoTitle);

    // Convert the HTMLCollection to an array
    const headerArray = Array.from(todoHeader);
    const buttonArray = Array.from(todoButton);
    const formArray = Array.from(todoForm);

    headerArray.map(header => {
        header.style.backgroundColor = "#ffffff"
    });
    buttonArray.map(button => {
        button.style.backgroundColor = "#ffffff"
    });
    formArray.map(form => {
        form.style.backgroundColor = "#ffffff"
        form.style.borderRadius = "5px";
    });
    todoFooter.style.backgroundColor = "#ffffff"
    todoTitle.style.backgroundColor = "#ffffff"

}
function resetElebg() {
    const todoFooter = document.getElementById("footer");
    const todoHeader = document.getElementsByTagName("header");
    const todoButton = document.getElementsByClassName("kanban-title-button");
    const todoTitle = document.getElementById("project-title-input");
    const todoForm = document.getElementsByClassName("new-item-form");

    // Convert the HTMLCollection to an array
    const headerArray = Array.from(todoHeader);
    const buttonArray = Array.from(todoButton);
    const formArray = Array.from(todoForm);

    // Reset the styles for header
    headerArray.map(header => {
        header.style.backgroundColor = ""; // Remove the background color (revert to default)
    });

    // Reset the styles for button
    buttonArray.map(button => {
        button.style.backgroundColor = ""; // Remove the background color (revert to default)
    });

    // Reset the styles for form
    formArray.map(form => {
        form.style.backgroundColor = ""; // Remove the background color (revert to default)
        form.style.borderRadius = ""; // Reset the border radius
    });

    // Reset the footer background color
    todoFooter.style.backgroundColor = ""; // Revert to the default color

    // Reset the project title input background color
    todoTitle.style.backgroundColor = ""; // Revert to the default color
}