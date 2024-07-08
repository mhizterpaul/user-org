import db from '.'
import {Org} from '../'

export async function addOrg(org: Org){
    const newOrgRes = await db.connection.query(
        `INSERT INTO Users (${Object.keys(org).join(', ')})
        VALUES (${Object.values(org).join(', ')}) RETURNING *`);
    return (newOrgRes.rows as Array<any>)[0];
}

export async function getOrgById(orgId: string){
    const res = await db.connection.query(
        `SELECT * FROM Organisations WHERE 
        orgId = ${orgId}`);
    return  (res.rows as Array<any>)[0];
}

export async function getOrgs(orgs: string[]){
    let queryString = 'BEGIN;';
    orgs.forEach(org => {
        queryString += `SELECT * FROM Organisations
        WHERE orgId = ${org};`
    })
    queryString += 'END;'
    const res = await db.connection.execute(queryString);
    return res.results.map(result => (result.rows as Array<any>)[0])
}