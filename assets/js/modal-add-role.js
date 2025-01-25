// /**
//  * Add new role Modal JS
//  */

// 'use strict';

// document.addEventListener('DOMContentLoaded', function (e) {
//   (function () {
//     // add role form validation
//     FormValidation.formValidation(document.getElementById('addRoleForm'), {
//       fields: {
//         modalRoleName: {
//           validators: {
//             notEmpty: {
//               message: 'Please enter role name'
//             }
//           }
//         }
//       },
//       plugins: {
//         trigger: new FormValidation.plugins.Trigger(),
//         bootstrap5: new FormValidation.plugins.Bootstrap5({
//           // Use this for enabling/changing valid/invalid class
//           // eleInvalidClass: '',
//           eleValidClass: '',
//           rowSelector: '.col-12'
//         }),
//         submitButton: new FormValidation.plugins.SubmitButton(),
//         // Submit the form when all fields are valid
//         // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
//         autoFocus: new FormValidation.plugins.AutoFocus()
//       }
//     });

//     // Select All checkbox click
//     // const selectAll = document.querySelector('#selectAll'),
//     //   checkboxList = document.querySelectorAll('[type="checkbox"]');
//     // selectAll.addEventListener('change', t => {
//     //   checkboxList.forEach(e => {
//     //     e.checked = t.target.checked;
//     //   });
//     // });
//   })();
// });
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM fully loaded and parsed'); // Debugging log

  const form = document.getElementById('addRoleForm');
  if (!form) {
    console.error('Form not found'); // Debugging log
    return;
  }

  console.log('Form found'); // Debugging log

  const validation = FormValidation.formValidation(form, {
    fields: {
      modalRoleName: {
        validators: {
          notEmpty: {
            message: 'Please enter a role name',
          },
        },
      },
    },
    // plugins: {
    //   trigger: new FormValidation.plugins.Trigger(),
    //   bootstrap5: new FormValidation.plugins.Bootstrap5({
    //     eleValidClass: '', // No valid/invalid classes applied
    //    // rowSelector: '.col-12', // Validate fields within this row selector
    //   }),
    //   submitButton: new FormValidation.plugins.SubmitButton(),
    //   autoFocus: new FormValidation.plugins.AutoFocus(),
    // },
  });
  const API_BASE_URL = ENV.API_BASE_URL;
  // Submit form via Axios
  function closeModal() {
    $('#addRoleModal').modal('hide');
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission


    validation.validate().then(function (status) {
      //console.log('Validation status:', status); // Debugging log
      if (status === 'Valid') {
        const roleName = document.getElementById('modalRoleName').value;
        // console.log('Form is valid. Submitting...', roleName); // Debugging log

        // Send data to backend API using Axios
        axios
          .post(`${API_BASE_URL}/CreateRoles`, {
            roleName: roleName,
          })
          .then((response) => {
            console.log('API Response:', response); // Debugging log
            if (response.data.success) {
              closeModal()
              Swal.fire({
                title: "Role is Created Successfully",
                text: "The Role has been Created successfully.",
                icon: "success",
                confirmButtonText: "Ok!",
              }).then(() => {
                window.location.reload();
              })
              form.reset(); // Clear the form
            } else {
              closeModal()
              Swal.fire({
                title: "Role is Created Successfully",
                text: "The Role has been Created successfully.",
                icon: "success",
                confirmButtonText: "Ok!",
              }).then(() => {
                window.location.reload();
              })
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            if (error.response) {
              // Server responded with a status code out of 2xx range
              alert('Server Error: ' + error.response.data.message);
            } else {
              // Network or other error
              alert('An error occurred. Please try again.');
            }
          });
      } else {
        //console.log('Form validation failed.'); // Debugging log
      }
    });
  });

});