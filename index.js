require('dotenv').config()
const express = require('express')
const admin = require('firebase-admin');
const path = require('path')
const app = express()
const bodyParser = require('body-parser');
const port = 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

const serviceAccount = require('./house-check-in-firebase-adminsdk-47eql-4a82ecca03.json');
const { exit } = require('process');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://house-check-in.firebaseio.com"
  });

const db = admin.firestore();

app.get('/', (req, res) => {
    const data = {
        brothers: []
    }
    db.collection('brothers').get().then(snapshot => {
        snapshot.forEach(documentSnapshot => {
            data.brothers.push(documentSnapshot.data())
        })
        data.brothers.sort((a, b) => { return a.last.localeCompare(b.last) })
        res.render('pages/index', data)
    })
});

app.post('/check-in', (req, res) => {
    const b_last = req.body.brother.split(', ')[0]
    const b_first = req.body.brother.split(', ')[1]
    db.collection('check-ins').add({
        b_last: b_last,
        b_first: b_first,
        g_last: null,
        g_first: null,
        timestamp: new admin.firestore.Timestamp(Math.floor(new Date().getTime() / 1000), 0)
    })
    if (req.body.guest1_first) {
        db.collection('check-ins').add({
            b_last: b_last,
            b_first: b_first,
            g_last: req.body.guest1_last,
            g_first: req.body.guest1_first,
            timestamp: new admin.firestore.Timestamp(Math.floor(new Date().getTime() / 1000), 0)
        })
    }
    if (req.body.guest2_first) {
        db.collection('check-ins').add({
            b_last: b_last,
            b_first: b_first,
            g_last: req.body.guest2_last,
            g_first: req.body.guest2_first,
            timestamp: new admin.firestore.Timestamp(Math.floor(new Date().getTime() / 1000), 0)
        })
    }
    res.render('pages/success')
})

app.get('/admin', (req, res) => {
    res.render('pages/admin')
})

app.get('/admin-restart', (req, res) => {
    exit()
})

app.listen(port, () => {
    console.log('Listening on port 3000')
})