import express, { urlencoded } from 'express';
import expressLayouts from 'express-ejs-layouts';
import { connect } from 'mongoose';
import flash from 'connect-flash';
import session from 'express-session';
import path from 'path';
import passport from 'passport';
import passportConfig from './config/passport';
import routes from './routes/index';
import routesBins from './routes/bins';
import routesDashboard from './routes/dashboard';
import routesPayment from './routes/payment';
import routesRequests from './routes/requests';
import routesUsers from './routes/users';

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
app.use('/wp-content', express.static(__dirname + '/static/wp-content'));
app.use('/wp-includes', express.static(__dirname + '/static/wp-includes'));
app.use('/posts', express.static(__dirname + '/static/posts'));
app.use('/blog', express.static(__dirname + '/static/blog.html'));
app.use('/contato', express.static(__dirname + '/static/contato.html'));
app.use('/e-lixo', express.static(__dirname + '/static/e-lixo.html'));
app.use('/parceiros', express.static(__dirname + '/static/parceiros.html'));
app.use('/blog/', express.static(__dirname + '/static/blog.html'));
app.use('/contato/', express.static(__dirname + '/static/contato.html'));
app.use('/e-lixo/', express.static(__dirname + '/static/e-lixo.html'));
app.use('/parceiros/', express.static(__dirname + '/static/parceiros.html'));
app.use('/blog.html', express.static(__dirname + '/static/blog.html'));
app.use('/contato.html', express.static(__dirname + '/static/contato.html'));
app.use('/e-lixo.html', express.static(__dirname + '/static/e-lixo.html'));
app.use('/parceiros.html', express.static(__dirname + '/static/parceiros.html'));

app.use('/app', routes);
app.use('/app/bins', routesBins);
app.use('/app/dashboard', routesDashboard);
app.use('/app/dashboard/requests', routesRequests);
app.use('/app/payment', routesPayment);
app.use('/app/users', routesUsers);
app.use('/users', routesUsers);

app.use('/app/css', express.static(__dirname + '/dist/css'));
app.use('/app/favicon', express.static(__dirname + '/assets/favicon'));
app.use('/app/fonts', express.static(__dirname + '/assets/fonts'));
app.use('/app/js', express.static(__dirname + '/assets/js'));
app.use('/app/icons', express.static(__dirname + '/assets/icons'));
app.use('/app/img', express.static(__dirname + '/assets/img'));
app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/js', express.static(__dirname + '/assets/js'));
app.use('/favicon', express.static(__dirname + '/assets/favicon'));
app.use('/fonts', express.static(__dirname + '/assets/fonts'));
app.use('/icons', express.static(__dirname + '/assets/icons'));
app.use('/img', express.static(__dirname + '/assets/img'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));