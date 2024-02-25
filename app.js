const dotEnv = require('dotenv');
dotEnv.config();

const express = require('express');
const path = require("path");
const expressLayout = require('express-ejs-layouts');

const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Method Override
app.use(methodOverride('_method'));

//Static files
app.use(express.static('public'));

//Express Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

//Flash Message
app.use(flash({ sessionKeyName: 'flashMessage' }));

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Set the 'views' directory to the 'views' folder (explicit but not required for default behavior)
app.set('views', path.join(__dirname, 'views'));

//Database
const connectDB = require('./server/config/db.js');
connectDB();

//GET Routes
const customer = require('./server/routes/customer.js');
app.use('/', customer);
// app.use('/', require('./server/routes/customer.js'));
app.use('/add', customer);
app.use('/view', customer);

//Home
// app.get('/', (req, res) => {
//     const locals = {
//         title: "NodeJS",
//         description: "NodeJs User Application",
//     };
//     res.render('index', locals);
// });

//Handle 404
app.get('*', (req, res) => {
    res.status(404).render("404");
});

const port = 5000 || process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});