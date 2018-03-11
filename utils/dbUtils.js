import mongoose from "mongoose";
import sharp from "sharp";

import config from '../../slavik-site/src/etc/config.json';

import '../models/image';
const Image = mongoose.model('image');

import '../models/token';
const Token = mongoose.model('token');

export function setUpConnection() {
    mongoose.Promise = global.Promise;
    mongoose
        .connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {useMongoClient: true})
        .catch(e => console.log(e.name + ': ' + e.message));
    return mongoose;
}

export function listImages() {
    return Image.find({}, {
        _id: 0,
        title: 1
    });
}

export async function getImage(name) {
    return Image
        .find({title: name})
        .select({_id: 0, image: 1});
}

export async function getMinimizedImage(name) {
    let buff = await Image
        .find({title: name})
        .select({_id: 0, image: 1});
    return sharp(buff[0].image)
        .resize(null, 200)
        .toBuffer();
}

export async function createImage(data) {
    const name = Math
        .random()
        .toString(33)
        .substring(6) + data.originalname;
    let header = "Image name";
    let desc = "Image description";

    const note = new Image({
        title: name,
        header: header,
        desc: desc,
        type: data.mimetype,
        image: data.buffer,
        size: data.size
    });
    await note.save();
    return name;
}

export async function deleteImage(name) {
    return await Image.deleteOne({title: name});
}

export async function updateImageDesc(name, header, desc) {
    return Image.update({
        title: name
    }, {
        $set: {
            header: header,
            desc: desc
        }
    });
}

export function getImageDesc(img) {
    return Image
        .find({title: img})
        .select({_id: 0, header: 1, desc: 1});
}

export function addTocken(token, cb) {
    const tok = new Token({token: token});
    tok.save(cb);
}

export async function isTocken(token) {
    const tok = await Token.find({token: token});
    if (tok == false) 
        return false;
    
    return true;
}

export async function deleteToken(token, res) {
    const result = await Token.deleteOne({token: token});
    if (result.result.ok !== 1) 
        res.send({error: true});
    else 
        res.send({error: false});
    }