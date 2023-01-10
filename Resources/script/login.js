$(window).on("load", function() {
    $(function () {
        let socket = io("http://localhost:9000");

        $("#btnLogin").on("click", function () {
            if ($("#username").val() == "" && $("#password").val() == "") {
                $("#loginResponseMessage").text("Please enter login details.");
            }
            else if ($("#username").val() == "") {
                // If any username is blank, do not attempt login.
                $("#loginResponseMessage").text("Please enter username.");
            } else if ($("#password").val() == "") {
                // If password is blank, do not attempt login.
                $("#loginResponseMessage").text("Please enter password.");
            } else {
                let user = [
                    $("#username").val(),
                    $("#password").val()
                ];
                socket.emit("login", user);
            }
        });

        socket.on("incorrect login", function(response) {
            $("#loginResponseMessage").text(response);
        });

        socket.on("logged in", function(user) {
            // Create a cookie for the logged in user and redirect them to the canvas page.
            window.location.replace("canvas.html");
            localStorage.setItem('loggedInFlag', 'true');
            localStorage.setItem('loggedInUser', user);
            localStorage.setItem('pixelsDrawnThisSession', '0');
        });
    });
});