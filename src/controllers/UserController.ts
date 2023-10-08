import express from "express";
import { UserModel } from "../models";

class UserController {
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
}

export default UserController;