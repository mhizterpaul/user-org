import {Connection} from 'postgresql-client'
import createTables from './createTables';


class Database {
    connection;
    static errorHandler (error) {
        let message = '';
        for(const key in error){
            message += `${key}: ${error[key]} \n`
        };
        console.error('Error', `cannot connect to the database \n ${message}`)
        process.exit(1) 
    }
    constructor () {

        const connection = new Connection()
        connection.connect()
        .then(data => {
            this.connection = data;
            createTables(data)
            .catch(Database.errorHandler);
        })
        .catch(Database.errorHandler) 
    }
}

const db = new Database();


export default db