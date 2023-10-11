
import DBconn from "../db.js";


export const GetChannelsList = async () => {
    let connection
    try {
        connection = await DBconn();
        
        const [get] = await connection.query(
            `SELECT * FROM channel;`
        );
        if (get.length) {
            let data = get;
            return { status: 200, ok: true, list: data }
        } else {
            return { status: 203, ok: false, message: 'Cannot get messages' }
        }

    } catch (error) {
        console.log(error)
    } finally {
        connection.release()
    }
};


