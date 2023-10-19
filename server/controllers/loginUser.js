
import DBconn from "../db.js";
import jwt from 'jsonwebtoken';


export const loginUser = async (req, res, next) => {
  let conexion;
  try {
    let options = {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'Lax',

    }
    conexion = await DBconn();
    const { email, pwd } = req.body;

    if (!email || !pwd) return res.send({ status: 201, message: 'Email or password missing' })


    const [user] = await conexion.query(
      `
            SELECT id, name, username,bio, email, avatar,active
            FROM user
            WHERE email = ? AND pwd = SHA2(?,256)
            `,
      [email, pwd]
    );

    if (user.length < 1) {
     return res.send({ status: 201, message: 'Wrong email or password' })
    }

    const info = {
      id: user[0].id,
      fecha: new Date(),
    };

    const usuario = {
      id: user[0].id,
      name: user[0].nombre,
      username: user[0].username,
      bio:user[0].bio,
      email: user[0].email,
      active: user[0].active,
      avatar: user[0].avatar
    };

    if (usuario.active === 0) {
      return res.send({ done: false, message: 'User not active' })
    }

    const token = jwt.sign(info, process.env.SECRET_TOKEN, {
      expiresIn: '30d',

    });
  
    res.send({
      status: 200,
      message: 'login',
      token: token,
      username: usuario.username,
      name:usuario.name,
      bio:usuario.bio,
      avatar: usuario.avatar,
      nombre:usuario.nombre,
      id: usuario.id,
    });

  } catch (error) {
    res.send({ status: 503, message: 'Something went wrong' });
  } finally {
    if (conexion) conexion.release();
  }
};


