export function initializeTabManager() {
  const menuLinks = document.querySelectorAll('[data-automation-type]');
  const contentSections = document.querySelectorAll('.content-section');

  // Function to update active state
  function updateActiveState(activeType) {
    // Update menu links
    menuLinks.forEach(link => {
      const type = link.dataset.automationType;
      if (type === activeType) {
        link.classList.add('bg-primary', 'text-white');
      } else {
        link.classList.remove('bg-primary', 'text-white');
      }
    });

    // Update content sections
    contentSections.forEach(section => {
      if (section.dataset.contentType === activeType) {
        section.classList.remove('d-none');
      } else {
        section.classList.add('d-none');
      }
    });
  }

  // Add click event listeners to menu links
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = e.currentTarget.dataset.automationType;
      updateActiveState(type);
    });
  });

  // Initialize with first tab active
  if (menuLinks.length > 0) {
    const firstType = menuLinks[0].dataset.automationType;
    updateActiveState(firstType);
  }
}

// Export for use in other files
window.initializeTabManager = initializeTabManager; 