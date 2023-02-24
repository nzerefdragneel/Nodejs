const express = require('express');
const exphdbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session')

const cookieParser = require('cookie-parser')
module.exports={
    Engine: (app) => {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(bodyParser.raw());

        app.use(express.static('./public'));
        app.engine('hbs', exphdbs.engine({
            defaultLayout: 'main.hbs',
            layoutsDir: './views/layouts', ///Same as default
            //{
                ///Function fuct_ here, match {{fuct_}} in hbs
            //},


        }));
        app.set('view engine', 'hbs');
        app.set('views', './views');
        secret='bakamitai'
        app.use(cookieParser(secret));
        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 60 * 1000*30} ///a session will destroy after 30'
            // cookie: { secure: true }
        }))
    }
}