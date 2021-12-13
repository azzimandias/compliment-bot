process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const db = require('./db')
const Console = require("console");
class DataBase {
    /*async getIdx() {
        return await db.query(`SELECT idx FROM idxs`)
    }
    async iterIdx(i) {
        await db.query(`UPDATE idxs SET idx = ${i++}`)
    }*/
    async getCompliments() {
        let compliments = await db.query(`SELECT compliment FROM compliments`)
        return compliments.rows
    }
    async setCompliments(compliments) {
        if (db.query(`SELECT compliment FROM compliments`).rows !== []) {
            console.log('get')
            return this.getCompliments()
        }
        for (let comp of compliments) {
            console.log('set')
            db.query(`INSERT INTO compliments VALUES (\'${comp}\')`)
        }
        return compliments
    }
    async shiftCompliments() {
        await db.query(`DELETE FROM compliments WHERE id in (1)`)
        await db.query(`ALTER TABLE compliments DROP COLUMN id`)
        await db.query(`ALTER TABLE compliments ADD COLUMN id SERIAL PRIMARY KEY`)
        let compliments = await db.query(`SELECT compliment FROM compliments`)
        console.log(compliments)
    }
    async addId() {
        await db.query(`ALTER TABLE compliments ADD COLUMN id SERIAL PRIMARY KEY`)
    }
}
module.exports = new DataBase()
