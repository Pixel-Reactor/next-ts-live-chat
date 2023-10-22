
import DBconn from "../db.js";


export const GetPrivateMessages = async (req, res) => {
    let connection
    try { 
        connection = await DBconn();
        const conversationId = req.body.conversation
        
        const [get] = await connection.query(
            `
            SELECT dm.id,dm.created_at,conversation_id,dm.text, 
            JSON_OBJECT('avatar', user.avatar, 'username', user.username) AS sender
            FROM dm
            INNER JOIN user ON dm.sender = user.id
            WHERE dm.conversation_id = ? ORDER BY created_at ASC;
            `,
            [conversationId]
        );


       


        
        if (get.length) {
            let data = get;

            
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


