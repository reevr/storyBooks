const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const auth = require('./routes/auth');

const app = express();

// Passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('/', (req, res) => {
    res.send('working'); 
});

// Routers
app.use('/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port : ${port}`);
});