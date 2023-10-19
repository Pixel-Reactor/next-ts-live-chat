
import DBconn from "../db.js";
import { v4 as uuidv4 } from "uuid";
import { io } from "../index.js";
import { GetChannelsList } from "./GetChannelsList.js";
import { getConnectedUsers} from "./socketHandler.js";
import { GetPopular } from "./GetPopulars.js";
export const SaveChannel = async (req, res) => {
    let connection
    const { user, channel } = req.body;
  
    const connected = getConnectedUsers()
    function findSocketIdById(user) {
        const find = connected.find(find => find.info.id === user);
        return find ? find.socketId : null; 
    }

    const socketId = findSocketIdById(user);
   

    try {
        connection = await DBconn();

        const [save] = await connection.query(
            `
            INSERT INTO channel_saved (save_id, user_id, channel_id, channel_name)
            SELECT ?, ?, ?, ?
            FROM dual
            WHERE NOT EXISTS (
                SELECT 1
                FROM channel_saved
                WHERE user_id = ? AND channel_name = ?
                LIMIT 1
            ); ;
            `, [uuidv4(), user, channel.id, channel.name, user, channel.name]

        );
     

        if (save.affectedRows > 0) {
            const list = await GetChannelsList(user);
            io.to(socketId).emit("savedchannels", list)
            res.send({ status: 200, done: true, repeted: false })
        } else {
            const list = await GetChannelsList(user);
            io.to(socketId).emit("savedchannels", list)
            res.send({ status: 200, done: true, repeted: true })
        }
        GetPopular();
    } catch (error) {
        console.log(error)
    } finally {
        if (connection) { connection.release() }
    }
};


