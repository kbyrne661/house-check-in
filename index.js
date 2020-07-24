require('dotenv').config()
const express = require('express')
const request = require('request')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'))
app.use(express.static('public'))

app.get('/', (req, res) => {
    const data = {
        commonGuests: 10,
        totalGuests: 20
    }
    res.render('pages/index', data);
});

app.get('/check-in', (req, res) => {
    res.render('pages/check-in');
});

app.get('/check-out', (req, res) => {
    res.render('pages/check-out');
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))