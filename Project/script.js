// Create canvas grid.
let counter = 0;

for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        // Creating divs to use as pixels.
        let newPixel = document.createElement("div");
        newPixel.id = `pixel_${i}_${j}`;
        newPixel.classList.add("pixel");

        document.getElementById('canvas').append(newPixel)
    }
}

/*
$(".colour").on("click", function() {

    // let colour = $(this).css("background-color");
    let colour = "#FF0000";
    console.log(colour);
    $("#selectedColour").css("background-colour", colour);
})
*/