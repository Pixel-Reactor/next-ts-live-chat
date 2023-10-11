
import DBconn from "../db.js";


export const CheckEmail = async (req, res) => {
 let connection
  try {
    const email = req.body.email || null
    
    connection = await DBconn();

   if(!email)res.send({status:203,message:'no email on the request'}) 
    const [check] =await connection.query(
      `
            SELECT email FROM user
            WHERE email = ? ;
            `,
      [email]
    );
    if(check.length ){
     res.send({status:203,ok:false,message:'email in use'})
    }else{
      res.send({status:200,ok:true})
    }
    
  } catch (error) {
    console.log(error)
  } finally {
    connection.release()
}
};
 

