$(window).on("load", function() {
    $(function () {
        let socket = io("http://localhost:9000");

        $("#btnLogin").on("click", function () {
            if ($("#username").val() == "" || $("#password").val() == "") {
                // If any field is blank, do not attempt login.
                $("#responseMessage").removeClass("success");
                $("#responseMessage").addClass("error");
                $("#responseMessage").text("Please fill in every field.");
            } else {
                let user = [];
                user[0] = $("#username").val();
                user[1] = $("#password").val();
                socket.emit("login", user);
            }
        });

        socket.on("logged in", function(user) {
            window.location.replace("canvas.html");
            localStorage.setItem('loggedInFlag', 'true');
            localStorage.setItem('loggedInUser', user);
            localStorage.setItem('pixelsDrawnThisSession', '0');
        });
    });
});