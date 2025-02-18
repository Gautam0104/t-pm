document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.querySelector(".form-check-input");
    const progressBar = document.querySelector(".progress-bar");
    const checklistTitle = document.querySelector("#new-checklist-title-box span");
    const progressText = document.querySelector(".col-1 span"); // Selecting the span showing progress percentage

    checkbox.addEventListener("change", function () {
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


const createChecklist = async () => {
    const checkList = document.getElementById("checklist-name").value

}