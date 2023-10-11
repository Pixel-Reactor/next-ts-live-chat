
import DBconn from "../db.js";


export const GetMessages = async (req, res) => {
    let connection
    try {
        connection = await DBconn();
        const channel = req.body.target
        const [get] = await connection.query(
            `
            SELECT messages.*, 
            JSON_OBJECT('avatar', user.avatar, 'username', user.username) AS sender
            FROM messages
            INNER JOIN user ON messages.sender = user.id
            WHERE messages.recipient = ? ORDER BY date ASC;
            `,
            [channel]
        );
        if (get.length) {
            let data = get;

            res.send({ status: 200, ok: true, info: data })
        } else {
            res.send({ status: 203, ok: false, message: 'Cannot get messages' })

        }

    } catch (error) {
        console.log(error)
    } finally {
        connection.release()
    }
};


