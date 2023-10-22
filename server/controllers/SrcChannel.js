
import DBconn from "../db.js";


export const SrcChannel = async (req,res) => {
    let connection
    try {
        connection = await DBconn();
        const {src}= req.body
        if(src.length<2){return  res.send({status:201,data:null}) ; }
      
        const [get] = await connection.query(
            `
            SELECT id,name,description FROM channel
            WHERE name LIKE '%${src}%' ;
            `,
           
        );
        if (get.length) {
            let data = get
            
            res.send({status:200,data:data}) ;
          
        } else {
            res.send({status:201,data:null}) ;
           
        }

    } catch (error) {
        res.send({status:201,data:null}) ;
    } finally {
       if(connection){connection.release()} 
    }
};


