
import DBconn from "../db.js";
import { io } from "../index.js";


export const GetPopular = async () => {
    let connection
    try {
        connection = await DBconn();

     
        const [get] = await connection.query(
            `
            SELECT channel_id,channel_name, COUNT(*) AS quantity
            FROM channel_saved
            GROUP BY channel_id,channel_name
            ORDER BY quantity desc
            LIMIT 3;
            `
        );
        if (get.length) {
            let data = get
            io.emit('popularchannels',data)
        } else {
            return {
                create_at: "",
                created_by: "",
                description: "",
                id: "default",
                name: "general",
                message: 'Cannot get channel info'
            }
        }

    } catch (error) {
        console.log(error)
    } finally {
        connection.release()
    }
};


