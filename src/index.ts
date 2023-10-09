import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import { UserController, DialogController } from "./controllers";

const app = express();
app.use(bodyParser.json());

const User = new UserController();
const Dialog = new DialogController();

mongoose
    .connect('mongodb+srv://dzhygrynyuk:QWVU2HHgWj5Ix8Xa@cluster0.j0r0tt8.mongodb.net/chat?retryWrites=true&w=majority')
    .then(() => console.log('Success connected!!!'))
    .catch((err) => console.log('DB error', err));

app.get('/user/:id', User.index);
app.delete('/user/:id', User.delete);
app.post('/user/registration', User.create);

app.get('/dialogs/:id', Dialog.index);
app.post('/dialogs', Dialog.create);
  
app.listen(3333, () => {
    console.log(`Example app listening on port 3333`)
});