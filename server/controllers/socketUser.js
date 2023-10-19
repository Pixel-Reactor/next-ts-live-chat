
import DBconn from "../db.js";


export const socketUser = async (id) => {
    let connection
    try {
        connection = await DBconn();
        const [get] = await connection.query(
            `
            SELECT avatar,username,bio,name FROM user
            WHERE id = ? ;
            `,
            [id]
        );
        if (get.length) {
            let data = get[0]
            
            data.id= id
           return data
        } else {
          return {
            avatar: 'http://192.168.1.143:7000/avatar/user.png',   
            username: 'not found',
            bio: null,
            name: 'none'
          }

        }

    } catch (error) {
        return {
            avatar: 'http://192.168.1.143:7000/avatar/user.png',   
            username: 'not found',
            bio: null,
            name: 'none'
          }
    } finally {
        connection.release()
    }
};


