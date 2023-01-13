let loggedInFlag = "false";
let pixelsDrawn = 0;

$(window).on("load", function() {
    $(function () {
        
        // Clicking one of the colours on the palette will set it as the selected colour.
        $(".colour").on("click", function() {
            let colour = $(this).css("background-color");
            console.log(colour);
            $("#selectedColour").css("background-color", colour);
        })

        // Generate a canvas (will be done server-side).
        let canvas = generateCanvas();

        let testPixel = [0,"#000000"]

        // Function should use the generated canvas and display it.
        canvasReceived(canvas);

        receivedPixel(testPixel);

        // Colouring the canvas pixel with the selected colour when clicked.
        $('#canvas').on("click", ".pixel", function() {
            if (loggedInFlag != "true") {
                alert("You must be logged in to draw.");
            } else if ($(this).css("background-color") == $("#selectedColour").css("background-color")) {
                // Don't do anything if the pixel is already the selected colour.
            } else {
                pixelsDrawn++;
                $("#pixelsDrawnCounter").text(pixelsDrawn);
                let colour = $("#selectedColour").css("background-color");
                $(this).css("background-color", colour);
            };
        })
    })
})

// Function to generate a canvas to be used. This will be held on the server.
function generateCanvas() {
    let numberOfPixels = 900;
    let canvas = [];
    for (let i = 0; i < numberOfPixels; i++) {
        canvas[i] = "#FFFFFF";
    };
    return canvas;
}

// This function will be used when the client receives a canvas from the server.
function canvasReceived(canvas) {
    console.log("canvas received");
    for (let i = 0; i < canvas.length; i++) {
        // Creating divs to use as pixels.
        let newPixel = document.createElement("div");
        newPixel.id = `pixel_${i}`;
        newPixel.classList.add("pixel");
        newPixel.style.backgroundColor = canvas[i];
        document.getElementById('canvas').append(newPixel)
    };
}

function receivedPixel(pixel) {
    console.log("A pixel was received.");
    // Code to draw received pixel on the canvas.
    let drawnPixel = `#pixel_${pixel[0]}`;
    $(drawnPixel).css("background-color", pixel[1]);
}