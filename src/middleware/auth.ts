import {Request, Response, NextFunction} from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'


export default (req: Request, res:Response, next:NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.JWTSECRET||'secret', (err, decoded) => {
    if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    const payload = decoded as JwtPayload;
    req.body.userId = payload?.id;
    next();
    });
}