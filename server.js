let express = require("express");
let http = require("http");
let path = require("path");
let socketIo = require("socket.io");
let mongoose = require("mongoose");
let port = 9000;


// Set up the app and the server.
let app = express();
let server = http.createServer(app);


// Configure the app to use staics in the 'Resources' folder.
app.use(express.static(path.join(__dirname, "Resources")));

// Set up the websocket.
let io = socketIo(server);

// Connecting to MongoDB Atlas database.
let url = "mongodb+srv://LWorrall:DBPassword123@database-cluster.zdqauzo.mongodb.net/ProjectDatabase?retryWrites=true&w=majority";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})
.then( () => { console.log("Connected to the databse."); })
.catch( (err) => { console.error(`Error connecting to the database: n${err}`); });

let userSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    Stats: [
        { pixelsDrawn: Number },
        { favouriteColour: String }
    ]
});

let User = mongoose.model("User", userSchema);

// This will create a new document in the 'users' collection in the 'projectDatabase' database on the Atlas cluster.
new User({
    Username: "TestUser5",
    Password: "TestPassword5"
}).save();

// This will log all the documents in the 'users' collection to the console.
User.find({}, function(err, result) {
    if(err) { console.log(err); }
    else { console.log(`Result: ${JSON.stringify(result)}`) };
});



// generate an array used for pixels.
let numberOfPixels = 900;
let canvas = [];
for (let i = 0; i < numberOfPixels; i++) {
    canvas[i] = "#FFFFFF";
};


// "On connection" handler.
io.on("connection", function(socket) {
    // Send a client the current canvas when they connect.
    console.log("A client has connected, sending canvas...")
    socket.emit("send canvas", canvas);

    // When the server receives the 'send pixel' event from a client...
    socket.on("send pixel", function(pixel) {
        console.log("Server has received a drawn pixel from a client.");
        // Update the canvas kept by the server.
        canvas[pixel[0]] = pixel[1];
        // ... The server will emit the 'received pixel' event to every client.
        socket.broadcast.emit("received pixel", pixel);
    });

    // When the server receives the 'register' event from a client, it will create a new user document.
    socket.on("register", function(user) {
        console.log("A new user has registered.");
        console.log(user[0]);
        console.log(user[1]);
        new User({ 
            Username: user[0],
            Password: user[1],
            Stats: [
                { pixelsDrawn: 0 },
                { favouriteColour: ""}
            ]
        }).save();
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});