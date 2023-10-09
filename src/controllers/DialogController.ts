import express from 'express';
import { DialogModel } from '../models';

class DialogController{
    async index(req: express.Request, res: express.Response){
        const authorId = req.params.id;
        try{
            const dialogs = await DialogModel.find({ author: authorId }).populate(['author', 'partner']).exec();
            res.json(dialogs);
        } catch{
            return res.status(404).json({
                messages: "Dialog not found."
            });
        }
    }

    create(req: express.Request, res: express.Response) {
        const postData = {
            author: req.body.author,
            partner: req.body.partner,
        };
        const user = new DialogModel(postData);
        user
            .save()
            .then(obj => {
                res.json(obj);
            })
            .catch(reason => {
                res.json(reason);
            });
    }
}

export default DialogController;
