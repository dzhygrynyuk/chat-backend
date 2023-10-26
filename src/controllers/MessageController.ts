import express from 'express';
import socket from "socket.io";

import { MessageModel } from '../models';

class MessageController{
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    async index(req: express.Request, res: express.Response){
        const dialogId = req.query.dialog;
        try{
            const messages = await MessageModel.find({ dialog: dialogId }).populate(['dialog']).exec();
            res.json(messages);
        } catch{
            return res.status(404).json({
                messages: "Messages not found."
            });
        }
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            text: req.body.text,
            dialog: req.body.dialog_id,
            user: req.body.user_id,
        };
        const message = new MessageModel(postData);
        message
            .save()
            .then(obj => {
                obj.populate("dialog", (err: any, message: any) => {
                    if (err) {
                        return res.status(500).json({
                            message: err
                        });
                    }
                    res.json(message);
                    this.io.emit("SERVER:NEW_MESSAGE", message);
                });
            })
            .catch(reason => {
                res.json(reason);
            });
    }

    delete(req: express.Request, res: express.Response) {
        const id = req.params.id;
        MessageModel.findOneAndRemove({ _id: id })
            .then(message => {
                if(message){
                    res.json({
                        messages: `Message deleted.`
                    });
                }
            }).catch(err => {
                return res.status(404).json({
                    messages: "Message not found."
                });
            });
    }
}

export default MessageController;