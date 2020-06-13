const MongoClient = require("mongodb").MongoClient;

const DB_NAME = "youtube";

class MongoDb  {
    constructor() {
        this.mongoClient = new MongoClient("mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    async getConnection() {
        if (this.connection) {
            return this.connection;
        }

        this.connection = await this.mongoClient.connect();

        if (!this.connection) return new Error("Fail connection to database");

        return this.connection.db(DB_NAME);
    }
}

module.exports = new MongoDb();