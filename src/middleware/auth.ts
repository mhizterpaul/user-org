import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'


export default (req: Request, res:Response, next:NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.SECRET||'', (err, decoded) => {
    if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded?.id;
    next();
    });
}

