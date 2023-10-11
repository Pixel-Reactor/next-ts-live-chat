
import DBconn from "../db.js";


export const CheckUsername = async (req, res) => {
 let connection
  try {
    const username = req.body.username || null
   
    
    connection = await DBconn();
    
     
   if (!username) res.send({status:203,message:'no username on the request'})

    const [check] =await connection.query(
      `
            SELECT username FROM user
            WHERE username =  ? ; 
            `,
      [username]
    );
    if(check.length){ 
     res.send({status:203,ok:false,message:'username in use'})
    }else{
      res.send({status:200,ok:true})
    }
  } catch (error) {
  
    console.log(error)
  } finally {
    connection.release()
}
};


