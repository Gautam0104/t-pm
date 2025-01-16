// fetch("https://thunderbees.com.br/tpm_api/tickets")
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Network response was not ok " + response.statusText);
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log("Response data:", data); 
//         // Log the response data here
//     })
//     .catch(error => {
//         console.error("There was a problem with the fetch operation:", error);
//     });
let date = new Date();
let nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
// prettier-ignore
let nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1);
// prettier-ignore
let prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1);
    
    
let tickets = [
  {
    ticket_id: 16,
    project_id: 53,
    title: "Total Number of Active Projects and Tickets",
    description: "Dashboard project created",
    status: "Backlog",
    priority: "Medium",
    created_by: 23,
    due_date: "2025-01-13T00:00:00.000Z",
    created_at: "2025-01-13T05:09:42.000Z",
    updated_at: "2025-01-13T05:09:42.000Z",
    project_name: "Dashboard",
    project_leader_id: 23,
    project_status: 1,
    project_type: "project",
    total_eta: "2025-01-31T11:44:00.000Z",
    user_id: 23,
    role_id: 4,
    username: "Thunder",
    password: "$2a$10$eapWcM2fuVE/fMXx/R0eLO28QDyRveJynRdIfrIh1ObhzcdJmmcC2",
    first_name: "Thunder",
    last_name: "",
    user_status: 1
  },
  {
    ticket_id: 16,
    project_id: 53,
    title: "Test tickets",
    description: "Dashboard project created",
    status: "Backlog",
    priority: "Medium",
    created_by: 23,
    due_date: "2025-01-13T00:00:00.000Z",
    created_at: "2025-01-14T05:09:42.000Z",
    updated_at: "2025-01-13T05:09:42.000Z",
    project_name: "Dashboard",
    project_leader_id: 23,
    project_status: 1,
    project_type: "project",
    total_eta: "2025-01-31T11:44:00.000Z",
    user_id: 23,
    role_id: 4,
    username: "Thunder",
    password: "$2a$10$eapWcM2fuVE/fMXx/R0eLO28QDyRveJynRdIfrIh1ObhzcdJmmcC2",
    first_name: "Thunder",
    last_name: "",
    user_status: 1
  },
  
  // Add more ticket objects here...
];
//console.log(tickets);
// Dynamically map tickets to events
window.events = tickets.map(ticket => ({
  id: ticket.ticket_id,
  url: '', // Placeholder for URL, can be dynamic if needed
  title: ticket.title,
  start: new Date(ticket.created_at),
  end: new Date(ticket.due_date),
   // Using `created_at` as start date
  allDay: true,
  extendedProps: {
    calendar: 'Personal' // Static value, can be dynamic if needed
  }
}));

//console.log(window.events);
