// Base URL of the API
const API_BASE_URL = ENV.API_BASE_URL; // Access the URL securely


// user list

const userData = async () => {
    return await fetch(`${API_BASE_URL}/users`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok ");
            }
            return response.json();
        })
        .then(users => {
            //console.log(users);
            const tbody = document.getElementById("user-tbody");
            users.map(user => {
                //console.log(user);


                const row = ` 
                             
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td>${user.first_name}</td>
                                    <td>${user.role_id}</td>
                                    <td>Plan</td>
                                    <td>Billing</td>
                                    <td>${user.user_status}</td>
                                    <td>Actions</td>
                                </tr>
                            `
                tbody.innerHTML += row;
            })

        })
}

userData();