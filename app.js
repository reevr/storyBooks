const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

// Model Registration
require('./models/User');
require('./models/Story');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');
const keys = require('./config/keys');

// Handlebar helpers
const {
    truncate,
    stripTags,
    formatDate,
    checkStatus,
    isChecked,
    editIcon
} = require('./helpers/hbs');

// App initialisation
const app = express();

// Body parser 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Method Override 
app.use(methodOverride('_method'));

mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI)
.then(() => console.log('connected to MongoDB'))
.catch(err => console.log(err));

// Handlebar 
app.engine('handlebars', exphbs({
    helpers:{
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        checkStatus: checkStatus,
        isChecked: isChecked,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// // Passport config
require('./config/passport')(passport);

// Cookie , Session initialisation
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
// Passport initialize 
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port : ${port}`);
});