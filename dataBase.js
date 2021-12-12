const db = require('./db')
class DataBase {
    async getCompliments() {
        let compliments = await db.query(`SELECT compliment FROM compliments`)
        console.log(compliments.rows)
        return compliments.rows
    }
    async setCompliments(compliments) {
        if (db.query(`SELECT compliment FROM compliments`).rows !== []) {
            return this.getCompliments()
        }
        for (let comp of compliments) {
            db.query(`INSERT INTO compliments (compliment) values (${comp})`)
        }
        return compliments
    }
    async shiftCompliments(comp) {
        return comp.shift()
    }
}
module.exports = new DataBase()
