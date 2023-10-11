import DBconn from "../db.js";
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path';

export const formCheck = async (req, res,next) => {
    
    const {name,username,pwd,email}= req.body;
    const file = req.file || null
    const connection = await DBconn();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
     try {
        const DeleteFile=()=>{
              if(req.file){ 
                fs.unlinkSync(__dirname + '/../avatars/'+ req.file.filename)}
           
        }
        if (!username || !pwd || !email) {
            DeleteFile()
            res.status(403).json({status:403, done: false, message: 'Username , password and email are mandatory' })
            return
        }
        if (pwd.length < 8) { 
            DeleteFile()
            res.status(403).json({ status: 403, done: false, message: 'Password must contain 8 characters minimum ' }); 
            return 
        }
        
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        const validate  = reg.test(email);
       
        const checkUsername = await connection.query('SELECT id FROM user WHERE username = ? ', [username])
        
        const checkEmail = await connection.query('SELECT id FROM user WHERE email = ? ', [email])
        
        if (checkEmail[0].length || !validate){
            DeleteFile()
            res.status(403).json({status:403, done: false, message: 'Invalid email' }); 
            return
        }
        if(checkUsername[0].length){
            DeleteFile()
            res.status(403).json({status:403, done: false, message: 'Username in use alreeady' }); 
            return
        }

        next()
       
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({status:403, message: 'form error' })
    }
    finally{ 
        connection.release()
    }
       
    

}
