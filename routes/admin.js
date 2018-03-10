import express from 'express';
var router = express.Router();
import randToken from 'rand-token';

import * as db from '../utils/dbUtils';

import admin from '../utils/admin_utils.json';
import {deleteToken} from '../utils/dbUtils';

router.post('/login', (req, res) => {
    //console.log(admin.login + ' ' + admin.password)
    let result = {
        token: null,
        error: null
    };
    if (req.body.login === admin.login && req.body.password === admin.password) {
        result.token = randToken.generate(32);
        db.addTocken(result.token);
    }
    else 
        result.error = 'Видимо, ты не админ, что поделать';
    
    res.send(result);
});

router.post('/logout', (req, res) => {
    deleteToken(req.body.token, res);
});

export default router; 