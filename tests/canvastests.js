function clickElement(element) {
    try {
        element.trigger("click");
    } catch(err) {
        var event = new MouseEvent("click", {view: window, cancelable: true, bubbles: true});
        element.dispatchEvent(event);
    }
}

function rgb2hex(color) {
    var digits = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/.exec(color);
    if (digits == null) {
        digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
    }
    var red = parseInt(digits[2],10);
    var green = parseInt(digits[3],10);
    var blue = parseInt(digits[4],10);
    var rgb = blue | (green << 8) | (red << 16);
    if(red == 0){
        return digits[1] + '#00' + rgb.toString(16);
    }else{
        return digits[1] + '#' + rgb.toString(16);
    }
}

suite("Client Canvas Tests", function() {

    test("1: Check the canvas is displayed on the page.", function() {
        expect($("#pixel_899")).to.exist;
    });

    test("2: Check the canvas disallows painting when user is not logged in.", function() {
        clickElement($("#pixel_0"));
        let colour = rgb2hex($("#pixel_0").css("background-color"));
        chai.assert.equal(colour, "#FFFFFF", "Pixel should be colour #FFFFFF (white).");
    });


    
})