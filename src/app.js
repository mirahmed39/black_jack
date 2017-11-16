const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const publicPath = path.resolve(__dirname, 'public');

const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
};
app.use(session(sessionOptions));
app.use(cookieParser());
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(process.env.PORT || 3000);