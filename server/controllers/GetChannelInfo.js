
import DBconn from "../db.js";


export const GetChannelInfo = async (id) => {
    let connection
    try {
        connection = await DBconn();
       
        console.log(id)
        const [get] = await connection.query(
            `
            SELECT * FROM channel
            WHERE id = ? ;
            `,
            [id]
        );
        if (get.length) {
            let data = get[0]
            
            return data
        } else {
            return {
                create_at: "",
                created_by:"",
                description:"",
                id:"default",
                name:"general",
                message: 'Cannot get channel info'
            }  

        }

    } catch (error) {
        console.log(error)
    } finally {
        connection.release()
    }
};


