process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'fxecnjmqfzlmhc',
    password: process.env.DB_PASSWORD,
    database: 'dahcii52epf2v7',
    port: 5432,
    host: 'ec2-52-209-246-87.eu-west-1.compute.amazonaws.com',
    uri: process.env.DB_URI,
    ssl: true
})
module.exports = pool
