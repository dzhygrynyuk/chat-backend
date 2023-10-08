import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";

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
        last_seen: Date,
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);

export default User;