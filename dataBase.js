process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const db = require('./db')
class DataBase {
    async getCompliments() {
        let compliments = await db.query(`SELECT compliment FROM compliments`)
        return compliments.rows.then(result => result)
    }
    async setCompliments(compliments) {
        if (db.query(`SELECT compliment FROM compliments`).rows !== undefined) {
            console.log('get')
            return this.getCompliments()
        }
        for (let comp of compliments) {
            db.query(`INSERT INTO compliments VALUES (\'${comp}\')`)
        }
        console.log('set')
        return compliments
    }
    async shiftCompliments() {
        await db.query(`DELETE FROM compliments WHERE id in (1)`)
        await db.query(`ALTER TABLE compliments DROP COLUMN id`)
        await db.query(`ALTER TABLE compliments ADD COLUMN id SERIAL PRIMARY KEY`)
        let compliments = await db.query(`SELECT compliment FROM compliments`)
        //console.log(compliments)
    }
    async addId() {
        if (db.query(`SELECT id FROM compliments`).rows !== undefined) {
            await db.query(`ALTER TABLE compliments DROP COLUMN id`)
        }
        else {
            await db.query(`ALTER TABLE compliments ADD COLUMN id SERIAL PRIMARY KEY`)
        }
    }
}
module.exports = new DataBase()
