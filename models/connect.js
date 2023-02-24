const initOptions = {}
const pgp = require('pg-promise')(initOptions)
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'DB2',
    user: 'postgres',
    password: '1',
    max: 30
}

const db = pgp(cn)

module.exports = { db }