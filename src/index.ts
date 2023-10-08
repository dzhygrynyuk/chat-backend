import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import User from "./models/User";

const app = express();
app.use(bodyParser.json());

mongoose
    .connect('mongodb+srv://dzhygrynyuk:QWVU2HHgWj5Ix8Xa@cluster0.j0r0tt8.mongodb.net/chat?retryWrites=true&w=majority')
    .then(() => console.log('Success connected!!!'))
    .catch((err) => console.log('DB error', err));

app.post('/create', (req, res) => {
    const postData = {
        email: req.body.email,
        fullname: req.body.fullname,
        password: req.body.password
    };
    const user = new User(postData);
    user
        .save()
        .then(obj => {
            res.json(obj);
        })
        .catch(reason => {
            res.json(reason);
        });
});
  
app.listen(3333, () => {
    console.log(`Example app listening on port 3333`)
});