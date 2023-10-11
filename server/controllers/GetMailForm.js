
import DBconn from "../db.js";


export const GetMailForm = async (req, res, next) => {
  let conexion;
  try {
    conexion = await DBconn();
    const { id } = req.params;
    console.log('id',id)
    
    if (!id) {
      res.send({status:201,done:false});
      return
    } 

    const [userId] = await conexion.query(
      `
            SELECT email
            FROM user
            WHERE id = ? 
            `,
      [id]
    );
    console.log(id)
    
    if (userId.length === 0) {
        res.send({status:202,email:null})
    }else{
        res.send({status:200,email:userId[0].email})
    }
   
  } catch (error) {
    console.log(error)
  } finally {
    if (conexion) conexion.release();
  }
};


