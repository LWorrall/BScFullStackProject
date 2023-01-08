$(window).on("load", function() {
    $(function () {
        let socket = io("http://localhost:9000");

        $("#btnRegister").on("click", function () {
            if ($("#password").val() == $("#repeatPassword").val()) {
                let user = [];
                user[0] = $("#username").val();
                user[1] = $("#password").val();
                socket.emit("register", user);
            }
        });
    });
});

$(function() {
    let loggedInFlag = false;
})