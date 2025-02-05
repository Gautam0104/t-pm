// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely

const featureComparisonData = async () => {
    await fetch(`${API_BASE_URL}/feature-comparison`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok ");
            }
            return response.json();
        })
        .then(data => {
            const modifiedResults = data.map(modifiedData => {
                let verificationBoxTrello = "";
                switch (modifiedData.trello) {
                    case 1:
                        verificationBoxTrello = `<label class="checkbox-container">
                                                    <input type="checkbox" class="toggle-checkbox" checked>
                                                    <span class="checkbox-display"></span>
                                                </label>`;
                        break;
                    case 2:
                        verificationBoxTrello = `<label class="checkbox-container">
                                                    <input type="checkbox" class="toggle-checkbox">
                                                    <span class="checkbox-display"></span>
                                                </label>`;
                        break;
                    default:
                        verificationBoxTrello = `<label class="checkbox-container">
                                                    <input type="checkbox" class="toggle-checkbox" checked>
                                                    <span class="checkbox-display"></span>
                                                </label>`;
                }
                let verificationBoxTpm = "";
                switch (modifiedData.tpm) {
                    case 1:
                        verificationBoxTpm = `<label class="checkbox-container">
                                                    <input type="checkbox" class="toggle-checkbox" checked>
                                                    <span class="checkbox-display"></span>
                                                </label>`;
                        break;
                    case 2:
                        verificationBoxTpm = `<label class="checkbox-container">
                                                    <input type="checkbox" class="toggle-checkbox">
                                                    <span class="checkbox-display"></span>
                                                </label>`;
                        break;
                    default:
                        verificationBoxTpm = `<label class="checkbox-container">
                                                    <input type="checkbox" class="toggle-checkbox">
                                                    <span class="checkbox-display"></span>
                                                </label>`;
                }

                return {
                    id: modifiedData.id,
                    feature: modifiedData.feature,
                    trello: verificationBoxTrello,
                    tpm: verificationBoxTpm,
                    notes: modifiedData.notes,
                    trello_image: modifiedData.trello_image,
                    tpm_image: modifiedData.t_pm_image
                };
            });
            let featureIndex = 1;
            modifiedResults.map(element => {
                const tableBody = document.getElementById("feature-table-body");
                const tableBodyContent = ` <tr>
    <td>${featureIndex++}</td>
    <td class="feature">${element.feature}</td>
    <td>${element.trello}</td>
    <td>${element.tpm}</td>
    <td class="notes">${element.notes}</td>
    <td>
        <button class="toggle-btn" onclick="toggleRow(this)">
            <i class="ti ti-chevron-right  ti-30px me-1_5"></i>
        </button>
    </td>
</tr>
<tr class="image-row" style="display: none;">
    <td></td>
    <td class=""><img class="rounded h-100 w-100" src="../assets/img/feature-comparison-image/${element.trello_image}" alt="" height="100%" width="100%" style="border-radius:5px;"></td>
    <td></td>
    <td></td>
    <td><img class="rounded h-100 w-100" src="../assets/img/feature-comparison-image/${element.tpm_image}" alt="" height="100%" width="100%" style="border-radius:5px;"></td>
</tr>`;

                tableBody.innerHTML += tableBodyContent;
                let imageRow = document.getElementsByClassName("image-row");

            });
        });
};



function toggleRow(button) {
    let row = button.closest("tr").nextElementSibling; // Get the next row
    if (row.style.display === "none" || row.style.display === "") {
        row.style.display = "table-row";
        button.innerHTML = `<i class="ti ti-chevron-down  ti-30px me-1_5"></i>`; // Change icon
    } else {
        row.style.display = "none";
        button.innerHTML = `<i class="ti ti-chevron-right  ti-30px me-1_5"></i>`; // Change icon back
    }
}
featureComparisonData();
