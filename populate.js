const admin = require('firebase-admin');
const csv = require('csv-parser');
const fs = require('fs');
const serviceAccount = require('./house-check-in-firebase-adminsdk-47eql-4a82ecca03.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://house-check-in.firebaseio.com"
});
const db = admin.firestore();
const batch = db.batch()

fs.createReadStream('pledges.csv')
  .pipe(csv())
  .on('data', (row) => {
    const ref = db.collection('brothers').doc();
    batch.set(ref, row);
  })
  .on('end', () => {
    batch.commit()
  });