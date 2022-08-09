process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'pgoicsyibypdze',
    password: process.env.DB_PASSWORD,
    database: 'd7qck71212frgl',
    port: 5432,
    host: 'ec2-52-51-3-22.eu-west-1.compute.amazonaws.com',
    uri: process.env.DB_URI,
    ssl: true
})
module.exports = pool
