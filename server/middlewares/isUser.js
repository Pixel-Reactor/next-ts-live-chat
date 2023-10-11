import DBconn from "../db.js";
import jsonwebtoken from 'jsonwebtoken';

export const isUser = async (req, res, next) => {

    try {
        const validate = jsonwebtoken.verify(req.headers.authorization, process.env.SECRET_TOKEN);
        req.isUser = validate.id
      
        next()

    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid Token' })
    }
   
}
