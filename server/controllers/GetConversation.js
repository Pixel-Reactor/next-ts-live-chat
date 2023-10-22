
import DBconn from "../db.js";


export const GetConversation = async (req, res) => {
    let connection
    const user = req.isUser;
    const target = req.body.with
    try {
        connection = await DBconn();
        const [get] = await connection.query(

            `SELECT id,sender,recipient from conversation where sender = ? and recipient=? or recipient=? and sender =?`,
            [user, target, user, target]

        );
        if (get.length) {
            get[0].new = 0;
          
            res.send({ status: 200, conversation: get[0] })
        } else {
            res.send({ status: 200, conversation: null })
        }


    } catch (error) {
        console.log(error)
    } finally {
        connection.release()
    }
};


