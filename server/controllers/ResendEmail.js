import DBconn from "../db.js";

const ResendEmail = async (req, res, next) => {
    const connection = await DBconn();

    try {
        const { email } = req.body;
        console.log(email)

        const actCode = await connection.query('SELECT act_code,email FROM user WHERE email = ? ', [email])
        console.log(actCode);

        if (actCode[0].length) {
            req.Code = actCode[0].act_code;
            next()
        } else {
            res.send({ status: 201, done: false, message: 'no se ha encontrado ningun usuario con este email' })
        }
    } catch (error) {
        console.log(error);
        res.send({ status: 201, done: false })
    } finally {
        connection.release()
    }


}

export default ResendEmail
