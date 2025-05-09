import { ELEMENT_IDS } from "./element_id.js";
document.addEventListener('DOMContentLoaded', () => {
  const keywordInput = document.getElementById(ELEMENT_IDS.KEYWORD_FILTER);
  const kanbanContainer = document.getElementById(ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER);

  if (keywordInput && kanbanContainer) {
    keywordInput.addEventListener('keyup', () => {
      const keyword = keywordInput.value.toLowerCase().trim();
      applyFilters(); // Call a new function to handle all filters
    });

    // Add event listeners for member filter checkboxes
    const noMembersCheckbox = document.getElementById(ELEMENT_IDS.FILTER_NO_MEMBERS);
    const assignedToMeCheckbox = document.getElementById(ELEMENT_IDS.FILTER_ASSINGNED_TO_ME);

    if (noMembersCheckbox) {
      noMembersCheckbox.addEventListener('change', applyFilters);
    }
    if (assignedToMeCheckbox) {
      assignedToMeCheckbox.addEventListener('change', applyFilters);
    }

  } else {
    if (!keywordInput) console.error('Keyword input field with ID "keyword-filter" not found.');
    if (!kanbanContainer) console.error('Kanban container with ID "kanban-wrapper-container" not found.');
  }

  // Due Date filter listeners -
  const dueDateCheckboxes = [
    'filter-no-dates', 'filter-overdue', 'filter-due-tomorrow',
    'filter-due-week', 'filter-due-month'
  ];
  dueDateCheckboxes.forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) checkbox.addEventListener('change', applyFilters);
    else console.warn(`Due date filter checkbox with ID "${id}" not found.`);
  });

  // Activity filter listeners - 
  const activityCheckboxes = [
    'filter-last-week', 'filter-last-2weeks',
    'filter-last-4weeks', 'filter-inactive'
  ];
  activityCheckboxes.forEach(id => {
    const checkbox = document.getElementById(id);
    if (checkbox) checkbox.addEventListener('change', applyFilters);
    else console.warn(`Activity filter checkbox with ID "${id}" not found.`);
  });
});

