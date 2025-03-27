const API_BASE_URL = ENV.API_BASE_URL;

fetch(`${API_BASE_URL}/automation-data`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    const automationRule = document.getElementById(`rule-view`);

    data.map(item => {
      const ruleContent = ` <div class="main-content  border py-6 " style="margin-top: 50px;" >      
                          <div class="content-section">
                            <div class="row d-flex justify-content-between">
                              <div class="col-8">
                                <ul class="d-flex">
                                  <li class="menu-item me-1">
                                    <a href="" class="menu-link">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-tag"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-pencil"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-copy"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1" onclick="deleteAutomationButton(${item.id})">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-trash"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item">
                                    <a href="" class="menu-link me-1">
                                      <span class="bg-light p-2 fw-bold rounded"><i class="ti ti-location"></i></span>
                                    </a>
                                  </li>
                                  <li class="menu-item me-1">
                                    <a href="" class="btn btn-primary">
                                      <i class="ti ti-bell-plus-filled me-2"></i>Add to another board
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div class="col-4"><span class=""><a href="" style="color:#333232;">Enabled on 1
                                    board,</a>last modified a month
                                  ago</span></div>
                            </div>
                                  <div class="row d-flex justify-content-between px-10 py-3">
                              <div class="col d-flex p-4 w-100 bg-light rounded" >
                                 <span class="fw-medium">${item.button_title}</span>
                              </div>
                            </div>

                            <div class="row d-flex justify-content-between px-6">
                              <div class="col d-flex px-4 w-100  rounded">
                                <div class="d-flex me-5 ms-1">
                                  <input type="checkbox" class="form-check-input me-1">
                                  <span>Enable automation on board</span>
                                </div>
                                <div class="d-flex me-5 ms-1">
                                  <input type="checkbox" class="form-check-input me-1">
                                  <span>Disable automation on board</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          </div>
      
      
      
      
      

      
      `;

      automationRule.innerHTML += ruleContent;
    });
  });

async function deleteAutomationButton(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ROUTES.AUTOMATION_DATA}/${id}`,
      {
        method: "DELETE"
      }
    );

    if (response.ok) {
      console.log("You successfully deleted an automation button");
      window.location.reload();
    } else {
      console.log("Oops, something went wrong");
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}
