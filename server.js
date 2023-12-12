const express = require('express');
const { readFile } = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));

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

app.listen(process.env.PORT || 3000, () => console.log('listening on port 3000'));