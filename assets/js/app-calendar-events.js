/**
 * App Calendar Events
 */
'use strict';
let tickets; // Declare tickets globally or in a shared scope

async function fetchAndStoreTickets(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    tickets = await response.json(); // Assign the parsed JSON data to tickets

  } catch (error) {
    console.error("Error fetching tickets:", error);
    // Handle the error appropriately, e.g., display an error message to the user
    tickets = []; // Or some default value
  }
}

// Call the function
fetchAndStoreTickets("https://thunderbees.com.br/tpm_api/tickets");







let date = new Date();
let nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
// prettier-ignore
let nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1);
// prettier-ignore
let prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1);

// Use the data after a delay  (improved with thenable check)
setTimeout(() => {
  if (tickets) {
    console.log('Fetched data outside fetch:', tickets);
    window.events = [
      // tickets.map(ele => {

      //   id: ele.ticket_id;
      //   url: '';
      //   title: ele.title;
      //   start: date;
      //   end: nextDay;
      //   allDay: false;
      //   extendedProps: {
      //     calendar: 'Business'

      //   }
      // })
      {
        id: 1,
        url: '',
        title: 'Design Review',
        start: date,
        end: nextDay,
        allDay: false,
        extendedProps: {
          calendar: 'Business'
        }
      },
      // {
      //   id: 2,
      //   url: '',
      //   title: 'Meeting With Client',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'Business'
      //   }
      // },
      // {
      //   id: 3,
      //   url: '',
      //   title: 'Family Trip',
      //   allDay: true,
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, -9),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, -7),
      //   extendedProps: {
      //     calendar: 'Holiday'
      //   }
      // },
      // {
      //   id: 4,
      //   url: '',
      //   title: "Doctor's Appointment",
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
      //   extendedProps: {
      //     calendar: 'Personal'
      //   }
      // },
      // {
      //   id: 5,
      //   url: '',
      //   title: 'Dart Game?',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'ETC'
      //   }
      // },
      // {
      //   id: 6,
      //   url: '',
      //   title: 'Meditation',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'Personal'
      //   }
      // },
      // {
      //   id: 7,
      //   url: '',
      //   title: 'Dinner',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      //   extendedProps: {
      //     calendar: 'Family'
      //   }
      // },
      // {
      //   id: 8,
      //   url: '',
      //   title: 'Product Review',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'Business'
      //   }
      // },
      // {
      //   id: tickets[0].ticket_id,
      //   url: '',
      //   title: 'tickets[0].title',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      //   end: nextMonth,
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'Business'
      //   }
      // },
      // {
      //   id: 9,
      //   url: '',
      //   title: 'Projects and Tickets Due Date',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      //   end: nextMonth,
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'Business'
      //   }
      // }, {
      //   id: 9,
      //   url: '',
      //   title: 'Calendar Due Date',
      //   start: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      //   end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'Business'
      //   }
      // },
      // {
      //   id: 10,
      //   url: '',
      //   title: 'Monthly Checkup',
      //   start: prevMonth,
      //   end: prevMonth,
      //   allDay: true,
      //   extendedProps: {
      //     calendar: 'Personal'
      //   }
      // }
    ];
  } else {
    console.log("Tickets data not yet available");
  }
}, 1000);

// window.events = [
//   // {
//   //   id: 1,
//   //   url: '',
//   //   title: 'Design Review',
//   //   start: date,
//   //   end: nextDay,
//   //   allDay: false,
//   //   extendedProps: {
//   //     calendar: 'Business'
//   //   }
//   // },
//   // {
//   //   id: 2,
//   //   url: '',
//   //   title: 'Meeting With Client',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'Business'
//   //   }
//   // },
//   // {
//   //   id: 3,
//   //   url: '',
//   //   title: 'Family Trip',
//   //   allDay: true,
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, -9),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, -7),
//   //   extendedProps: {
//   //     calendar: 'Holiday'
//   //   }
//   // },
//   // {
//   //   id: 4,
//   //   url: '',
//   //   title: "Doctor's Appointment",
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
//   //   extendedProps: {
//   //     calendar: 'Personal'
//   //   }
//   // },
//   // {
//   //   id: 5,
//   //   url: '',
//   //   title: 'Dart Game?',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'ETC'
//   //   }
//   // },
//   // {
//   //   id: 6,
//   //   url: '',
//   //   title: 'Meditation',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'Personal'
//   //   }
//   // },
//   // {
//   //   id: 7,
//   //   url: '',
//   //   title: 'Dinner',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
//   //   extendedProps: {
//   //     calendar: 'Family'
//   //   }
//   // },
//   // {
//   //   id: 8,
//   //   url: '',
//   //   title: 'Product Review',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'Business'
//   //   }
//   // },
//   // {
//   //   id: 9,
//   //   url: '',
//   //   title: 'Dashboard Due Date',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, 0),
//   //   end: nextMonth,
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'Business'
//   //   }
//   // },
//   // {
//   //   id: 9,
//   //   url: '',
//   //   title: 'Projects and Tickets Due Date',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, 0),
//   //   end: nextMonth,
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'Business'
//   //   }
//   // }, {
//   //   id: 9,
//   //   url: '',
//   //   title: 'Calendar Due Date',
//   //   start: new Date(date.getFullYear(), date.getMonth() + 1, 0),
//   //   end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'Business'
//   //   }
//   // },
//   // {
//   //   id: 10,
//   //   url: '',
//   //   title: 'Monthly Checkup',
//   //   start: prevMonth,
//   //   end: prevMonth,
//   //   allDay: true,
//   //   extendedProps: {
//   //     calendar: 'Personal'
//   //   }
//   // }
// ];
