import express from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import socket from "socket.io";

import { UserModel } from "../models";
import { createJWToken } from "../utils";

class UserController {
    io: socket.Server;

    constructor(io: socket.Server) {
        this.io = io;
    }

    async index(req: express.Request, res: express.Response) {
        const id = req.params.id;
        try {
            const user = await UserModel.findById(id);
            res.json(user);
        } catch (err) {
            return res.status(404).json({
                messages: "User not found."
            });
        }
    }

    async getMe(req:any, res: express.Response) {
        const id = req.user._id;
        try {
            const user = await UserModel.findById(id);
            res.json(user);
        } catch (err) {
            return res.status(404).json({
                messages: "User not found."
            });
        }
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            fullname: req.body.fullname,
            password: req.body.password
        };
        const user = new UserModel(postData);
        user
            .save()
            .then(obj => {
                res.json(obj);
            })
            .catch(reason => {
                res.json(reason);
            });
    }

    delete(req: express.Request, res: express.Response) {
        const id = req.params.id;
        UserModel.findOneAndRemove({ _id: id })
            .then(user => {
                if(user){
                    res.json({
                        messages: `User ${user.fullname} deleted.`
                    });
                }
            }).catch(err => {
                return res.status(404).json({
                    messages: "User not found."
                });
            });
    }

    async login(req: express.Request, res: express.Response) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        };

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const user: any = await UserModel.findOne({ email: postData.email });
            if (user){
                if (bcrypt.compareSync(postData.password, user.password)) {
                    const token = createJWToken(user);
                    const { password, ...userData } = user._doc;
                    res.json({
                        status: "success",
                        token,
                        userData
                    });
                } else {
                    res.status(404).json({
                        status: "error",
                        message: "Incorrect password or email"
                    });
                }
            } else {
                res.status(404).json({
                    status: "error",
                    message: "User not found."
                });
            }
        } catch (error) {
            return res.status(404).json({
                messages: "User not found."
            });
        }
    }
}

export default UserController;