$(window).on("load", function() {
    $(function () {
        let socket = io("http://localhost:9000");

        // When the client loads into the website, this socket handler populates the client's canvas with the current canvas
        socket.on("send canvas", function(canvas) {
            console.log("canvas received");
            for (let i = 0; i < canvas.length; i++) {
                // Creating divs to use as pixels.
                let newPixel = document.createElement("div");
                newPixel.id = `pixel_${i}`;
                newPixel.classList.add("pixel");
                newPixel.style.backgroundColor = canvas[i];
                document.getElementById('canvas').append(newPixel)
            };
        });
    
        socket.on("received pixel", function(pixel) {
            console.log("A pixel was received.");
            // Code to draw received pixel on the canvas.
            let drawnPixel = `#pixel_${pixel[0]}`;
            $(drawnPixel).css("background-color", pixel[1]);
        });
    
        // Colouring the canvas pixel with the selected colour when clicked.
        $('#canvas').on("click", ".pixel", function() {
            let colour = $("#selectedColour").css("background-color");
            $(this).css("background-color", colour);
            // The function will then update the canvas array with the pixel's new colour.
            let index = $(this).attr('id').slice(6);
            console.log(index);
            canvas[index] = colour;
    
            // Send this to the server.
            let pixel = [index, colour];
            socket.emit("send pixel", pixel);
        })
    })
})

// Clicking one of the colours on the palette will set it as the selected colour.
$(".colour").on("click", function() {
    let colour = $(this).css("background-color");
    console.log(colour);
    $("#selectedColour").css("background-color", colour);
})