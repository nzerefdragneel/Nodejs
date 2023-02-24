const initDatabase = require("../models/database")
const fs = require('fs');
var data = fs.readFileSync("./movies.json")
var movies_db = JSON.parse(data);

var reviews_db = new Array()
var Movies_casts_db = new Array()
var synopses_db = new Array()
async function createDatabase() {
    await initDatabase.createDatabase()
    return 1
}
async function importMovies() {

    for (var i = 0; i < movies_db.length; i++) {
        try {
            reviews = movies_db[i].reviews
        } catch (err) {
            console.log(err)
            reviews = []
        }
        try {
            casts = movies_db[i].casts
        } catch (err) {
            console.log(err)
            casts = []
        }
        try {
            synopses = movies_db[i].synopses
        } catch (err) {
            console.log(err)
            synopses = null
        }
        delete movies_db[i]['reviews']
        delete movies_db[i]['casts']
        delete movies_db[i]['synopses']
        for (var j = 0; j < reviews.length; j++) {
            reviews[j].idmovie = movies_db[i].id
            reviews_db.push(reviews[j])
            await initDatabase.pushReview(reviews[j])
        }
        for (var j = 0; j < casts.length; j++) {
            casts[j].idmovie = movies_db[i].id
            Movies_casts_db.push(casts[j])
            await initDatabase.pushMovies_cast(casts[j])
        }
        if (synopses) {
            synopses.idmovie = movies_db[i].id
            synopses_db.push(synopses)
            await initDatabase.pushSynopse(synopses)
        }
        if (movies_db[i].genres) {
            movies_db[i].genres = movies_db[i].genres.toString()
        }
        await initDatabase.pushMovie(movies_db[i])
    }
    return 1
}
var data = fs.readFileSync('./casts.json');
var casts_db = JSON.parse(data);
async function importCasts() {

    for (var i = 0; i < casts_db.length; i++) {
        if (casts_db[i].nicknames) {
            casts_db[i].nicknames = casts_db[i].nicknames.toString()
        }

        await initDatabase.pushCast(casts_db[i])
    }
    return 1
}

module.exports = {
    importAndUpload : async () => {
        await createDatabase().then(async resolve => {
            await importMovies().then(async resolve => {
                await importCasts().then(async resolve => {
                    var Top15 = await initDatabase.getTop15Movie()
                    fs.writeFile('./public/JSON/top15.json', JSON.stringify(Top15), 'utf8', (err) => {
                        console.log(err)
                    })
                })
            })
        })
        return 1
    }
}