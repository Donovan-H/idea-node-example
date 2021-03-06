require('dotenv').config();

const express = require('express');
const session = require('express-session');

const app = new express;

const index = require('./routes')
const callback = require('./routes/callback')
const logout = require('./routes/logout')

const api = require('./routes/api')
const api_user = require('./routes/api/user');
const api_progress = require('./routes/api/progress');
const api_result = require('./routes/api/result');

app.listen(process.env.PORT, () => console.log('listening on ', process.env.PORT));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

app.use('/', index);
app.use('/callback', callback);
app.use('/logout', logout);

app.use('/api/user', api, api_user);
app.use('/api/progress', api, api_progress);
app.use('/api/result', api, api_result);

