
import DBconn from "../db.js";


export const GetChannelsList = async (id) => {
    let connection
    try {
        connection = await DBconn();
        
        const [get] = await connection.query(
            `SELECT * FROM channel_saved WHERE user_id=?;`,[id]
        );
        if (get.length) {
            let data = get;
            return { status: 200, ok: true, list: data }
        } else {
            return { status: 203, ok: false, message: 'Cannot get channel list' }
        }

    } catch (error) {
        console.log('channel list error',error)
    } finally {
        connection.release()
    }
};


