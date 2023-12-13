const express = require('express');
const { readFile } = require('fs');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/hello', (req, res) => {
    
})

app.get('/', (req, res) => {
    readFile('./index.html', 'utf8', (err, html) => {
        if (err) {
            res.status(500).send('sorry, out of order');
        }
        res.send(html);
    })
    
});

// Store crossed-out items in-memory on the server
let crossedItems = [];
const correctPassword = 'abcd1234z';
const basicAuthMiddleware = basicAuth({
    users: { 'admin': correctPassword }, // Use any username, but ensure the correct password is set
    challenge: true,
    unauthorizedResponse: 'Unauthorized'
});
app.use(express.json());
// API endpoint to get and update crossed-out items
app.route('/api/crossed-items')
   .get((req, res) => {
      res.json(crossedItems);
   })
   .post((req, res) => {
      const { item } = req.body;
      if (item && !crossedItems.includes(item)) {
         crossedItems.push(item);
      }
      res.json(crossedItems);
   });
app.post('/api/crossed-items/clear', basicAuthMiddleware, (req, res) => {
    crossedItems = []; // Clear crossed items
    res.json({ success: true, message: 'Crossed items cleared' });
});
app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));