const port = 9000 || process.env.PORT;
const express = require('express');
const cors = require('cors');
var app = express();
const router = express.Router();
// app = app.use(cors());
// app = app.use(express.json());
// app = app.use(express.urlencoded({ extended: true }));

var server = require('http').createServer(app);
var io = require('socket.io')(server);


router.get("/", (req, res, next) => {
    res.send("hello 1");
});

// app.post('/add', (req, res) => {
//     res.send(JSON.stringify(req.body));
// })

io.on('connection', (client) => {
    console.log('we have a new connection');
    client.on("disconnect", () => {
        console.log("user has left");
    });
    client.on('join', function (data) {
        console.log(data);
    })
    client.on('message', function (data) {
        if (typeof data === "string") data = JSON.parse(data);
        console.log(data);
        client.emit('thread', data);
        client.broadcast.emit('thread', data);
    })
});


app.use(router);
server.listen(process.env.PORT, () => {
    console.log("App is lisport " + port)
})