import db from '.'
import { User } from '../';
import { addOrg } from './org.db';
import { Connection } from 'postgresql-client';

export async function addUserOrg(userId:string, orgId:string, connection:Connection){
    const user = await findUserByField('userId', userId, connection)
    if(!user) throw new Error('invalid userId')
    user.orgs.push(orgId);
    await connection.query(
        `UPDATE Users SET orgs = ARRAY${user.orgs} WHERE userId=${userId}`); 
}

export async function addUser(user: User, connection:Connection){

    const newUserRes = await connection.query(
        `INSERT INTO Users (${Object.keys(user).join(', ')}, orgs)
        VALUES (${Object.values(user).join(', ')}, ARRAY[${user.firstName + "'s organisation"}]) RETURNING *;`)
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
        ${field} = ${value}`);
    return (res.rows as Array<any>)[0]
}