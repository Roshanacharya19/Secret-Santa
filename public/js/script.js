// Get all the list items
const listItems = document.querySelectorAll('li');

// Add click event listener to each list item
listItems.forEach((listItem) => {
  listItem.addEventListener('click', () => {
    // Toggle the 'crossed' class on the clicked list item
    listItem.classList.toggle('crossed');

    // Store the crossed-out state in localStorage
    const crossedOutItems = Array.from(listItems).filter((item) => item.classList.contains('crossed'));
    localStorage.setItem('crossedOutItems', JSON.stringify(crossedOutItems.map((item) => item.textContent)));
  });
});

// Retrieve crossed-out items from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const storedCrossedOutItems = localStorage.getItem('crossedOutItems');
  if (storedCrossedOutItems) {
    const crossedOutItems = JSON.parse(storedCrossedOutItems);
    crossedOutItems.forEach((text) => {
      const listItem = Array.from(listItems).find((item) => item.textContent === text);
      if (listItem) {
        listItem.classList.add('crossed');
      }
    });
  }
});
// Sync crossed-out state between tabs/windows
window.addEventListener('storage', (event) => {
  if (event.key === 'crossedOutItems') {
    const crossedOutItems = JSON.parse(event.newValue);
    listItems.forEach((listItem) => {
      listItem.classList.remove('crossed');
    });
    crossedOutItems.forEach((text) => {
      const listItem = Array.from(listItems).find((item) => item.textContent === text);
      if (listItem) {
        listItem.classList.add('crossed');
      }
    });
  }
});
