import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";

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
        avatar: String,
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

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;