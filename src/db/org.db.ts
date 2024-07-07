import db from '.'

export async function addOrg(org){
    const newOrgRes = await db.connection.query(
        `INSERT INTO Users (${Object.keys(org).join(', ')})
        VALUES (${Object.values(org).join(', ')}) RETURNING *`);
    return newOrgRes.rows[0];
}

export async function getOrgById(orgId){
    const res = await db.connection.query(
        `SELECT * FROM Organisations WHERE 
        orgId = ${orgId}`);
    return res.rows.length ? res.rows[0] : null;
}

export async function getOrgs(orgs){
    let queryString = 'BEGIN;';
    orgs.forEach(org => {
        queryString += `SELECT * FROM Organisations
        WHERE orgId = ${org};`
    })
    queryString += 'END;'
    const res = await db.connection.execute(queryString);
    return res.results.map(result => result.rows[0])
}