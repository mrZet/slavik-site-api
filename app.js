import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import {serverPort} from '../slavik-site/src/etc/config.json';

import * as db from './utils/dbUtils';

// ROUTES
import images from './routes/images';
import admin from './routes/admin';

// Initialization of express application
const app = express();

// Set up connection of database
const mongoose = db.setUpConnection();

// Using bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Allow requests from any origin
app.use(cors({origin: '*'}));

app.use('/images', images);
app.use('/admin', admin);

const server = app.listen(serverPort, function () {
    console.log(`Server is up and running on port ${serverPort}`);
});