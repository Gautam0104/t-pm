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

// let start = new Date();
let date = new Date();
let start= date;
let end = date;


// let nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
// // prettier-ignore
// let nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1);
// // prettier-ignore
// let prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1);
    
    
let tickets = [];
// console.log(tickets);
// Dynamically map tickets to events

  window.events = tickets.map(ticket => ({
  
  // id: ticket.ticket_id,
  // url: '', // Placeholder for URL, can be dynamic if needed
  // title: ticket.title,
  // start: ticket.created_at,
  // end: ticket.due_date,
  //  // Using `created_at` as start date
  // allDay: true,
  // extendedProps: {
  //   calendar: 'Personal' // Static value, can be dynamic if needed
  // }
}));

//console.log(window.events);
