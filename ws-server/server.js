const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
var cors = require('cors')

const app = express();
app.use(cors())
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});
var clients = 0;
io.on("connection", (socket) => {
    clients++;
    console.log(socket.id);
    console.log(clients);
    io.local.emit("users_count", clients); //broadcast to all connected clients 

    socket.on('create', function (room) {
        socket.join(room);
    });

    var counter = 1;
    setInterval(() => {
        console.log("sending data for client 1");
        socket.in('client1').emit("message", Math.random() + " for client 1") //Send only to a particular client connected to the room (1 to 1)
    }, 9000);

    setInterval(() => {
        console.log("sending data for client 2");
        socket.in('client2').emit("message", Math.random() + " for client 2") //Send only to a particular client connected to the room (1 to 1)
    }, 9000);

    setInterval(() => {
        console.log("broadcast data for client 1");
        counter = counter + 1
        socket.broadcast.to('client1').emit("message", counter + " for client 1") //broadcast  to all particular clients connected to the room (1 to many)
    }, 5000);


});

httpServer.listen(3000, () => {
    console.log("i m listening on port" + 3000)
});