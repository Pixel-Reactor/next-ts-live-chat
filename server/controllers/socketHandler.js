import { io } from "../index.js";
import { socketUser } from "./socketUser.js";
import DBconn from "../db.js";
import { GetChannelInfo } from "./GetChannelInfo.js";
import { GetChannelsList } from "./GetChannelsList.js";
import { v4 as uuidv4 } from "uuid";

let connectedUsers = [];

export const SocketHandler = async () => {
  const connection = await DBconn();
  try {


    console.log("started")
    io.on("connection", (socket) => {
      console.log("a user connected")
        
      socket.on("id", async (id) => {
       

        socket.userId = id; 
       
        const userInfo = await socketUser(id.id);
        const channelinfo = await GetChannelInfo(id.channel)

        function buscarObjetoPorId(arr, id) {
          return arr.find((obj) => obj.id === id);
        }
        const isIn = buscarObjetoPorId(connectedUsers, id.id)
        if (isIn === undefined) {
          connectedUsers.push(userInfo);
        }
        io.emit("users", {
          connected: connectedUsers,
        });
        const list = await GetChannelsList();
        io.emit("allchannels", list)
        io.emit("channelinfo", channelinfo)
      });


      socket.on("sendmessage", async (message) => {
        console.log(message)
        const userInfo = await socketUser(message.from);
        const messageId = uuidv4();
        const save = await connection.query(`INSERT INTO messages(id,sender,recipient,text) VALUES(?,?,?,?);`, [messageId, userInfo.id, message.channel.id, message.message.text])

        if (save[0].affectedRows > 0) {
          const date = new Date();

          socket.broadcast.emit("newmessage", { sender: userInfo, text: message.message.text, date: date, id: messageId, channel: message.channel.id })        
      
        } else {
          io.emit("newmessage", { sender: userInfo, text: " An error occurred retrieving this message ", date: date })
        }
      });

      socket.on("logout", () => {
        connectedUsers = connectedUsers.filter(user => user.id !== socket.userId);
        socket.disconnect();
        console.log("user logged out")
      });
      socket.on("disconnect", () => {
        console.log("disconnected")
        connectedUsers = connectedUsers.filter(user => user.id !== socket.userId);
        io.emit("users", {
          connected: connectedUsers
        });
      });
    });
  } catch (error) {
    socket.broadcast.emit("newmessage", { sender: userInfo, text: "An error occured retrieving this message" })
  } finally {
    connection.release()
  }

}
