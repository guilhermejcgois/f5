import express, { urlencoded } from 'express';
import expressLayouts from 'express-ejs-layouts';
import { connect } from 'mongoose';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import passportConfig from './config/passport';

const app = express();

// Passport config
passportConfig(passport);

// DB Config
import dbConfig from './config/keys';

// Connect to Mongo
connect(dbConfig.uri, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected... YAS'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(urlencoded({ extended: false }));

// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index').default);
app.use('/users', require('./routes/users').default);

app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/fonts', express.static(__dirname + '/assets/fonts'));
app.use('/icons', express.static(__dirname + '/assets/icons'));
app.use('/img', express.static(__dirname + '/assets/img'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));