import { Connection } from 'postgresql-client';
import {Org} from '../'

export async function addOrg(org: Org, connection: Connection){
    const escapedOrg = {...org, 
        name: org.name.replace('\'', '\'\''),
        description: org.description?.replace('\'', '\'\'')}

    const newOrgRes = await connection.query(
        `INSERT INTO Organisations (${Object.keys(org).join(', ')})
        VALUES ('${Object.values(escapedOrg).join('\', \'')}') RETURNING *`);
    return (newOrgRes.rows as Array<any>)[0];
}

export async function getOrgById(orgId: string, connection: Connection){
    const res = await connection.query(
        `SELECT * FROM Organisations WHERE 
        orgId = '${orgId}'`);
    return  (res.rows as Array<any>)[0];
}

export async function getOrgs(orgs: string[], connection: Connection){

    let queryString = 'BEGIN;';
    orgs.forEach(org => {
        queryString += `SELECT * FROM Organisations
        WHERE orgId = '${org}';`
    })
    queryString += 'END;'
    const res = await connection.execute(queryString);

    return res.results.map(result => (result.rows as Array<any>)[0])

}