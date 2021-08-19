const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://antasofa:CQU6uVKyr0G5idgl@cluster0.tt0ro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
// const router = express.Router();
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/v1/auth', authRoutes);
app.use('/v1/blog', blogRoutes);

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    })
})

mongoose.connect('mongodb+srv://antasofa:CQU6uVKyr0G5idgl@cluster0.tt0ro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    app.listen(4000, () => console.log('Connection success'));
})
.catch(err => console.log(err))
