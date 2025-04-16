export function sortKanbanItems(elementId, key, isAscMap) {
    const container = document.getElementById(elementId);
    if (!container) {
      console.error(`Container '${elementId}' not found`);
      return;
    }
  
    const items = Array.from(container.getElementsByClassName("kanban-item"));
    if (items.length === 0) {
      console.warn(`No items to sort in '${elementId}'`);
      return;
    }
  
    console.log(`Sorting '${elementId}' by '${key}'`);
    console.log("Before sort:", items.map(i => ({
      text: i.querySelector(".kanban-text")?.innerText,
      date: i.dataset.createdAt
    })));
  
    if (isAscMap[elementId] === undefined) {
      isAscMap[elementId] = true;
    }
  
    items.sort((a, b) => {
      if (key === "name") {
        const nameA = a.querySelector(".kanban-text")?.innerText.toLowerCase() || "";
        const nameB = b.querySelector(".kanban-text")?.innerText.toLowerCase() || "";
        return isAscMap[elementId]
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else if (key === "date") {
        const dateA = new Date(a.dataset.createdAt || 0);
        const dateB = new Date(b.dataset.createdAt || 0);
        return isAscMap[elementId]
          ? dateA - dateB
          : dateB - dateA;
      }
      return 0;
    });
  
    console.log("After sort:", items.map(i => ({
      text: i.querySelector(".kanban-text")?.innerText,
      date: i.dataset.createdAt
    })));
  
    items.forEach(item => container.appendChild(item));
    isAscMap[elementId] = !isAscMap[elementId];
  }
  