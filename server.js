const express = require('express');
const { readFile, writeFile } = require('fs').promises; // Using promises for async file operations
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  try {
    const html = await readFile('./index.html', 'utf8');
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sorry, out of order');
  }
});

// Store crossed-out items in a file on the server
const filePath = path.join('public', 'json', '/crossedItems.json');
async function saveDataToFile() {
    try {
      // Convert the crossedItems array to a JSON string
      const jsonData = JSON.stringify(crossedItems, null, 2);
  
      // Write the JSON data to the file
      await fs.writeFile(filePath, jsonData, 'utf8');
  
      console.log('Data saved to file successfully.');
    } catch (error) {
      console.error('Error saving data to file:', error);
    }
  }
let crossedItems = [];

const correctPassword = 'abcd1234z';
const basicAuthMiddleware = basicAuth({
  users: { 'admin': correctPassword },
  challenge: true,
  unauthorizedResponse: 'Unauthorized'
});

// API endpoint to get and update crossed-out items
app.route('/api/crossed-items')
  .get(async (req, res) => {
    res.json(crossedItems);
  })
  .post(async (req, res) => {
    const { item } = req.body;
    if (item && !crossedItems.includes(item)) {
      crossedItems.push(item);
      await saveDataToFile();
    }
    res.json(crossedItems);
  });

// API endpoint to clear crossed-out items
app.post('/api/crossed-items/clear', basicAuthMiddleware, async (req, res) => {
  crossedItems = [];
  await saveDataToFile();
  res.json({ success: true, message: 'Crossed items cleared' });
});

// Load data from the file on server start
async function loadDataFromFile() {
    try {
      const data = await readFile(filePath, 'utf8');
      console.log('Loaded data:', data);
      crossedItems = JSON.parse(data);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }
  

// Save data to the file
async function saveDataToFile() {
  try {
    await writeFile(filePath, JSON.stringify(crossedItems, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving data to file:', err);
  }
}

// Load data from the file on server start
loadDataFromFile()
  .then(() => {
    console.log('Data loaded successfully.');
    // Start the server after loading data
    app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));
  })
  .catch(error => console.error('Error loading data:', error));

