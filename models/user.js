const { db } = require("./connect")

module.exports = {
    getUser: async (username) => {
        try {
            const rs = await db.one
                (`select * from users us where us.username = $1`, [username])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    insertUser: async (username, password) => {
        try {
            const rs = await db.none
                (`INSERT INTO users (username,password) VALUES ($1, $2)`, [username, password])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    mapCookie: async (username, secret) => {
        try {
            const rs = await db.none
                (`INSERT INTO cookiesmapping (username,key) VALUES ($1, $2)`, [username, secret])
            return 1
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    checkCookie: async (username, secret) => {
        try {
            const rs = await db.one
                (`select * from cookiesmapping cm where cm.username=$1 and cm.key=$2`, [username, secret])
            return rs
        } catch (err) {
            console.log(err)
            return 0
        }
    },
    deleteCookie: async (username, secret) => {
        try {
            const rs = await db.none
                (`DELETE FROM cookiesmapping cm WHERE cm.username = $1 and cm.key = $2;`, [username, secret])
            return 1
        } catch (err) {
            console.log(err)
            return 0
        }
    }, 
}