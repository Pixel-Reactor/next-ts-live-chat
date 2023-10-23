import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import https from 'https';
import fs from 'fs';
import routes from './routes/routes.js';
import bodyParser from 'body-parser';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { SocketHandler } from './controllers/socketHandler.js';


const app = express();


const httpsOptions = {
  key: fs.readFileSync('...privkey.pem'), // Ruta a tu clave privada
  cert: fs.readFileSync('...fullchain.pem'),
};


 
const server = https.createServer(httpsOptions, app);

app.use(cookieParser())

const corsOptions={ 
   origin: 'https://donut.pixel-reactor.com', 
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true
}


app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


app.use((err, req, res, next) => {
    console.log('error handler', err);
    res.json({ done: false, status: 403, message: err.message, field: err.field })
})

export const io = new SocketServer(server, {
    cors: corsOptions,
})
app.use(routes);

SocketHandler()
app.use(morgan('dev'));
 
server.listen(process.env.PORT);
('Server running on port : ' + process.env.PORT) 
