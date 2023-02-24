const express = require('express');
const control = require('../controllers/masterController')

module.exports = {
    Route: (app) => {
        
        app.use(control.parseCookie);
        router = express.Router();
        router.get('/json/', control.getInformation)
        router.get('/cast/', control.getCast)
        router.get('/search/', control.getSearch)
        router.get('/searchcast/', control.getSearchCast)
        router.get('/', control.getHome)
        router.get('/home', control.getHome)
        router.get('/login', control.checkSession,control.getlogin)
        router.get('/page', control.getPage)
        router.get('/signup', control.checkSession,control.getlogup)
        router.post('/login', control.checkSession,control.checkLogin)
        router.post('/signup', control.checkSession,control.checkLogup)

        app.use(router);
        app.use((req, res,next) => {
            let check = req.session.username;
            if (check) {
                next();
            } else {
                res.redirect('/')
            }
        })

        router = express.Router();
        router.get('/welcome', control.getWelcome)
        router.get('/logout', control.getlogout)
        router.get('/json/', control.getJSON)

        app.use(router);
        
    }
}