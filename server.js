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
      // Ensure the directory exists before writing the file
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  
      await fs.promises.writeFile(filePath, JSON.stringify(crossedItems, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving data to file:', err);
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
    crossedItems = JSON.parse(data);
  } catch (err) {
    // Ignore errors if the file doesn't exist or is invalid
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
loadDataFromFile().then(() => {
  // Start the server after loading data
  app.listen(process.env.PORT || 3000, () => console.log('Listening on port 3000'));
});
