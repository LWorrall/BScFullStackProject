let express = require("express");
let http = require("http");
let path = require("path");
let socketIo = require("socket.io");
let port = 9000;

// Set up the app and the server.
let app = express();
let server =http.createServer(app);

// Configure the app to use staics in the 'Resources' folder.
app.use(express.static(path.join(__dirname, "Resources")));

// Set up the websocket.
let io = socketIo(server);

// "On connection" handler.
io.on("connection", function(socket) {

    // When the server receives the 'send pixel' event from a client...
    socket.on("send pixel", function(pixel) {
        console.log("Server has received a drawn pixel from a client.");
        // ... The server will emit the 'received pixel' event to every client.
        socket.broadcast.emit("received pixel", pixel);
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});