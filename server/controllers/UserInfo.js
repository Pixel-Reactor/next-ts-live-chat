
import DBconn from "../db.js";


export const userInfo = async (id) => {
    let connection
    try { 
        connection = await DBconn();
        
        const [get] = await connection.query(
            `
            SELECT id,avatar,username,bio,name FROM user
            WHERE id = ? ;
            `,
            [id]
        );
        if (get.length) {
            let data = get[0]
            
           return data
        } else {
            return null

        }

    } catch (error) {
       return null
    } finally {
        connection.release()
    }
};


