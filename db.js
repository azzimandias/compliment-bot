const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    password: '3496',
    host: 'localhost',
    port: 5432,
    database: 'corgi'
})
module.exports = pool
