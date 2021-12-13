const Pool = require('pg').Pool
const pool = new Pool({
    host: 'ec2-52-209-246-87.eu-west-1.compute.amazonaws.com',
    database: 'dahcii52epf2v7',
    user: 'fxecnjmqfzlmhc',
    port: 5432,
    password: process.env.DB_PASSWORD,
    uri: process.env.DB_URI
})
module.exports = pool
