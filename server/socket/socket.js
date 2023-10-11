



const connectedUsers = [];
io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('id', (id) => {
      socket.id= id
      connectedUsers.push(socket.id);
      console.log(connectedUsers)
  
      // Emites un evento "users" para actualizar la cantidad de usuarios conectados
      io.emit('users', {
        connected: connectedUsers
      });
    });
    socket.on('logout', () => {
      const index = connectedUsers.indexOf(socket.id);

      console.log(index)
      if (index !== -1) {
        connectedUsers.splice(index, 1);
      }
     
      socket.disconnect();  
      console.log('disconnected')
    });
    socket.on('disconnect', () => {
      console.log('a user disconnected', socket.id,connectedUsers[0]);
      const index = connectedUsers.indexOf(socket.id);
      console.log(index)
      if (index !== -1) {
        connectedUsers.splice(index, 1);
      }
      console.log('connectados',connectedUsers.length)
      // Emites un evento "users" para actualizar la cantidad de usuarios conectados
      io.emit('users', {
        connected: connectedUsers
      });
    });
  });
  server.listen(process.env.PORT);

  export default app