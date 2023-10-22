
import DBconn from "../db.js";
import { io } from "../index.js";
import { userInfo} from "./UserInfo.js";

export const GetConversations = async (req, res) => {
    let connection
    const user = req.isUser;
    try {
        connection = await DBconn();
        const [get] = await connection.query(

            `SELECT id,sender,recipient from conversation where sender = ? or recipient=?`,
            [user, user]

        );
        if (get.length){
            const filterList =await Promise.all(
            
                get.map(async item => {
                const other = item.sender === user ? item.recipient : item.sender;
                const getUser = await userInfo(other)
                return { conversationId: item.id, with: getUser ,new:1}
            })
            );
  
           return res.send({ status: 200, list: filterList })
        }

        res.send({ status: 200, list: null })

    } catch (error) {
        console.log(error)
    } finally {
        connection.release()
    }
};


