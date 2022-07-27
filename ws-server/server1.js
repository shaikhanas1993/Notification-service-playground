const express = require("express");
const bodyParser = require('body-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

var cors = require('cors')
const pubClient = createClient({ url: "redis://localhost:6379" });

const subClient = pubClient.duplicate();
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
    adapter: createAdapter(pubClient, subClient)
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    httpServer.listen(3000, () => {
        console.log("i m listening on port" + 3000)
    });
}).catch(e => {
    console.error(e);
    process.kill(process.pid, 'SIGTERM');
});

io.on("connection", async (socket) => {
    //do some ceremony work that needs to be done
    console.log("connected to socket " + socket.id);
    socket.on('createRoom', async (room) => {
        await io.of('/').adapter.remoteJoin(socket.id, room);
    });
});


io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});

//long running simulation of sockets
//rooms are deleted automatically when non client is connected.
const triggerLongRunningAction = (client, room) => {

    setTimeout(() => {
        io.to(room).emit("message", "processing step 1 long running action for" + client);
        setTimeout(() => {
            io.to(room).emit("message", "processing step 2 long running action for" + client);
        }, 200);
        setTimeout(() => {
            io.to(room).emit("message", "processing step 3 long running action for" + client);
        }, 200);
    }, 200);
}

//long running action
app.post('/someLongRunningAction', async (req, res) => {
    let client = req.body?.name;
    let room = req.body?.room

    //just playing to see the no of sockets connected to a room
    console.log("room " + room);
    try {

        const sockets = await io.in(room).allSockets();
        console.log(sockets); // a Set containing the socket ids in 'room3'
    } catch (e) {
        console.error(e);
    }

    triggerLongRunningAction(client, room);
    res.send('Running long Running action for client' + client)
})



process.on('SIGTERM', () => {
    if (httpServer.listening) {
        httpServer.close(() => {
            console.log('Process terminated');
        });
    }
});