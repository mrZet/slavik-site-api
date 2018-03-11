import express from 'express';
var router = express.Router();
import multer from 'multer';

import * as db from '../utils/dbUtils';
import { deleteToken } from '../utils/dbUtils';

router.use(function timeLog(req, res, next) {
  //console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res) => {
	db.listImages().then(data => res.send(data));
});

router.get('/img/:name', (req, res) => {
    db.getImage(req.params.name)
	.then(data => {
			const buffer = data[0].image;
			
			return buffer.slice(0, buffer.length);
		})
	/*.then(data=>{
		console.log(data[0].image);
		return data[0];
	})*/
	.then(data => res.send(data))
	.catch(err => console.log("Getting Image error", err));
});

router.get('/min/:name', (req, res) => {
    db.getMinimizedImage(req.params.name)
	.then(data => {
			const buffer = data;
			return buffer.slice(0, buffer.length);
		})
	.then(data => res.send(data))
	.catch(err => console.log(err));
});

const storage = multer.memoryStorage();

const upload = multer({
	storage: storage
}).single('file');

router.post('/create/:token', (req, res) => {
	upload(req, res, function (err) {
        if (err)
			return console.log("Error creating image");
		console.log("TOKEN IS " + req.params.token);
		db.isTocken(req.params.token)
		.then((data) =>{
			if(data !== true){
				throw 'INCORRECT TOKEN MATHERFUKER';
			}
			return req.file
		})
		.then(db.createImage)
		.then((data)=>res.send(data))
		.catch((error)=>{
			console.log(error);
			res.send(error);
		})
    })
});

router.post('/meta', (req, res) =>{
	console.log("Meta body" + req.body);
	db.isTocken(req.body.token)
		.then((data) =>{
			if(data !== true){
				throw 'INCORRECT TOKEN MATHERFUKER';
			}
			return req.body.image
		})
		.then(name => db.updateImageDesc(name, req.body.header, req.body.desc))
		.then(()=>res.send('OK'))
		.catch((error)=>{
			console.log("error is" + error);
			res.send("error");
		});
})

router.get('/meta', (req, res) => {
	db.getImageDesc(req.query.image)
		.then(result => res.send({header: result[0].header, desc: result[0].desc}));
});

router.post('/delete', (req, res) => {
	db.isTocken(req.body.token)
		.then((data) =>{
			if(data !== true){
				throw 'INCORRECT TOKEN MATHERFUKER';
			}
			return req.body.image
		})
		.then(db.deleteImage)
		.then(()=>res.send('OK'))
		.catch((error)=>{
			console.log('kek'+error);
			res.send(error);
		})
	//db.deleteNote(req.params.name);
});

export default router;