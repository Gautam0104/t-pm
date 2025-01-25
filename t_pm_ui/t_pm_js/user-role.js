const colorBoxes = document.querySelectorAll(".color-box");
const activeMenu = document.querySelector(".menu-link-active");
const footerLink = document.querySelectorAll(".footer-link");
const othertext = document.querySelectorAll(".otext");
const acBtn = document.querySelector(".acbutton");
const btnC = document.querySelectorAll(".btnCSwitch");
const cardBg = document.querySelectorAll(".card-bg");
const progressBar = document.querySelectorAll(".progress-bar");
const pageItem = document.querySelectorAll(".page-item");

// Add click event to each color box
colorBoxes.forEach(box => {
    box.addEventListener("click", () => {
        const bgcolor = box.dataset.bgcolor; // Get the color from data attribute
        const color = box.dataset.color; // Get the color from data attribute
        acBtn.classList.remove("active");
        activeMenu.style.backgroundColor = bgcolor;
        activeMenu.style.color = "#fff";

        footerLink.forEach(footerItem => {
            footerItem.style.color = bgcolor;
        });
        othertext.forEach(Item => {
            Item.classList.remove("text-primary");
            Item.classList.remove("text-danger");
            Item.style.color = bgcolor;
        });
        btnC.forEach(Item => {
            Item.classList.remove("btn-primary");
            Item.style.color = "#fff";
            Item.style.backgroundColor = bgcolor;
        });
        progressBar.forEach(Item => {
            Item.style.backgroundColor = bgcolor;
        });
        pageItem.forEach(Item => {
            if ((Item.classList = "active")) {
                Item.classList.remove("active");
                Item.style.margin = "4px";
                Item.style.backgroundColor = "#efeef0";
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const API_BASE_URL = ENV.API_BASE_URL;

    async function fetchRoles() {
        try {
            // Replace `/api/roles` with your actual API endpoint
            const response = await fetch(`${API_BASE_URL}/GetRoles`);
            const roles = await response.json(); // Assuming the API returns a JSON array

            // Get the container element

            if (!rolesContainer) {
                console.error("rolesContainer element not found"); // Debugging log
                return;
            }

            // Clear any existing content
            // rolesContainer.innerHTML = '';

            // Dynamically create and append role cards
            roles.forEach(role => {
                const countRole = document.getElementById("count-role");
                const cardDiv = document.getElementById("rolesContainer");

                const card = `
                        <div class="col-xl-4 col-lg-6 col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 id = "count-role" class="fw-normal mb-0 text-body">Total 4 users</h6>
                </div>
                <div class="d-flex justify-content-between align-items-end">
                  <div class="role-heading">
                    <h5 class="mb-1">${role.role_name}</h5>
                    <a href="javascript:;" data-bs-toggle="modal" data-bs-target="#addRoleModal"
                      class="role-edit-modal "><span class="otext">Edit Role</span></a>
                  </div>
                  <a href="javascript:void(0);"><i class="ti ti-copy ti-md text-heading"></i></a>
                </div>
              </div>
            </div>
          </div>
        `;

                cardDiv.innerHTML += card;
            });
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    // Call the function on page load
    fetchRoles();
    setTimeout(() => {
        const cardDiv = document.getElementById("rolesContainer");
        const card = `<div class="col-xl-4 col-lg-6 col-md-6">
            <div class="card h-100">
              <div class="row h-100">
                <div class="col-sm-5">
                  <div class="d-flex align-items-end h-100 justify-content-center mt-sm-0 mt-4">
                    <img src="../assets/img/illustrations/add-new-roles.png" class="img-fluid mt-sm-4 mt-md-0"
                      alt="add-new-roles" width="83" />
                  </div>
                </div>
                <div class="col-sm-7">
                  <div class="card-body text-sm-end text-center ps-sm-0">
                    <button data-bs-target="#addRoleModal" data-bs-toggle="modal"
                      class="btn btn-sm btn-primary mb-4 text-nowrap add-new-role btnCSwitch">
                      Add New Role
                    </button>
                    <p class="mb-0">
                      Add new role, <br />
                      if it doesn't exist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        `;

        cardDiv.innerHTML += card;
    }, 1000); // Adjust delay if necessary
});
