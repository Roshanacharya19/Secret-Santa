// Load crossed items from the server on page load
document.addEventListener('DOMContentLoaded', function () {
  loadCrossedItems();
});

document.getElementById('secretSantaForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  // Get selected person from the form
  var selectedPerson = document.getElementById('person').value;

  // Toggle the "crossed" class for the matching item
  var santaListItems = document.querySelectorAll('#santaList li');
  for (var i = 0; i < santaListItems.length; i++) {
      if (santaListItems[i].textContent.trim() === selectedPerson) {
          santaListItems[i].classList.toggle('crossed');

          // Update crossed items on the server
          updateCrossedItems(selectedPerson);
          break;
      }
  }
});

document.getElementById('clearCrossed').addEventListener('click', function () {
  // Clear crossed items on the server
  clearCrossedItems();

  // Clear the "crossed" class from all list items
  var santaListItems = document.querySelectorAll('#santaList li');
  santaListItems.forEach(function (item) {
      item.classList.remove('crossed');
  });
});

// Helper function to update crossed items on the server
function updateCrossedItems(item) {
  fetch('/api/crossed-items', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item: item })
  })
  .then(response => response.json())
  .then(crossedItems => console.log('Crossed items:', crossedItems))
  .catch(error => console.error('Error updating crossed items:', error));
}

// Helper function to load crossed items from the server
function loadCrossedItems() {
  fetch('/api/crossed-items')
  .then(response => response.json())
  .then(crossedItems => applyCrossedItems(crossedItems))
  .catch(error => console.error('Error loading crossed items:', error));
}

// Helper function to apply crossed items to the list
function applyCrossedItems(crossedItems) {
  var santaListItems = document.querySelectorAll('#santaList li');
  for (var i = 0; i < santaListItems.length; i++) {
      if (crossedItems.includes(santaListItems[i].textContent.trim())) {
          santaListItems[i].classList.add('crossed');
      }
  }
}

// Helper function to clear crossed items on the server
function clearCrossedItems() {
  fetch('/api/crossed-items/clear', {
      method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
      console.log('Server response:', data);

      if (data.success) {
          console.log(data.message);
          // Optionally, you can update the UI to reflect the cleared items
          // For example, remove the 'crossed' class from the list items
          var santaListItems = document.querySelectorAll('#santaList li');
          santaListItems.forEach(function (item) {
              item.classList.remove('crossed');
          });
      } else {
          console.error(data.message);
      }
  })
  .catch(error => console.error('Error clearing crossed items:', error));
}