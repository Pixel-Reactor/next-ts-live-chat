
import DBconn from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { io } from "../index.js";
import { GetChannelsList } from "./GetChannelsList.js";
import { getConnectedUsers } from "./socketHandler.js";
import { GetPopular } from "./GetPopulars.js";
export const PrivateMessage = async (req, res) => {
    let connection
    const recipient = req.body.to;
    const text = req.body.message.text
    const user = req.isUser;
   


    const connected = getConnectedUsers()
    function findSocketIdById(user) {
        const find = connected.find(find => find.info.id === user);
        return find ? find.socketId : null;
    }
    const fromSocketId = findSocketIdById(user);
    const toSocketId = findSocketIdById(recipient);



    try {
        connection = await DBconn();
        const [check] = await connection.query(
            `SELECT id,sender,recipient from conversation where sender = ? and recipient =? or sender = ? and recipient=?`,
            [user, recipient, recipient, user]
        )
        if (!check.length) {
          
            const conversationId = uuidv4();
            const messageId = uuidv4();
            const [create] = await connection.query(
                `INSERT INTO conversation(id,sender,recipient) VALUES(?,?,?)`, [conversationId, user, recipient]
            )
            const [save] = await connection.query(
                `INSERT INTO dm(id,conversation_id,sender,text) VALUES(?,?,?,?)`, [messageId, conversationId, user, text]
            );
            const [getInserted] = await connection.query(
                `
                SELECT dm.id,dm.created_at,conversation_id,dm.text, 
                JSON_OBJECT('id', user.id,'avatar', user.avatar, 'username', user.username) AS sender
                FROM dm
                INNER JOIN user ON dm.sender = user.id
                WHERE dm.id = ? ;

                
                `, [messageId]
            )
            io.to(fromSocketId).to(toSocketId).emit('privatemessage', getInserted[0])
            io.to(fromSocketId).to(toSocketId).emit('conversationupd', getInserted[0])
            io.to(toSocketId).emit("notification",getInserted[0])
        }
        else {
        
            const conversationId = check[0].id
            const messageId = uuidv4()
           
            const [save] = await connection.query(
                `INSERT INTO dm(id,conversation_id,sender,text) VALUES(?,?,?,?);
                
                `, [messageId, conversationId, user, text]
            )
            const [getInserted] = await connection.query(
                `SELECT dm.id,dm.created_at,conversation_id,dm.text, 
                JSON_OBJECT('id', user.id,'avatar', user.avatar, 'username', user.username) AS sender
                FROM dm
                INNER JOIN user ON dm.sender = user.id
                WHERE dm.id = ? ;
                `, [messageId]
            )
            
            io.to(fromSocketId).to(toSocketId).emit('privatemessage', getInserted[0]);
            io.to(toSocketId).emit("notification",getInserted[0])
        }

        res.send('ok')
    } catch (error) {
        console.log(error)
    } finally {
        if (connection) { connection.release() }
    }
};


