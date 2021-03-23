const port = 9000 || process.env.PORT;
const express = require('express');
const cors = require('cors');
var app = express();
const router = express.Router();
const bp = require('body-parser')
// app = app.use(cors());
// app = app.use(express.json());
// app = app.use(express.urlencoded({ extended: true }));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var ioClient = require('socket.io-client');
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
var table = [];

router.get("/", (req, res, next) => {
    res.send("hello 1");
});



app.post('/add', (req, res) => {
    var newTable = req.body.num;
    var connectionOptions = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        "transports": ["websocket"]
    };
    const socket = ioClient("https://service-table.herokuapp.com/", connectionOptions);
    socket.on('connect', function (data) {
        socket.emit('join', 'hello server from client');
        socket.on('thread', (data) => {
            // table = data;
            socket.disconnect();
        });
    });

    if (table.indexOf(newTable) > -1) {
        var y = table.indexOf(newTable);
        table.splice(y, 1);
    } else {
        table.push(newTable);
    }
    socket.emit('message', table);
})

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
        table = data;
        console.log(table);
        client.emit('thread', data);
        client.broadcast.emit('thread', data);
    })
});


app.use(router);
server.listen(process.env.PORT, () => {
    console.log("App is lisport " + process.env.PORT)
})