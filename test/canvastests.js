let chai = require("chai")
let request = require("request");
let mocha = require("mocha")

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


mocha.it('Canvas Page', function(done) {
    request('http://localhost:9000/view/canvas.html' , function(error, response, body) {
        chai.assert.equal(response.statusCode, 200, "Wrong status code (page unreachable). ");
        //chai.expect($("#pixel_0")).to.exist;
        chai.expect(document.querySelector("pixel_0")).to.exist;
        done();
    });
});
