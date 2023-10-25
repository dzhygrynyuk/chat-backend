import express from 'express';
import { DialogModel, MessageModel } from '../models';

class DialogController{
    async index(req: any, res: express.Response){
        const authorId = req.user._id;
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
        const dialog = new DialogModel(postData);
        dialog
            .save()
            .then(dialogObj => {
                const message = new MessageModel({
                    text: req.body.text,
                    dialog: dialogObj._id,
                    user: req.body.author
                });
                message
                    .save()
                    .then(() => {
                        res.json(dialogObj);
                    })
                    .catch(reason => {
                        res.json(reason);
                    });

            })
            .catch(reason => {
                res.json(reason);
            });
    }

    delete(req: express.Request, res: express.Response) {
        const id = req.params.id;
        DialogModel.findOneAndRemove({ _id: id })
            .then(dialog => {
                if(dialog){
                    res.json({
                        messages: `Dialog deleted.`
                    });
                }
            }).catch(err => {
                return res.status(404).json({
                    messages: "Dialog not found."
                });
            });
    }
}

export default DialogController;
