
if (localStorage.length > 0) {

} else {

    localStorage.setItem("colorMode", "primary");
    localStorage.setItem('colorCode', '#7367f0');
    localStorage.setItem("templateCustomizer-vertical-menu-template--Style", "light");
}

const themeMode = localStorage.getItem('templateCustomizer-vertical-menu-template--Style')

function colorPicker() {
    localStorage.setItem('colorMode', 'success');
    localStorage.setItem('colorCode', '#0d9394');
    location.reload();
}
function colorPickerPrimary() {

    localStorage.setItem('colorMode', 'primary');
    localStorage.setItem('colorCode', '#7367f0');

    location.reload();


}
function colorPickerWarning() {
    localStorage.setItem('colorMode', 'warning');
    localStorage.setItem('colorCode', '#ffab1d');
    location.reload();


}
function colorPickerSecondary() {
    localStorage.setItem('colorMode', 'secondary');
    localStorage.setItem('colorCode', '#2092ec');
    location.reload();


}
function colorPickerDanger() {
    localStorage.setItem('colorMode', 'danger');
    localStorage.setItem('colorCode', '#eb3d63');
    location.reload();


}

// Step 1: Create and set a new <link> element
const newcolorLink = document.createElement('link');
const cardColor = localStorage.getItem('colorMode');
if (themeMode === 'light') {
    newcolorLink.rel = 'stylesheet'; // Specify the relationship, e.g., stylesheet
    newcolorLink.href = `custom_colorpicker/${cardColor}-color.css`;
} else {
    newcolorLink.rel = 'stylesheet'; // Specify the relationship, e.g., stylesheet
    newcolorLink.href = `custom_colorpicker/${cardColor}-color-dark.css`;
}
document.head.appendChild(newcolorLink);


// Step 2: Create and set a new <link> element
const newLink = document.createElement('link');
// const cardColor = localStorage.getItem('colorMode');
newLink.rel = 'stylesheet'; // Specify the relationship, e.g., stylesheet
newLink.href = `custom_colorpicker/card-${cardColor}.css`;
document.head.appendChild(newLink);
