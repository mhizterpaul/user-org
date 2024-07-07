import db from '.'
import { User } from '../..';
import { addOrg } from './org.db';

export async function addUserOrg(userId:string, orgId:string){
    const user = await findUserByField('userId', userId)
    if(!user) throw new Error('invalid userId')
    user.orgs.push(orgId);
    await db.connection.query(
        `UPDATE Users SET orgs = ARRAY${user.orgs} WHERE userId=${userId}`); 
}

export async function addUser(user: User){

    const newUserRes = await db.connection.query(
        `INSERT INTO Users (${Object.keys(user).join(', ')}, orgs)
        VALUES (${Object.values(user).join(', ')}, ARRAY[${user.firstName + "'s organisation"}]) RETURNING *;`)
    await addOrg({
        name: user.firstName + "'s organisation",
        description: ''
    })
    return newUserRes.rows[0]
}

export async function findUserByField(field:string, value:string){
    //return the first matching user from the database
    const res = await db.connection.query(
        `SELECT * FROM Users WHERE 
        ${field} = ${value}`);
    return res.rows.length ? res.rows[0] : null;
}

