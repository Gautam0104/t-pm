function vpMenuSwitch() {
    let vpMenu = document.getElementById("VPNavScreen");

    vpMenu.classList.toggle("VPNavScreenshow");


}

function sideMenutoggle() {
    let aside = document.getElementById("sidemenu");
    let VPbackdrop = document.getElementById("backdrop");

    aside.classList.toggle("open");
    VPbackdrop.classList.toggle("backdropshow");
}