import express from 'express';
import { UserModel } from '../models';

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await UserModel.findOneAndUpdate( { _id: "6522ca2535354e9565a022d0" }, { $set: { last_seen: new Date() }} );
    next();
};