
import DBconn from "../db.js";


export const ConfirmUser = async (req, res) => {
 let conexion
  try {

    const code = req.params.code || 'no-code'
    conexion = await DBconn();
    
    
   if(!code){res.send('no hay codigo')}
    const [check] =await conexion.query(
      `
            SELECT id,act_code FROM user
            WHERE act_code = ? ;
            `,
      [code]
    ); 

    if(check[0].act_code && check[0].act_code === code ){
      const [activation] = await conexion.query(
          `UPDATE user
           SET active = 1
           WHERE id =?`,
          [check[0].id]
        );
    
      res.redirect(`${process.env.FRONT_URL}/register/activate`)

    }else{
      res.send({status:201,done:false,message:'Error al activar el usuario'})
    }
    
  } catch (error) {
    console.log(error)
  } 
};