function applyFilters() {
  const keywordInput = document.getElementById(ELEMENT_IDS.KEYWORD_FILTER);
  const kanbanContainer = document.getElementById(ELEMENT_IDS.KANBAN_WRAPPER_CONTAINER);
  
  // Member filter checkboxes
  const noMembersCheckbox = document.getElementById(ELEMENT_IDS.FILTER_NO_MEMBERS);
  const assignedToMeCheckbox = document.getElementById(ELEMENT_IDS.FILTER_ASSINGNED_TO_ME);

  // Due Date filter checkboxes
  const noDatesCheckbox = document.getElementById(ELEMENT_IDS.FILTER_NO_DATES);
  const overdueCheckbox = document.getElementById(ELEMENT_IDS. FILTER_OVERDUE);
  const dueTomorrowCheckbox = document.getElementById(ELEMENT_IDS.FILTER_DUE_TOMORROW);
  const dueWeekCheckbox = document.getElementById(ELEMENT_IDS.FILTER_DUE_WEEK);
  const dueMonthCheckbox = document.getElementById(ELEMENT_IDS.FILTER_DUE_MONTH);

  // Activity filter checkboxes
  const activeLastWeekCheckbox = document.getElementById(ELEMENT_IDS.FILTER_LAST_WEEK);
  const activeLast2WeeksCheckbox = document.getElementById(ELEMENT_IDS.FILTER_LAST_2WEEKS);
  const activeLast4WeeksCheckbox = document.getElementById(ELEMENT_IDS.FILTER_LAST_4WEEKS);
  const inactiveCheckbox = document.getElementById(ELEMENT_IDS.FILTER_INACTIVE);

  if (!keywordInput || !kanbanContainer) return;

  const keyword = keywordInput.value.toLowerCase().trim();
  const cards = kanbanContainer.querySelectorAll('.kanban-item');

  // Get the logged-in username from localStorage
  const currentLoggedInUserUsername = localStorage.getItem('logged_username') || ""; // Default to empty if not found
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the beginning of the day for accurate comparisons

  cards.forEach(card => {
    // --- Keyword Filter --- 
    const titleElement = card.querySelector('span.kanban-text');
    const cardTitle = titleElement ? titleElement.textContent.toLowerCase() : '';
    const matchesKeyword = cardTitle.includes(keyword);

    // --- Member Filter --- 
    const ticketOwner = (card.dataset.ticketOwner || '').toLowerCase();
    const noMembersIsChecked = noMembersCheckbox && noMembersCheckbox.checked;
    const assignedToMeIsChecked = assignedToMeCheckbox && assignedToMeCheckbox.checked;
    let matchesMemberCriteria = !noMembersIsChecked && !assignedToMeIsChecked; // True if no member filters active
    if (assignedToMeIsChecked && (ticketOwner === currentLoggedInUserUsername.toLowerCase() || ticketOwner === 'team')) {
      matchesMemberCriteria = true;
    }
    if (noMembersIsChecked && (ticketOwner === '' || ticketOwner === null)) {
      matchesMemberCriteria = true;
    }
    if (noMembersIsChecked && assignedToMeIsChecked && matchesMemberCriteria) {
       
    } else if (noMembersIsChecked && assignedToMeIsChecked && !matchesMemberCriteria) {
       
    }


    // --- Due Date Filter --- 
   
    const dueDateString = card.dataset.dueDate;
    const cardDueDate = dueDateString ? new Date(dueDateString) : null;
    if (cardDueDate) cardDueDate.setHours(0,0,0,0); // Normalize for comparison

    let matchesDueDateCriteria = true; // Assume true if no due date filters are active
    const activeDueDateFilters = [noDatesCheckbox, overdueCheckbox, dueTomorrowCheckbox, dueWeekCheckbox, dueMonthCheckbox].filter(cb => cb && cb.checked);

    if (activeDueDateFilters.length > 0) {
      matchesDueDateCriteria = false; 
      if (noDatesCheckbox && noDatesCheckbox.checked && !cardDueDate) {
        matchesDueDateCriteria = true;
      }
      if (cardDueDate) {
        if (overdueCheckbox && overdueCheckbox.checked && cardDueDate < today) {
          matchesDueDateCriteria = true;
        }
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        if (dueTomorrowCheckbox && dueTomorrowCheckbox.checked && cardDueDate.getTime() === tomorrow.getTime()) {
          matchesDueDateCriteria = true;
        }
        const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);
        if (dueWeekCheckbox && dueWeekCheckbox.checked && cardDueDate >= today && cardDueDate <= nextWeek) {
          matchesDueDateCriteria = true;
        }
        const nextMonth = new Date(today); nextMonth.setMonth(today.getMonth() + 1);
        if (dueMonthCheckbox && dueMonthCheckbox.checked && cardDueDate >= today && cardDueDate <= nextMonth) {
          matchesDueDateCriteria = true;
        }
      }
    }
    
    // --- Activity Filter ---
   
    const updatedAtString = card.dataset.updatedAt;
    const cardUpdatedAt = updatedAtString ? new Date(updatedAtString) : null;

    let matchesActivityCriteria = true; // Assume true if no activity filters are active
    const activeActivityFilters = [activeLastWeekCheckbox, activeLast2WeeksCheckbox, activeLast4WeeksCheckbox, inactiveCheckbox].filter(cb => cb && cb.checked);

    if(activeActivityFilters.length > 0) {
        matchesActivityCriteria = false; // Must match at least one active activity filter
        const fourWeeksAgo = new Date(today); fourWeeksAgo.setDate(today.getDate() - 28);

        if (cardUpdatedAt) {
            const oneWeekAgo = new Date(today); oneWeekAgo.setDate(today.getDate() - 7);
            const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(today.getDate() - 14);

            if (activeLastWeekCheckbox && activeLastWeekCheckbox.checked && cardUpdatedAt >= oneWeekAgo && cardUpdatedAt <= new Date()) {
                matchesActivityCriteria = true;
            }
            if (activeLast2WeeksCheckbox && activeLast2WeeksCheckbox.checked && cardUpdatedAt >= twoWeeksAgo && cardUpdatedAt <= new Date()) {
                matchesActivityCriteria = true;
            }
            if (activeLast4WeeksCheckbox && activeLast4WeeksCheckbox.checked && cardUpdatedAt >= fourWeeksAgo && cardUpdatedAt <= new Date()) {
                matchesActivityCriteria = true;
            }
        }
        // "Without activity in the last four weeks"
        if (inactiveCheckbox && inactiveCheckbox.checked && (!cardUpdatedAt || cardUpdatedAt < fourWeeksAgo)) {
            matchesActivityCriteria = true;
        }
    }

   
    if (matchesKeyword && matchesMemberCriteria && matchesDueDateCriteria && matchesActivityCriteria) {
      card.style.display = ''; // Show card
    } else {
      card.style.display = 'none'; // Hide card
    }
  });
}
