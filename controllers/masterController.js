const userConnection = require('../models/user')
const databaseConnection = require("../models/database")
const CryptoJS = require("crypto-js")
const hashLength = 10
const fs = require('fs');

let browerCookieLiveTime = 24*60 * 60 * 1000

module.exports = {
    parseCookie: async (req, res, next) => {
        if (!req.session.username) {
            if (req.signedCookies.USNA && req.cookies.KY) {
                let USNA = req.signedCookies.USNA
                let KY = req.cookies.KY
                await userConnection.checkCookie(USNA, KY).
                    then(async resolve => {
                        if (resolve) {
                            userConnection.deleteCookie(USNA, KY)
                            await userConnection.mapCookie(USNA, req.sessionID).then((resolve) => {
                                res.clearCookie('KY');
                                res.clearCookie('USNA');
                                res.cookie('USNA', USNA, { signed: true, maxAge: browerCookieLiveTime })
                                res.cookie('KY', req.sessionID, { maxAge: browerCookieLiveTime })
                                req.session.username = USNA
                            })
                        }
                    })
            } else {
                res.clearCookie('KY');
                res.clearCookie('USNA');
            }
        }
        next()
    },
    checkSession: (req, res, next)=>{
        if (req.session.username) {
            res.redirect('/welcome') 
        } else {
            next()
        }
    },
    getHome: (req, res) => {
        
        var data = fs.readFileSync("./public/JSON/top15.json")

        var movies_db = JSON.parse(data);
        
                res.render('home', { 
                    layout: false ,
                    Film:movies_db.slice(0,3)
                    
                })
       
       
    },
    getPage:async (req,res,next)=>{
        try {
            var data = fs.readFileSync("./public/JSON/top15.json")

            var ps = JSON.parse(data);
            let numP=ps.length;
            let perpage=3;
            let numpage=Math.ceil(numP/perpage);
            let pageH=parseInt(req.query.page)||1;
            let next=pageH==numpage? pageH : pageH+1;
            let prev=pageH==1?pageH:pageH-1;
            let start=(pageH-1)*perpage;
            let end=pageH*perpage;
            console.log('data controller',ps.slice(start,end));
            res.render('home',{
                layout: false ,
                Film:ps.slice(start,end),
                next:next,
                prev:prev

            });
        }catch(error){
            next(error);
        }
    },
    getlogin: (req, res) => {
        res.render('login', { layout: false })
    },
    getlogup: (req, res) => {
        res.render('signup', { layout: false })
    },
    checkLogin: async (req, res) => {
        await userConnection.getUser(req.body.username).then(async resolve => {
            if (!resolve) {
                res.redirect('/login')
            } else {
               
                const pwDb = req.body.password
                const salt = pwDb.slice(hashLength)
                const pwSalt = pwDb + salt
                const pwHashed = CryptoJS.SHA3(pwSalt,
                    {
                        outputLength: hashLength*4
                    }).toString(CryptoJS.enc.Hex)
                if (resolve.password === (pwHashed + salt)) {
                    req.session.username = req.body.username
                    if (req.body.allowcookie) {
                        res.cookie('USNA', req.body.username, { signed: true, maxAge: browerCookieLiveTime })
                        res.cookie('KY', req.sessionID, { maxAge: browerCookieLiveTime })
                        await userConnection.mapCookie(req.body.username, req.sessionID).then(resolve => {
                            ///Ch?ng g?i l?i form
                            req.session.regenerate(function (err) {
                                if (err) console.log(err)
                                req.session.save(function (err) {
                                    if (err) console.log(err)
                                })
                            })
                            res.redirect('/welcome')
                        }).catch(err => {
                            console.log(err)
                            res.redirect('/login')
                        })
                    } else {
                        res.redirect('/welcome')
                    }

                } else {
                    res.redirect('/login')
                }
            }
        }).catch(error => {
            console.log(error)
            res.redirect('/login')
        })
    },
    getlogout: async (req, res) => {
        if (req.signedCookies.USNA && req.cookies.KY)
            userConnection.deleteCookie(req.signedCookies.USNA, req.cookies.KY)

        res.clearCookie('KY');
        res.clearCookie('USNA');
        req.session.username = null
        req.session.save(function (err) {
            if (err) console.log(err)
            req.session.regenerate(function (err) {
                if (err) console.log(err)
                res.redirect('/')
            })
        })
    },
    checkLogup: async (req, res) => {
        await userConnection.getUser(req.body.username).then(async resolve => {
            if (!resolve) {
               let  password=req.body.password;
               const salt = Date.now().toString(16)
               const pwSalt = password+salt
               const pwHashed = CryptoJS.SHA3(pwSalt,{outputLength:hashLength*4}).toString(CryptoJS.enc.Hex)
              
                await userConnection.insertUser(req.body.username, pwHashed).then(resolve => {
                    res.redirect('/login')
                }).catch(err => {
                    console.log(err)
                    res.redirect('/logup')
                })
            } else {
                res.redirect('/logup')
            }
        }).catch(error => {
            console.log(error)
            res.redirect('/logup')
        })
    },
       
    getWelcome: (req, res) => {
        console.log(req.sessionID)
        console.log(req.session.cookie.maxAge)
        var data = fs.readFileSync("./public/JSON/top15.json")

        var movies_db = JSON.parse(data);
        
        res.render('welcome', { layout: false , Film:movies_db.slice(0,3)
        })
                   
                   
              
        
    },
    getInformation:async (req, res) => {
        person= await databaseConnection.getMovieById(req.query.idmovie);
        cast=await databaseConnection.getMovieCastsById(req.query.idmovie);
        reviews=await databaseConnection.getReviewById(req.query.idmovie);
        console.log(cast)
        console.log(reviews)
        var id=req.query.idmovie
        var ps = reviews;
                let numP=ps.length;
                let perpage=3;
                let numpage=Math.ceil(numP/perpage);
                let pageH=parseInt(req.query.page)||1;
                let next=pageH==numpage? pageH : pageH+1;
                let prev=pageH==1?pageH:pageH-1;
                let start=(pageH-1)*perpage;
                let end=pageH*perpage;
        
        res.render('movieInf',{
            layout:false,
            person:person,
            cast:cast,
            reviews:reviews.slice(start,end),
            next:next,
            prev:prev,
            id:id


          })

    },
    getCast :async (req, res) => {
        
        cast=await databaseConnection.getCastsById(req.query.idcast);
        console.log(cast)
        res.render('castInf',{
            layout:false,
            cast:cast
        })
    },

    getJSON: async (req, res) => {
        console.log(req.query)
        if (req.query.idmovie) {
            await databaseConnection.getMovieById(req.query.idmovie).then(resolve => {
                console.log(resolve)
              res.render('movieInf',{
                layout:false,
                person:resolve
              })
            }).catch(err => {
                console.log(err)
                res.json({})
            })
        } else if (req.query.idmoviecast) {
            await databaseConnection.getMovieCastsById(req.query.idmoviecast).then(resolve => {
                res.json(resolve)
            }).catch(err => {
                console.log(err)
                res.json({})
            })
        } else if (req.query.idmoviereviews) {
            await databaseConnection.getReviewById(req.query.idmoviereviews).then(resolve => {
                res.json(resolve)
            }).catch(err => {
                console.log(err)
                res.json({})
            })
        } else if (req.query.idmoviessynopses) {
            await databaseConnection.getSynopsesById(req.query.idcast).then(resolve => {
                res.json(resolve)
            }).catch(err => {
                console.log(err)
                res.json({})
            })
        } else if (req.query.idcast) {
            await databaseConnection.getCastsById(req.query.idcast).then(resolve => {
                res.json(resolve)
            }).catch(err => {
                console.log(err)
                res.json({})
            })
        } else {
            res.json({})
        }
    
    },
    getJSONUser: async (req, res) => {
        await userConnection.getUser(req.session.username).then(resolve => {
            res.json(resolve)
        }).catch(err => {
            console.log(err)
            res.json({})
        })
    },
    getSearch: async (req, res) => {
       var x= req.query.moviename;
      
       console.log(x);
        if (req.query.moviename) {
            await databaseConnection.searchMovieByName(req.query.moviename).then(resolve => {
                var ps = resolve;
                let numP=ps.length;
                let perpage=3;
                let numpage=Math.ceil(numP/perpage);
                let pageH=parseInt(req.query.page)||1;
                let next=pageH==numpage? pageH : pageH+1;
                let prev=pageH==1?pageH:pageH-1;
                let start=(pageH-1)*perpage;
                let end=pageH*perpage;
                res.render('search',{
                    layout:false,
                    Film:resolve.slice(start,end),
                    namesearch:x,
                    next:next,
                    prev:prev
                    
                })
            }).catch(err => {
                console.log(err)
                res.json({})
            })
        } else if (req.query.castname) {
            await databaseConnection.searchCastByName(req.query.castname).then(resolve => {
                res.render('search',{
                    layout:false,
                    Film:resolve
                })
            }).catch(err => {
                console.log(err)
                res.json({})
            })
        } else {
            res.json({})
        }
    },
    getSearchCast: async (req, res) => {
        console.log(req.query.cast)
        cast=await databaseConnection.searchCastByName(req.query.cast);
        console.log(cast)
       
        var id=req.query.cast
        
        var ps =cast;
                let numP=ps.length;
                let perpage=3;
                let numpage=Math.ceil(numP/perpage);
                let pageH=parseInt(req.query.page)||1;
                let next=pageH==numpage? pageH : pageH+1;
                let prev=pageH==1?pageH:pageH-1;
                let start=(pageH-1)*perpage;
                let end=pageH*perpage;
        
        res.render('cast',{
            layout:false,
            cast:cast.slice(start,end),
            next:next,
            prev:prev,
            id:id})

     },
}