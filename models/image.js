import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    title     : { type: String },
    header: { type: String },
    desc : { type: String },
    image      : { type: Buffer, required: true },
	type :{ type: String },
	size :{type: Number},
    createdAt : { type: Date, default: Date.now }
});

mongoose.model('image', ImageSchema);