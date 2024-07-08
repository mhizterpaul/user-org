"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_client_1 = require("postgresql-client");
const createTables_1 = __importDefault(require("./createTables"));
class Database {
    static errorHandler(error) {
        let message = '';
        for (const key in error) {
            message += `${key}: ${error[key]} \n`;
        }
        ;
        console.error('Error', `cannot connect to the database \n ${message}`);
        process.exit(1);
    }
    constructor() {
        const connection = new postgresql_client_1.Connection({
            host: process.env.PGHOST,
            port: Number(process.env.PGPORT),
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE
        });
        connection.connect()
            .then(data => {
            this.connection = connection;
            (0, createTables_1.default)(connection)
                .catch(Database.errorHandler);
        })
            .catch(Database.errorHandler);
    }
}
const db = new Database();
exports.default = db;
