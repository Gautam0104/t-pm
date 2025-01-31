function changeBackground(imageUrl) {
    const todoFooter = document.getElementById("footer");
    const todoHeader = document.getElementsByTagName("header");
    const todoButton = document.getElementsByClassName("kanban-title-button");
    const todoTitle = document.getElementById("project-title-input");
    const todoForm = document.getElementsByClassName("new-item-form")
    console.log(todoTitle);

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


    document.body.style.background = `url('${imageUrl}') no-repeat center center/cover`;
    console.log(todoFooter);
    todoFooter.style.backgroundColor = "#ffffff"
    todoTitle.style.backgroundColor = "#ffffff"


}