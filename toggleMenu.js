document.addEventListener('DOMContentLoaded', () => {
  // Get the hamburger button and left section elements
  const hamburgerButton = document.getElementById('hamburger');
  const leftSection = document.querySelector('.left-section');
  const rightSectionIndex = document.querySelector('.right-section-index');
  const rightSection = document.querySelector('.right-section');

  // Determine which right section to use
  const rightSectionToUse = rightSectionIndex || rightSection;

  // Add an event listener to the hamburger button
  hamburgerButton.addEventListener('click', () => {
      // Toggle the collapsed class on the left section
      leftSection.classList.toggle('collapsed');
      
      // Toggle the expanded class on the right section
      rightSectionToUse.classList.toggle('expanded');
  });
});