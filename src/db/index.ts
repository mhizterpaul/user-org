import {Connection} from 'postgresql-client'
import createTables from './createTables';


class Database {
    connection!: Connection;
    static errorHandler (error: {[key:string]:any}) {
        let message = '';
        for(const key in error){
            message += `${key}: ${error[key]} \n`
        };
        console.error('Error', `cannot connect to the database \n ${message}`)
        process.exit(1) 
    }
    constructor () {

        const connection = new Connection({
            host: process.env.PGHOST,
            port: Number(process.env.PGPORT),
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE
        })
        connection.connect()
        .then(data => {
            this.connection = connection;
            createTables(connection)
            .catch(Database.errorHandler);
        })
        .catch(Database.errorHandler) 
    }
}

const db = new Database();


export default db