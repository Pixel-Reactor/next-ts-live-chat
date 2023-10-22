import DBconn from "../db.js";
import { v4 as uuidv4 } from 'uuid';
import { io } from "../index.js";
import { GetChannelsList } from "./GetChannelsList.js";
import { getConnectedUsers} from "./socketHandler.js";


const CreateChannel = async (req, res, next) => {
    const connection = await DBconn();
    const connected = getConnectedUsers()

    try {
        const { name, description } = req.body;
        const userId = req.isUser;

        const channelId = uuidv4()

        function findSocketIdById(user) {
            const find = connected.find(find => find.info.id === user);
            return find ? find.socketId : null;
        }
    
        const socketId = findSocketIdById(userId);
        const [exist]= await connection.query(`SELECT * FROM channel WHERE name=?`,[name]);
        const [count]= await connection.query(`SELECT COUNT(id) AS count from channel WHERE created_by = ?`,[userId]);
        if(count[0].count >=3 ){
            return res.send({ status: 201, done: false, message: 'Only 3 channel creation per user allowed' });
        }
        if(exist.length){return res.send({ status: 201, done: false, message: 'Channel name in use, please choose another' }); return}

        const [response] = await connection.query(
            'INSERT INTO channel(id,name,created_by,description) VALUES(?,?,?,?)',
            [channelId, name, req.isUser, description])

        const [check] = await connection.query(
            `SELECT id,name FROM channel WHERE id= ?`, [channelId]
        )
      
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
                `, [uuidv4(), userId, check[0].id, check[0].name,userId,check[0].name]
        );
        if (response.affectedRows > 0) {
            const list = await GetChannelsList(userId);
            io.to(socketId).emit("savedchannels", list)
            res.send({ status: 200, done: true })
        } else {
            res.send({ status: 201, done: false, message: ' there was an error creating the channel' }); return
        }
    } catch (error) {
        console.log(error);
        res.send({ status: 201, done: false, message: 'DB Error' })
    } finally {
        connection.release()
    }
}

export default CreateChannel
