const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server,{cors:{origin:"*"}});
const PORT = process.env.PORT || 9999;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './build')));

const rooms = new Map();

app.get("/rooms/:id", (req, res) => {
    const { id: roomId } = req.params;
    const obj = rooms.has(roomId) 
    ? {
         users: [...rooms.get(roomId).get("users").values()],
         messages: [...rooms.get(roomId).get("messages").values()]
    } 
    : { users: [], messages: [] };
    res.json(obj);
});

app.post("/rooms", (req, res) => {
    const {roomId, userName} = req.body
    if(!rooms.has(roomId)){
        rooms.set(roomId, new Map([
            ["users", new Map()],
            ["messages", []]
        ]))
    };
    res.send();
})

io.on("connection", (socket) => {
    socket.on("ROOM:JOIN", ({ roomId, userName }) => {
        socket.join(roomId);
        rooms.get(roomId).get("users").set(socket.id, userName);
        const users = [...rooms.get(roomId).get("users").values()];
        socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
    });

    socket.on("disconnect", () => {
        rooms.forEach((value, roomId) => {
            if(value.get("users").delete(socket.id)) {
                const users = [...value.get("users").values()];
                socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
            }
        });
    })

    socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text}) => {
        const obj = {
            userName,
            text
        }
        rooms.get(roomId).get("messages").push(obj);
        socket.broadcast.to(roomId).emit("ROOM:NEW_MESSAGE", obj);
    })

    console.log("User connection", socket.id)
});

server.listen(PORT, (err) => {
    if(err) {
        throw Error(err)
    };
    console.log("Server live");
});