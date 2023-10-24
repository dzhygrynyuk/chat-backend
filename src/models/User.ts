import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";
import { generatePasswordHash } from '../utils';

export interface IUser extends Document {
    email: string;
    fullname: string;
    password: string;
    confirmed: boolean;
    avatar?: string;
    confirm_hash?: string;
    last_seen?: Date;
}

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: "Email address is required",
            validate: [isEmail, "Invalid email"],
            unique: true
        },
        fullname: {
            type: String,
            required: "Fullname is required"
        },
        password: {
            type: String,
            required: "Password is required"
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        avatar: String,
        confirmed_hash: String,
        last_seen: {
            type: Date,
            default: new Date()
        },
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', function(next) {
    const user = this;
  
    if (!user.isModified('password')) return next();
  
    generatePasswordHash(user.password)
        .then(hash => {
            user.password = String(hash);
            next();
        })
        .catch(err => {
            next(err);
        });
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;