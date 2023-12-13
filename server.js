const express = require('express');
const { readFile } = require('fs');
const bodyParser = require('body-parser');
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
   })
   .delete((req, res) => {
    crossedItems = []; // Clear crossed items
    res.json(crossedItems);
    });

app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));