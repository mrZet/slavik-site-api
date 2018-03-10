import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    token: {
        type: String
    }
});

mongoose.model('token', TokenSchema);