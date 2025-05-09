import { API_ROUTES } from "../apiRoutesHeader.js";
import { ELEMENT_IDS } from "./element_id.js";

const API_BASE_URL = ENV.API_BASE_URL;

function getCustomFieldBody() {
  return `
    <div class="modal-body">
      <div id="customFieldFormContainer">
        <div class="mb-3">
          <label for="customFieldName" class="form-label">Field Name</label>
          <input type="text" class="form-control" id="customFieldName" placeholder="Enter field name">
        </div>
        <div class="mb-3">
          <label for="customFieldType" class="form-label">Field Type</label>
          <select class="form-select" id="customFieldType">
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="checkbox">Checkbox</option>
            <option value="dropdown">Dropdown</option>
          </select>
        </div>
        <div class="mb-3" id="dropdownOptionsContainer" style="display: none;">
          <label class="form-label">Dropdown Options</label>
          <div id="dropdownOptionsList"></div>
          <div class="input-group mt-2">
            <input type="text" class="form-control" id="newDropdownOption" placeholder="Enter option">
            <select class="form-select" id="dropdownColorSelect">
              <option value="#dc3545">Red</option>
              <option value="#0d6efd">Blue</option>
              <option value="#198754">Green</option>
              <option value="#ffc107">Yellow</option>
              <option value="#6f42c1">Purple</option>
            </select>
            <button class="btn btn-outline-primary" type="button" id="addDropdownOption">Add</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCustomFieldsList(container, fields, projectId) {
  container.innerHTML = fields.map(field => {
    return `
      <div class="border p-2 mb-2">
        <strong>${field.name}</strong> (${field.type})
        ${field.type === 'dropdown' && field.options?.length ? `
          <div class="mt-1">
            ${field.options.map(opt => `<span class="badge me-1 mb-1" style="background-color:${opt.color};color:#fff;">${opt.label}</span>`).join('')}
          </div>` : ''}
        <div class="mt-2">
          <button class="btn btn-sm btn-outline-secondary me-2" onclick="editCustomField('${field.id}')">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCustomField('${field.id}', '${projectId}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

async function deleteCustomField(fieldId, projectId) {
  if (!confirm('Are you sure you want to delete this custom field?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}${API_ROUTES.CUSTOM_FIELD}/${fieldId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Delete failed');
    await loadCustomCardModal(projectId);
  } catch (err) {
    console.error(err);
    alert('Failed to delete custom field.');
  }
}

export async function loadCustomCardModal(projectId) {
  const customFieldModal = document.getElementById(ELEMENT_IDS.CUSTOM_FIELD_MODAL);
  if (!customFieldModal) {
    console.error("Custom field modal element not found");
    return;
  }

  const modal = new bootstrap.Modal(customFieldModal);
  modal.show();

  const modalContent = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Custom Fields</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div id="customFieldsDisplay" class="p-3"></div>
        <div id="customFieldDynamicBody"></div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="cancelCustomField">Cancel</button>
          <button type="button" class="btn btn-primary" id="saveCustomField">Save</button>
        </div>
      </div>
    </div>
  `;

  customFieldModal.innerHTML = modalContent;

  const dropdownOptionsArray = [];

  const dynamicBody = document.getElementById(ELEMENT_IDS.CUSTOM_FIELD_DYNAMIC_BODY);
  const displayContainer = document.getElementById(ELEMENT_IDS.CUSTOM_FIELD_DISPLAY);
  const showBodyButton = document.createElement("button");
  showBodyButton.className = "btn btn-outline-secondary m-2";
  showBodyButton.textContent = "Add New Custom Field";
  dynamicBody.appendChild(showBodyButton);

  let fields = [];

  async function fetchCustomFields() {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ROUTES.CUSTOM_FIELD}/${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch custom fields');
      fields = await res.json();
      renderCustomFieldsList(displayContainer, fields, projectId);
    } catch (err) {
      console.error(err);
      displayContainer.innerHTML = '<div class="text-danger">Failed to load custom fields.</div>';
    }
  }

  await fetchCustomFields();

  showBodyButton.addEventListener("click", () => {
    if (dynamicBody.querySelector(".modal-body")) {
      dynamicBody.innerHTML = '';
      dynamicBody.appendChild(showBodyButton);
      displayContainer.style.display = 'block';
    } else {
      dynamicBody.innerHTML = getCustomFieldBody();
      displayContainer.style.display = 'none';

      document.getElementById(ELEMENT_IDS.CUSTOM_FIELD_TYPE)?.addEventListener('change', function () {
        const dropdownContainer = document.getElementById(ELEMENT_IDS.DROPDOWN_OPTIONS_CONTAINER);
        dropdownContainer.style.display = this.value === 'dropdown' ? 'block' : 'none';
      });

      document.getElementById(ELEMENT_IDS.ADD_DROPDOWN_OPTIONS)?.addEventListener('click', function () {
        const newOptionInput = document.getElementById(ELEMENT_IDS.NEW_DROPDOWN_OPTION);
        const colorSelect = document.getElementById(ELEMENT_IDS.DROPDOWN_COLOR_SELECT);
        const optionValue = newOptionInput.value.trim();
        const color = colorSelect.value;

        if (optionValue && !dropdownOptionsArray.find(opt => opt.label === optionValue)) {
          dropdownOptionsArray.push({ label: optionValue, color });

          const optionList = document.getElementById(ELEMENT_IDS.DROPDOWN_OPTION_LIST);
          const optionTag = document.createElement('span');
          optionTag.className = 'badge me-1 mb-1';
          optionTag.style.backgroundColor = color;
          optionTag.style.color = '#fff';
          optionTag.textContent = optionValue;
          optionList.appendChild(optionTag);
          newOptionInput.value = '';
        }
      });
    }
  });

  document.getElementById(ELEMENT_IDS.CANCEL_CUSTOM_FIELD)?.addEventListener('click', function () {
    dynamicBody.innerHTML = '';
    dynamicBody.appendChild(showBodyButton);
    displayContainer.style.display = 'block';
  });

  document.getElementById(ELEMENT_IDS.SAVE_CUSTOM_FIELD)?.addEventListener('click', async function () {
    const customName = document.getElementById(ELEMENT_IDS.CUSTOM_FIELD_NAME)?.value.trim();
    const customType = document.getElementById(ELEMENT_IDS.CUSTOM_FIELD_TYPE)?.value;

    if (!customName) {
      alert("Field name is required.");
      return;
    }

    const payload = {
      projectId,
      customName,
      customType,
      ...(customType === 'dropdown' && { options: dropdownOptionsArray })
    };

    try {
      const [response1, response2] = await Promise.all([
        fetch(`${API_BASE_URL}${API_ROUTES.CUSTOM_FIELD}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }),
        fetch(`${API_BASE_URL}${API_ROUTES.FETCH_CUSTOM_FIELD_VALUE}`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      ]);
    
      if (!response1.ok || !response2.ok) {
        throw new Error(`One or both requests failed: ${response1.status}, ${response2.status}`);
      }
    
      const result1 = await response1.json();
      const result2 = await response2.json();
    
      

      await fetchCustomFields();
      document.getElementById(ELEMENT_IDS.CANCEL_CUSTOM_FIELD)?.click();
    } catch (error) {
      console.error("Error saving custom field:", error);
      
    }
  });
}



window.loadCustomCardModal = loadCustomCardModal;
window.deleteCustomField = deleteCustomField;
