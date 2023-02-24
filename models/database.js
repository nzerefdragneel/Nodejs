const { db } = require("./connect")
///
const gendb = `
CREATE TABLE IF NOT EXISTS cookiesmapping (
    username character varying(50) NOT NULL,
    key character varying(50) NOT NULL,
    PRIMARY KEY (key)
);
CREATE TABLE IF NOT EXISTS users (
    username character varying(50) NOT NULL,
    password character varying(64) NOT NULL,
    movie character varying(5000),
    PRIMARY KEY (username)
);
drop table if exists reviews;
drop table if exists movies;
drop table if exists movies_casts;
drop table if exists synopses;
drop table if exists casts;

CREATE TABLE IF NOT EXISTS movies (
    idmovie character(10) NOT NULL,
    img character varying(300),
    title character varying(250),
    year integer,
    toprank integer,
    rating double precision,
    ratingcount integer,
    genres character varying(250),
	PRIMARY KEY (idmovie)
);
CREATE TABLE IF NOT EXISTS reviews
(
    idmovie character(10) NOT NULL,
    author character varying(250),
    authorrating double precision,
    helpfulnessscore double precision,
    interestingvotes character varying(50),
    languagecode character(5),
    reviewtext character varying(10000),
    reviewtitle character varying(1000),
    submissiondate character(10)
);
CREATE TABLE IF NOT EXISTS synopses
(
    idmovie character(10) NOT NULL,
    hasprofanity boolean NOT NULL,
    text character varying(50000),
    language character(5),
    PRIMARY KEY (idmovie)
);
CREATE TABLE IF NOT EXISTS movies_casts
(
    idmovie character(10) NOT NULL,
    idcast character(10) NOT NULL,
    name character varying(100),
    characters character varying(1000)
);
CREATE TABLE IF NOT EXISTS casts
(
    id character(10) NOT NULL,
    image character varying(300),
    legacynametext character varying(200),
    name character varying(100),
    birthdate character(10),
    birthplace character varying(1000),
    gender character(6),
    heightcentimeters double precision,
    nicknames character varying(500),
    realname character varying(300),
    PRIMARY KEY (id)
);
`

module.exports = {
    createDatabase: async () => {
        const rs = await db.none(gendb)
        return rs
    },
    pushMovie: async (movie) => {
        try {
            const rs = await db.one
                (`INSERT INTO
                "movies"("idmovie", "img", "title", "year",
                         "toprank", "rating", "ratingcount", "genres")
                VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                    [movie.id, movie.img, movie.title,
                    movie.year, movie.topRank, movie.rating,
                    movie.ratingCount, movie.genres])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    pushMovies_cast: async (movies_cast) => {
        try {
            const rs = await db.one
                (`INSERT INTO
                "movies_casts"("idmovie", "idcast", "name", "characters")
                VALUES($1, $2, $3, $4) RETURNING *`,
                [movies_cast.idmovie, movies_cast.id, movies_cast.name,
                    movies_cast.characters])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    pushSynopse: async (synopse) => {
        try {
            const rs = await db.one
                (`INSERT INTO
                "synopses"("idmovie", "hasprofanity", "text", "language")
                VALUES($1, $2, $3, $4) RETURNING *`,
                    [synopse.idmovie, synopse.hasProfanity, synopse.text,
                    synopse.language])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    pushReview: async (review) => {
        try {
            const rs = await db.one
                (`INSERT INTO
                "reviews"("idmovie", "author", "authorrating", "helpfulnessscore", "interestingvotes",
                          "languagecode", "reviewtext", "reviewtitle", "submissiondate")
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                    [review.idmovie, review.author, review.authorRating,
                        review.helpfulnessScore, review.interestingVotes, review.languageCode,
                        review.reviewText, review.reviewTitle, review.submissionDate])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    pushCast: async (cast) => {
        try {
            const rs = await db.one
                (`INSERT INTO
                "casts"("id", "image", "legacynametext", "name", "birthdate",
                        "birthplace", "gender", "heightcentimeters", "nicknames", "realname")
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
                    [cast.id, cast.image, cast.legacyNameText,
                    cast.name, cast.birthDate, cast.birthPlace,
                    cast.gender, cast.heightCentimeters, cast.nicknames, cast.realName])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    getMovieById: async (movieid) => {
        try {
            const rs = await db.one
                (`select * from movies mv where mv.idmovie = $1`,
                    [movieid])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    searchMovieByName: async (moviename) => {
        try {
            const rs = await db.any
                (`select * from movies mv where UPPER(mv.title) LIKE UPPER(concat('%',$1,'%'))`,
                    [moviename])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    searchCastByName: async (castname) => {
        try {
            const rs = await db.any
                (`select * from casts ca where UPPER(ca.name) LIKE UPPER(concat('%',$1,'%'))`,
                    [castname])
                    return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    getReviewById: async (movieid) => {
        try {
            const rs = await db.any
                (`select * from reviews rv where rv.idmovie=$1`,
                    [movieid])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    getSynopsesById: async (movieid) => {
        try {
            const rs = await db.one
                (`select * from synopses sy where sy.idmovie=$1`,
                    [movieid])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    getMovieCastsById: async (movieid) => {
        try {
            const rs = await db.any
                (`select * from movies_casts mc where mc.idmovie=$1`,
                    [movieid])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    getCastsById: async (castid) => {
        try {
            const rs = await db.one
                (`select * from casts ca where ca.id=$1`,
                    [castid])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    getTop15Movie : async() => {
    try {
        const rs = await db.any
            (`select * from movies mv where mv.rating IS NOT NULL
                order by mv.rating DESC
                FETCH FIRST 15 ROWS ONLY`)
        return rs
    } catch (err) {
        console.log(err)
        return 0
    }
},
}