import DBconn from "../db.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import { fileURLToPath } from 'url';

import path from 'path';

const newUser = async (req, res, next) => {
    const connection = await DBconn();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    try {
     
        const { username, pwd, bio, name, email, city } = req.body
        console.log(username, pwd, bio)
       
    
        const avatar = req.file ? `${process.env.BACK_URL}/avatar/${req.file.filename}` : null
        //process.env.BACK_URL}/avatar/${data.avatar}
        const code = uuidv4();


        const response = await connection.query(
            'INSERT INTO user(id,name,username,email,avatar,city,pwd,active,act_code) VALUES(?,?,?,?,?,?,SHA2(?,256),?,?)',
             [uuidv4(), name, username, email, avatar,city, pwd, 0, code])

        if (response[0].affectedRows > 0) {
            req.Saved = true;
            req.Code = code;
            next()
        } else {
            res.send({ status: 201, done: false, message: 'DB Error' }) ;return
        }
    } catch (error) {
        console.log(error);  
        res.send({ status: 201, done: false , message: 'DB Error' })
    } finally {
        connection.release()
    }


}

export default newUser
