// Get the list element
var list = document.getElementById('list');

// Add click event listener to the list
list.addEventListener('click', function (event) {
    // Check if the clicked element is an <li> inside the list
    if (event.target.tagName === 'LI') {
        // Toggle the 'crossed' class on the clicked element
        event.target.classList.toggle('crossed');

        // Save the updated list state (crossed items) to local storage
        saveListState();
    }
});

// Function to save the list state to local storage
function saveListState() {
    // Get all crossed items
    var crossedItems = document.querySelectorAll('.crossed');
    
    // Create an array to store the crossed item names
    var crossedNames = [];

    // Iterate through crossed items and add their text content to the array
    crossedItems.forEach(function (item) {
        crossedNames.push(item.textContent);
    });

    // Convert the array to a JSON string and save it to local storage
    localStorage.setItem('crossedNames', JSON.stringify(crossedNames));
}

// Function to load the list state from local storage
function loadListState() {
    // Get the crossed item names from local storage
    var crossedNames = localStorage.getItem('crossedNames');

    // If there are crossed names, iterate through them and cross out the corresponding items in the list
    if (crossedNames) {
        crossedNames = JSON.parse(crossedNames);
        crossedNames.forEach(function (name) {
            var crossedItem = document.querySelector('.list li:contains("' + name + '")');
            if (crossedItem) {
                crossedItem.classList.add('crossed');
            }
        });
    }
}

// Call the loadListState function when the page is loaded to restore the state
window.addEventListener('load', loadListState);
