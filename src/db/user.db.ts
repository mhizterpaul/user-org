import { User } from '../';
import { addOrg } from './org.db';
import { Connection } from 'postgresql-client';

export async function addUserOrg(userId:string, orgId:string, connection:Connection){
    const user = await findUserByField('userId', userId, connection)
    if(!user) throw new Error('invalid userId')
    user[6].push(orgId);
    await connection.query(
        `UPDATE Users SET orgs = ARRAY[${user[6]}] WHERE userId='${userId}'`); 
}

export async function addUser(user: User, connection:Connection){
    const queryString = `INSERT INTO Users (${Object.keys(user).join(', ')}, orgs)
        VALUES ('${Object.values(user).join('\', \'')}', ARRAY['${user.firstName + '\'\'s organisation'}']) RETURNING *;`;

    const newUserRes = await connection.query(queryString)

    await addOrg({
        name: user.firstName + "'s organisation",
        description: ''
    }, connection)

    return (newUserRes.rows as Array<any>)[0]
}

export async function findUserByField(field:string, value:string, connection: Connection){
    //return the first matching user from the database
    const res = await connection.query(
        `SELECT * FROM Users WHERE 
        ${field} = '${value}'`);
    return (res.rows as Array<any>)[0]
}