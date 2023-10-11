
import DBconn from "../db.js";


export const GetUserInfo = async (req, res) => {
    let connection
    try { 
        connection = await DBconn();
        const id = req.body.target

        const [get] = await connection.query(
            `
            SELECT avatar,username,bio,name FROM user
            WHERE id = ? ;
            `,
            [id]
        );
        if (get.length) {
            let data = get[0]
            
            res.send({ status: 200, ok: true, info:data })
        } else {
            res.send({ status: 203, ok: false, message: 'Cannot get user info' })

        }

    } catch (error) {
        console.log(error)
    } finally {
        connection.release()
    }
};


