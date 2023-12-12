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
// Sync crossed-out items across devices using a backend service
// Please note: You'll need to implement API endpoints to handle these requests

// Function to update the server with the latest crossed-out items
function updateCrossedOutItemsOnServer(crossedOutItems) {
  fetch('/updateCrossedOutItems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ crossedOutItems }),
  })
  .then(response => response.json())
  .then(data => {
    if (!data.success) {
      console.error('Failed to update items on the server.');
    }
  })
  .catch(error => {
    console.error('Error updating crossed-out items:', error);
  });
}

// Function to get the crossed-out items from the server when the page loads
function getCrossedOutItemsFromServer() {
  fetch('/getCrossedOutItems')
    .then(response => response.json())
    .then(data => {
      if (data.crossedOutItems) {
        data.crossedOutItems.forEach((text) => {
          const listItem = Array.from(listItems).find((item) => item.textContent === text);
          if (listItem) {
            listItem.classList.add('crossed');
          }
        });
      }
    })
    .catch(error => {
      console.error('Error fetching crossed-out items:', error);
    });
}

// Call the function to sync crossed-out items on page load
window.addEventListener('DOMContentLoaded', () => {
  getCrossedOutItemsFromServer();
});
