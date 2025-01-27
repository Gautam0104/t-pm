const API_BASE_URL = ENV.API_BASE_URL;
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
                    <a href="javascript:;" data-bs-toggle="modal" data-bs-target="#updateRoleModal" onclick="updateRole(${role.role_id}, '${role.role_name}')"
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



const updateRole = (role_id, role_name) => {
  console.log('Updating role:', role_id, role_name);
  const updateroleForm = document.getElementById("update-role-form");
  const updateRoleContent = ` 
                    <form id="updateRoleForm" class="row g-6" onsubmit="return false">
                      <div class="col-12">
                        <label class="form-label" for="modalRoleName">Role Name</label>
                        <input type="text" id="updateRoleName"  class="form-control" value='${role_name}'
                            />
                      </div>
                      <div class="col-12 text-center">
                        <button type="submit" class="btn btn-primary me-3 btnCSwitch " data-bs-dismiss="modal" >Update</button>
                        <button type="reset" class="btn btn-label-secondary" data-bs-dismiss="modal" aria-label="Close">
                          Cancel
                        </button>
                      </div>
                    </form>`
  updateroleForm.innerHTML = updateRoleContent;

  document.getElementById("updateRoleForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const role_name = document.getElementById('updateRoleName').value.trim();

    try {

      const response = await fetch(`${API_BASE_URL}/updaterole/${role_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_name
        })
      });
      if (response.ok) {
        Swal.fire({
          title: "Role Updated Successfully",
          text: "A role is update from your projects",
          icon: "success",
          confirmButtonText: "Ok!"
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "something went wrong. Try again!",
          icon: "error",
          confirmButtonText: "Retry!"
        });
      }
    } catch (error) {
      console.log(error);

    }
  })
}


fetch(`${API_BASE_URL}/GetRoles`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok ");
    }
    return response.json();
  })
  .then(roles => {
    roles.map(item => {
      const tablebody = document.getElementById("role-data");
      const isoDate = `${item.created_at}`;

      // Convert to a Date object
      const date = new Date(isoDate);

      // Extract date components
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
      const year = date.getFullYear();

      // Extract time components
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");

      // Combine date and time
      const formattedDateTime = `${day}/${month}/${year} , ${hours}:${minutes}:${seconds}`;

      console.log("Formatted Date and Time:", formattedDateTime);

      const isoDateupdate = `${item.updated_at}`;

      // Convert to a Date object
      const dateupdate = new Date(isoDateupdate);

      // Extract date components
      const day1 = dateupdate.getDate().toString().padStart(2, "0");
      const month1 = (dateupdate.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Months are 0-based
      const year1 = dateupdate.getFullYear();

      // Extract time components
      const hours1 = dateupdate.getHours().toString().padStart(2, "0");
      const minutes1 = dateupdate
        .getMinutes()
        .toString()
        .padStart(2, "0");
      const seconds1 = dateupdate
        .getSeconds()
        .toString()
        .padStart(2, "0");

      // Combine date and time
      const formattedDateTimeupdate = `${day1}/${month1}/${year1} , ${hours1}:${minutes1}:${seconds1}`;
      const bodyContent = ` <tr>
                          <td></td>
                          <td></td>
                          <td>${item.role_name}</td>
                          <td>Thudner</td>
                          <td>${formattedDateTime}</td>
                          <td>${formattedDateTimeupdate}</td>
                          <td>Thunder</td>
                          <td class="" style="">
                          <div class="d-flex align-items-center">
                          <a href="javascript:;" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record">
                          <i class="ti ti-trash ti-md">
                          </i>
                          </a>
                          <a href="javascript:void();" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill" data-bs-toggle="modal" onclick="fetchrolehistory(${item.role_id}, '${item.role_name}')"
                           data-bs-target="#pricingModal">
                          <i class="ti ti-eye ti-md"></i>
                          </a>
                          <a href="javascript:;" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                          <i class="ti ti-dots-vertical ti-md"></i>
                          </a><div class="dropdown-menu dropdown-menu-end m-0">
                          <a href="javascript:;" "="" class="dropdown-item">Edit</a>
                          <a href="javascript:;" class="dropdown-item">Suspend</a><
                          /div>
                          </div>
                          </td>
                        </tr>`;

      tablebody.innerHTML += bodyContent;



    })
  })


const fetchrolehistory = async (roleId, roleName) => {
  // Clear the previous content
  const historytablebody = document.getElementById("role-history-data");
  historytablebody.innerHTML = '';  // Clear any existing rows

  // Fetch role history based on roleId
  await fetch(`${API_BASE_URL}/role-history/${roleId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(roleHistory => {
      // Loop through each role history entry and append it to the table
      roleHistory.map(element => {
        const isoDateupdate_history = `${element.updated_at}`;

        // Convert to a Date object
        const dateupdate_history = new Date(isoDateupdate_history);

        // Extract date components
        const day1 = dateupdate_history.getDate().toString().padStart(2, "0");
        const month1 = (dateupdate_history.getMonth() + 1)
          .toString()
          .padStart(2, "0"); // Months are 0-based
        const year1 = dateupdate_history.getFullYear();

        // Extract time components
        const hours1 = dateupdate_history.getHours().toString().padStart(2, "0");
        const minutes1 = dateupdate_history
          .getMinutes()
          .toString()
          .padStart(2, "0");
        const seconds1 = dateupdate_history
          .getSeconds()
          .toString()
          .padStart(2, "0");

        // Combine date and time
        const formattedDateTimeupdate_history = `${day1}/${month1}/${year1} , ${hours1}:${minutes1}:${seconds1}`;

        // Create table row content
        const historybodyContent = ` 
          <tr>
            <td>${element.old_role_name}</td>
            <td>${roleName}</td>
            <td>${formattedDateTimeupdate_history}</td>
            <td>Thunder</td>
          </tr>`;

        // Append the new row to the table body
        historytablebody.innerHTML += historybodyContent;
      });
    })
    .catch(error => {
      console.error("Error fetching role history:", error);
    });
};
