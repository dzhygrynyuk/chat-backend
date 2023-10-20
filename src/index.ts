import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import { UserController, DialogController, MessageController } from "./controllers";
import { updateLastSeen, checkAuth } from "./middlewares";
import { loginValidation } from './utils/validations';

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(updateLastSeen);
app.use(checkAuth);

const User = new UserController();
const Dialog = new DialogController();
const Message = new MessageController();

mongoose
    .connect('mongodb+srv://dzhygrynyuk:QWVU2HHgWj5Ix8Xa@cluster0.j0r0tt8.mongodb.net/chat?retryWrites=true&w=majority')
    .then(() => console.log('Success connected!!!'))
    .catch((err) => console.log('DB error', err));

app.get('/user/:id', User.index);
app.delete('/user/:id', User.delete);
app.post('/user/registration', User.create);
app.post("/user/login", loginValidation, User.login);

app.get('/dialogs', Dialog.index);
app.delete('/dialogs/:id', Dialog.delete);
app.post('/dialogs', Dialog.create);

app.get('/messages', Message.index);
app.delete('/messages/:id', Message.delete);
app.post('/messages', Message.create);
  
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
});