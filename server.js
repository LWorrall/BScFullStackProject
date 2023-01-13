let express = require("express");
let http = require("http");
let https = require("https");
let fs = require("fs");
let path = require("path");
let socketIo = require("socket.io");
let mongoose = require("mongoose");
let port = 9000;

let bcrypt = require("bcrypt");
let saltRounds = 10;

let options = {
    key: fs.readFileSync(path.join(__dirname, "Resources/ssl/client-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "Resources/ssl/client-cert.pem"))
};

// Set up the app and the server.
let app = express();
//let server = https.createServer(options, app);
let server = http.createServer(app);


// Configure the app to use staics in the 'Resources' folder.
app.use(express.static(path.join(__dirname, "Resources")));

// Set up the websocket.
let io = socketIo(server);

// Connecting to MongoDB Atlas database.
let url = "mongodb+srv://LWorrall:DBPassword123@database-cluster.zdqauzo.mongodb.net/ProjectDatabase?retryWrites=true&w=majority";
//let url = "mongodb+srv://user:password0451@cluster.nwnt7m0.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})
.then( () => { console.log("Connected to the databse."); })
.catch( (err) => { console.error(`Error connecting to the database: n${err}`); });


let userSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    PixelsDrawn: Number,
    FavouriteColour: String },
    {versionKey: false}
);

let User = mongoose.model("User", userSchema);

// This will log all the documents in the 'users' collection to the console.

User.find({}, {Username: 1}, function(err, result) {
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
    console.log("A client has connected.");

    // Send a client the current canvas when navigate to the canvas page.
    socket.on("request canvas", function() {
        console.log("Sending canvas...");
        socket.emit("send canvas", canvas);
    });

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
        console.log("A new user is attempting to register...");
        User.findOne({Username: user[0]}, {Username: 1})
        .then(
            res => { 
                if (res == null) {
                    // If no matching user is found in the database, create it.
                    console.log(`User '${user[0]}' does not already exist, creating user...`);
                    bcrypt.hash(user[1], saltRounds, function(err, hash) {
                        new User({ 
                            Username: user[0],
                            Password: hash,
                            PixelsDrawn: 0,
                            FavouriteColour: "Unknown"
                        }).save();
                        socket.emit("user created");
                    })
                } else {
                    // The query matches an already existing user in the database, another cannot be made.
                    console.log(`User '${res}' already exists, cannot create user.`);
                    socket.emit("user exists");
                }
            },
            // Handler for any error messages returned by the query.
            err => console.error(`Error: ${err}`),
        );
    });

    socket.on("login", async function(user) {
        console.log("A client is attempting login...");
        try {
            let userAttempt = await User.findOne({Username: user[0]});
            if (userAttempt == null) {
                console.log(`User '${user[0]}' does not exist.`);
                socket.emit("incorrect login", "Incorrect username or password.");
            } else {
                bcrypt.compare(user[1], userAttempt.Password, async function(err, result) {
                    // If username and password match, user will log in.
                    if (result == true) {
                        let userTemp = await User.findOne({Username: user[0]});
                        let pixels =  userTemp.PixelsDrawn;
                        console.log(`User '${user[0]}' has logged in.`);
                        console.log(pixels);
                        let userDetails = [ user[0],pixels ];
                        socket.emit("logged in", userDetails);
                    } else if (result == false) {
                        // If something doesn't match, the user will not be able to log in.
                        socket.emit("incorrect login", "Incorrect username or password.");
                    } else { err => console.error(`Error: ${err}`); }
                })
            }
        }
        catch(err) { console.log(err); }
    });

    socket.on("logged out", function(user) {
        console.log(`User ${user[0]} has logged out.`);
        console.log(`Number of pixels they drew whilst logged in: ${user[1]}.`);
        updateUser(user);
    })
});

// Function to update the user's stats on their MongoDB document.
async function updateUser(user) {
    let updateUser = await User.findOne({Username: user[0]});
    updateUser.PixelsDrawn = +updateUser.PixelsDrawn + +user[1];
    await updateUser.save();
}

server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});