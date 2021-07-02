const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sioj4.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const userCollection = client.db("tailwind-landing").collection("users");

    console.log('MongoErr', err);

    // Add User
    app.post("/addUser", (req, res) => {
        const user = req.body;
        userCollection.insertOne(user)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })

    //Check Email
    app.post('/checkEmail', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        userCollection.find({ email: email })
            .toArray((err, user) => {
                const isUser = user[0]
                console.log(isUser);
                if (isUser.email === email && isUser.password === password) {
                    res.send(isUser);
                } else {
                    res.send({})
                }
                console.log(err);
            })
    })

    app.get('/', function (req, res) {
        res.send('hello world')
    });


})
app.listen(process.env.PORT || 5000);
