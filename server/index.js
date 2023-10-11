import express from 'express'
import morgan from 'morgan'
import { Server as SocketServer } from 'socket.io'
import http from 'http'
import routes from './routes/routes.js';
import bodyParser from 'body-parser';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { SocketHandler } from './controllers/socketHandler.js';


const app = express();

const server = http.createServer(app)
app.use(cookieParser())

app.use(cors({  
    origin:'*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


app.use((err, req, res, next) => {
    console.log('error handler', err);
    res.json({ done: false, status: 403, message: err.message, field: err.field })
})

export const io = new SocketServer(server, {
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    } 
})
app.use(routes);

SocketHandler()
app.use(morgan('dev'));


 
server.listen(process.env.PORT);


('Server running on port : ' + process.env.PORT) 