
import DBconn from "../db.js";
import { io } from "../index.js";
import { GetChannelsList } from "./GetChannelsList.js";
import { getConnectedUsers} from "./socketHandler.js";
import { GetPopular } from "./GetPopulars.js";
export const RemoveChannel = async (req, res) => {
    let connection
    const { save_id, user } = req.body;
    const connected = getConnectedUsers()
    function findSocketIdById(userId) {
        const user = connected.find(user => user.info.id === userId);
        return user ? user.socketId : null; // Retorna el socketId si se encuentra el usuario, de lo contrario, retorna null
    }

    const socketId = findSocketIdById(user);
    console.log('connected', getConnectedUsers())
    try {
        connection = await DBconn();
        const [del] = await connection.query(
            `
            DELETE FROM channel_saved WHERE save_id=? ;
            `, [save_id]
        );

        if (del.affectedRows > 0) {
            
            const list = await GetChannelsList(user);
            io.to(socketId).emit("savedchannels", list)
            res.send({ status: 200, done: true })
        } else {
            
            io.to(socketId).emit("savedchannels", list)
            res.send({ status: 200, done: false })

        }
        GetPopular();
    } catch (error) {
        console.log(error)
    } finally {
        if (connection) { connection.release() }
    }
};


