$(window).on("load", function() {
    $(function () {
        let socket = io("http://localhost:9000");
        // Function for the 'register' button. 
        $("#btnRegister").on("click", function () {
            if ($("#username").val() == "" || $("#password").val() == "" || $("#repeatPassword").val() == "") {
                // If any field is blank, do not create a user.
                $("#responseMessage").text("Please fill in every field.");
            } else if ($("#password").val() != $("#repeatPassword").val()) {
                // If the two passwords do not match.
                $("#responseMessage").text("Both passwords do not match.");
            } else {
                let user = [];
                user[0] = $("#username").val();
                user[1] = $("#password").val();
                socket.emit("register", user);
            }
        });

        socket.on("user exists", function() {
            $("#responseMessage").removeClass("success");
            $("#responseMessage").addClass("error");
            $("#responseMessage").text("An account with this username already exists.");
        });

        socket.on("user created", function() {
            $("#responseMessage").removeClass("error");
            $("#responseMessage").addClass("success");
            $("#responseMessage").text("Account created.");
            // Redirect to new page.
        });
    });
});