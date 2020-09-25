const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const cors = require('cors');
const { request, response } = require("express");
const { user } = require("firebase-functions/lib/providers/auth");
 
admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(cors({ origin: ['http://localhost:5000', 'https://fir-demo-44618.firebaseapp.com'] }));


// Hämta användare med GET anrop
app.get('/:id', async (request, response) => {
  const userCollection = db.collection('users');
  const result = await db.userCollection.doc(request.params.id).get();

  const id = result.id;
  const user = result.data(); 

  response.status(200).send({ id, ...user });
});


app.get('/', async(request, response) => {
  const userCollection = db.collection('users');
  const result = await userCollection.get();

  let users = [];
  result.forEach((userDoc) => {

    const id = userDoc.id;
    const data = userDoc.data();
    users.push({id, ...data });
  })
  response.status(200).send(users);
});

app.put('/:id', async (request, response) => {
  const userCollection = db.collection('users');
  const result = await userCollection.doc(request.params.id).update(request.body);

  response.status(200).send(result); 

})  

// Skapa en användare med POST
app.post('/', async function (request, response) {
   const newUser = JSON.parse(request.body);
   const userCollection = db.collection('users');
   const result = await userCollection.add(newUser);

   response.status(200).send(result);
});

app.delete('/:id', async function (request, response) {
  const userId = request.params.id;
  const userCollection = db.collection('users');
  const result = await userCollection.doc(userId).delete();

  response.status(200).send(result);
});
 
exports.users = functions.https.onRequest(app);

